import { symbols, errors } from "@adonisjs/auth";
import { AccessToken } from "@adonisjs/auth/access_tokens";
import {
	AuthClientResponse,
	GuardConfigProvider,
	GuardContract,
} from "@adonisjs/auth/types";
import { AccessTokensUserProviderContract } from "@adonisjs/auth/types/access_tokens";
import { Secret } from "@adonisjs/core/helpers";
import { HttpContext } from "@adonisjs/core/http";
import { ConfigProvider } from "@adonisjs/core/types";

type GuardedUser<U extends AccessTokensUserProviderContract<unknown>> =
	U[typeof symbols.PROVIDER_REAL_USER] & { currentAccessToken?: AccessToken };

export class AccessTokensCookieGuard<
	UserProvider extends AccessTokensUserProviderContract<unknown>,
	RefreshProvider extends AccessTokensUserProviderContract<unknown>,
> implements GuardContract<GuardedUser<UserProvider>>
{
	#ctx: HttpContext;
	userProvider: UserProvider;
	refreshProvider: RefreshProvider;

	constructor(
		ctx: HttpContext,
		userProvider: UserProvider,
		refreshProvider: RefreshProvider,
	) {
		this.#ctx = ctx;
		this.userProvider = userProvider;
		this.refreshProvider = refreshProvider;
	}

	declare [symbols.GUARD_KNOWN_EVENTS]: {};

	driverName: "tokenCookie" = "tokenCookie";
	authenticationAttempted: boolean = false;
	isAuthenticated: boolean = false;
	user?: GuardedUser<UserProvider>;

	#authenticationFailed() {
		const error = new errors.E_UNAUTHORIZED_ACCESS("Unauthorized access", {
			guardDriverName: this.driverName,
		});

		return error;
	}

	#getCookieToken() {
		const accessTokenCookie = this.#ctx.request.cookie("access_token");
		if (!accessTokenCookie) {
			throw this.#authenticationFailed();
		}
		return accessTokenCookie;
	}

	#getRefreshCookieToken() {
		const refreshTokenCookie = this.#ctx.request.cookie("refresh_token");
		if (!refreshTokenCookie) {
			throw this.#authenticationFailed();
		}
		return refreshTokenCookie;
	}

	async authenticate(): Promise<GuardedUser<UserProvider>> {
		if (this.authenticationAttempted) {
			return this.getUserOrFail();
		}
		this.authenticationAttempted = true;

		const cookieToken = new Secret(this.#getCookieToken());

		const token = await this.userProvider.verifyToken(cookieToken);
		if (!token) {
			throw this.#authenticationFailed();
		}

		const providerUser = await this.userProvider.findById(token.tokenableId);
		if (!providerUser) {
			throw this.#authenticationFailed();
		}

		this.isAuthenticated = true;
		this.user =
			providerUser.getOriginal() as UserProvider[typeof symbols.PROVIDER_REAL_USER] & {
				currentAccessToken: AccessToken;
			};
		this.user.currentAccessToken = token!;

		return this.user;
	}

	async check(): Promise<boolean> {
		try {
			await this.authenticate();
			return true;
		} catch (error) {
			if (error instanceof errors.E_UNAUTHORIZED_ACCESS) {
				return false;
			}

			throw error;
		}
	}

	getUserOrFail(): GuardedUser<UserProvider> {
		if (!this.user) {
			throw new errors.E_UNAUTHORIZED_ACCESS("Unauthorized access", {
				guardDriverName: this.driverName,
			});
		}

		return this.user;
	}

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
			cookies: {
				access_token: token,
			},
		};
	}

	async invalidateToken(includeRefresh = false) {
		const cookieToken = new Secret(this.#getCookieToken());

		let refreshToken: Secret<string> | null = includeRefresh
			? new Secret(this.#getRefreshCookieToken())
			: null;

		return {
			access: await this.userProvider.invalidateToken(cookieToken),
			refresh:
				refreshToken !== null
					? await this.refreshProvider.invalidateToken(refreshToken)
					: null,
		};
	}
}

export function cookieTokensGuard<
	UserProvider extends AccessTokensUserProviderContract<unknown>,
	RefreshProvider extends AccessTokensUserProviderContract<unknown>,
>(config: {
	provider: UserProvider | ConfigProvider<UserProvider>;
	refreshProvider: RefreshProvider | ConfigProvider<RefreshProvider>;
}): GuardConfigProvider<
	(ctx: HttpContext) => AccessTokensCookieGuard<UserProvider, RefreshProvider>
> {
	return {
		async resolver(_, app) {
			const provider =
				"resolver" in config.provider
					? await config.provider.resolver(app)
					: config.provider;
			const refreshProvider =
				"resolver" in config.refreshProvider
					? await config.refreshProvider.resolver(app)
					: config.refreshProvider;
			return (ctx) =>
				new AccessTokensCookieGuard(ctx, provider, refreshProvider);
		},
	};
}
