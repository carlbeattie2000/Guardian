/*
 * @adonisjs/auth
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { AccessToken } from "@adonisjs/auth/access_tokens";
import { symbols, errors } from "@adonisjs/auth";
import {
	AuthClientResponse,
	GuardConfigProvider,
	GuardContract,
} from "@adonisjs/auth/types";
import {
	AccessTokensGuardEvents,
	AccessTokensUserProviderContract,
} from "@adonisjs/auth/types/access_tokens";
import { Secret } from "@adonisjs/core/helpers";
import type { HttpContext } from "@adonisjs/core/http";
import type { EmitterLike } from "@adonisjs/core/types/events";
import { ConfigProvider } from "@adonisjs/core/types";

const { E_UNAUTHORIZED_ACCESS } = errors;

/**
 * Implementation of access tokens guard for the Auth layer. The heavy lifting
 * of verifying tokens is done by the user provider. However, the guard is
 * used to seamlessly integrate with the auth layer of the package.
 */
export class AccessTokensGuardCustom<
	UserProvider extends AccessTokensUserProviderContract<unknown>,
	RefreshProvider extends AccessTokensUserProviderContract<unknown>,
> implements
		GuardContract<
			UserProvider[typeof symbols.PROVIDER_REAL_USER] & {
				currentAccessToken: AccessToken;
			}
		>
{
	/**
	 * Events emitted by the guard
	 */
	declare [symbols.GUARD_KNOWN_EVENTS]: AccessTokensGuardEvents<
		UserProvider[typeof symbols.PROVIDER_REAL_USER] & {
			currentAccessToken: AccessToken;
		}
	>;

	/**
	 * A unique name for the guard.
	 */
	#name: string;

	/**
	 * Reference to the current HTTP context
	 */
	#ctx: HttpContext;

	/**
	 * Provider to lookup user details
	 */
	userProvider: UserProvider;

	refreshProvider: RefreshProvider;

	/**
	 * Emitter to emit events
	 */
	#emitter: EmitterLike<
		AccessTokensGuardEvents<
			UserProvider[typeof symbols.PROVIDER_REAL_USER] & {
				currentAccessToken: AccessToken;
			}
		>
	>;

	/**
	 * Driver name of the guard
	 */
	driverName: "access_tokens" = "access_tokens";

	/**
	 * Whether or not the authentication has been attempted
	 * during the current request.
	 */
	authenticationAttempted = false;

	/**
	 * A boolean to know if the current request has
	 * been authenticated
	 */
	isAuthenticated = false;

	/**
	 * Reference to an instance of the authenticated user.
	 * The value only exists after calling one of the
	 * following methods.
	 *
	 * - authenticate
	 * - check
	 *
	 * You can use the "getUserOrFail" method to throw an exception if
	 * the request is not authenticated.
	 */
	user?: UserProvider[typeof symbols.PROVIDER_REAL_USER] & {
		currentAccessToken: AccessToken;
	};

	constructor(
		name: string,
		ctx: HttpContext,
		emitter: EmitterLike<
			AccessTokensGuardEvents<
				UserProvider[typeof symbols.PROVIDER_REAL_USER] & {
					currentAccessToken: AccessToken;
				}
			>
		>,
		userProvider: UserProvider,
		refreshProvider: RefreshProvider,
	) {
		this.#name = name;
		this.#ctx = ctx;
		this.#emitter = emitter;
		this.userProvider = userProvider;
		this.refreshProvider = refreshProvider;
	}

	/**
	 * Emits authentication failure and returns an exception
	 * to end the authentication cycle.
	 */
	#authenticationFailed() {
		const error = new E_UNAUTHORIZED_ACCESS("Unauthorized access", {
			guardDriverName: this.driverName,
		});

		this.#emitter.emit("access_tokens_auth:authentication_failed", {
			ctx: this.#ctx,
			guardName: this.#name,
			error,
		});

		return error;
	}

	/**
	 * Returns the bearer token from the request headers or fails
	 */
	#getBearerToken(): string {
		const bearerToken = this.#ctx.request.header("authorization", "")!;
		const [type, token] = bearerToken.split(" ");
		if (!type || type.toLowerCase() !== "bearer" || !token) {
			throw this.#authenticationFailed();
		}

		return token;
	}

	#getRefreshToken() {
		const refreshTokenCookie = this.#ctx.request.header("refresh_token", "")!;
		if (!refreshTokenCookie) {
			throw this.#authenticationFailed();
		}
		return refreshTokenCookie;
	}

	/**
	 * Returns an instance of the authenticated user. Or throws
	 * an exception if the request is not authenticated.
	 */
	getUserOrFail(): UserProvider[typeof symbols.PROVIDER_REAL_USER] & {
		currentAccessToken: AccessToken;
	} {
		if (!this.user) {
			throw new E_UNAUTHORIZED_ACCESS("Unauthorized access", {
				guardDriverName: this.driverName,
			});
		}

		return this.user;
	}

	/**
	 * Authenticate the current HTTP request by verifying the bearer
	 * token or fails with an exception
	 */
	async authenticate(): Promise<
		UserProvider[typeof symbols.PROVIDER_REAL_USER] & {
			currentAccessToken: AccessToken;
		}
	> {
		/**
		 * Return early when authentication has already
		 * been attempted
		 */
		if (this.authenticationAttempted) {
			return this.getUserOrFail();
		}

		/**
		 * Notify we begin to attempt the authentication
		 */
		this.authenticationAttempted = true;
		this.#emitter.emit("access_tokens_auth:authentication_attempted", {
			ctx: this.#ctx,
			guardName: this.#name,
		});

		/**
		 * Decode token or fail when unable to do so
		 */
		const bearerToken = new Secret(this.#getBearerToken());

		/**
		 * Verify for token via the user provider
		 */
		const token = await this.userProvider.verifyToken(bearerToken);
		if (!token) {
			throw this.#authenticationFailed();
		}

		/**
		 * Check if a user for the token exists. Otherwise abort
		 * authentication
		 */
		const providerUser = await this.userProvider.findById(token.tokenableId);
		if (!providerUser) {
			throw this.#authenticationFailed();
		}

		/**
		 * Update local state
		 */
		this.isAuthenticated = true;
		this.user =
			providerUser.getOriginal() as UserProvider[typeof symbols.PROVIDER_REAL_USER] & {
				currentAccessToken: AccessToken;
			};
		this.user!.currentAccessToken = token;

		/**
		 * Notify
		 */
		this.#emitter.emit("access_tokens_auth:authentication_succeeded", {
			ctx: this.#ctx,
			token,
			guardName: this.#name,
			user: this.user,
		});

		return this.user;
	}

	/**
	 * Create a token for a user (sign in)
	 */
	async createToken(
		user: UserProvider[typeof symbols.PROVIDER_REAL_USER],
		abilities?: string[],
		options?: {
			expiresIn?: string | number;
			name?: string;
		},
	) {
		return await this.userProvider.createToken(user, abilities, options);
	}

	/**
	 * Invalidates the currently authenticated token (sign out)
	 */
	async invalidateToken(includeRefresh = false) {
		const bearerToken = new Secret(this.#getBearerToken());

		let refreshToken: Secret<string> | null = includeRefresh
			? new Secret(this.#getRefreshToken())
			: null;

		return {
			access: await this.userProvider.invalidateToken(bearerToken),
			refresh:
				refreshToken !== null
					? await this.refreshProvider.invalidateToken(refreshToken)
					: null,
		};
	}

	/**
	 * Returns the Authorization header clients can use to authenticate
	 * the request.
	 */
	async authenticateAsClient(
		user: UserProvider[typeof symbols.PROVIDER_REAL_USER],
		abilities?: string[],
		options?: {
			expiresIn?: string | number;
			name?: string;
		},
	): Promise<AuthClientResponse> {
		const token = await this.userProvider.createToken(user, abilities, options);
		return {
			headers: {
				authorization: `Bearer ${token.value!.release()}`,
			},
		};
	}

	/**
	 * Silently check if the user is authenticated or not. The
	 * method is same the "authenticate" method but does not
	 * throw any exceptions.
	 */
	async check(): Promise<boolean> {
		try {
			await this.authenticate();
			return true;
		} catch (error) {
			if (error instanceof E_UNAUTHORIZED_ACCESS) {
				return false;
			}

			throw error;
		}
	}
}

export function customTokensGuard<
	UserProvider extends AccessTokensUserProviderContract<unknown>,
	RefreshProvider extends AccessTokensUserProviderContract<unknown>,
>(config: {
	provider: UserProvider | ConfigProvider<UserProvider>;
	refreshProvider: RefreshProvider | ConfigProvider<RefreshProvider>;
}): GuardConfigProvider<
	(ctx: HttpContext) => AccessTokensGuardCustom<UserProvider, RefreshProvider>
> {
	return {
		async resolver(name, app) {
			const emitter = await app.container.make("emitter");
			const provider =
				"resolver" in config.provider
					? await config.provider.resolver(app)
					: config.provider;
			const refreshProvider =
				"resolver" in config.refreshProvider
					? await config.refreshProvider.resolver(app)
					: config.refreshProvider;
			return (ctx) =>
				new AccessTokensGuardCustom(
					name,
					ctx,
					emitter,
					provider,
					refreshProvider,
				);
		},
	};
}
