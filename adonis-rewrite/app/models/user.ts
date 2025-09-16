import { DateTime } from "luxon";
import hash from "@adonisjs/core/services/hash";
import { compose } from "@adonisjs/core/helpers";
import { BaseModel, column } from "@adonisjs/lucid/orm";
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { DbAccessTokensProvider } from "@adonisjs/auth/access_tokens";

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
	uids: ["username"],
	passwordColumnName: "password",
});

export default class User extends compose(BaseModel, AuthFinder) {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare username: string;

	@column()
	declare firstName: string;

	@column()
	declare lastName: string;

	@column()
	declare email: string | null;

	@column()
	public role: "user" | "officer" | "admin" = "user";

	@column({ serializeAs: null })
	declare password: string;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime | null;

	static accessToken = DbAccessTokensProvider.forModel(User, {
		expiresIn: "30 days",
		prefix: "oat_",
		table: "auth_access_tokens",
		type: "auth_token",
		tokenSecretLength: 40,
	});
}
