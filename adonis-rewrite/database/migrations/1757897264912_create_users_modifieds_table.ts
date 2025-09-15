import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("full_name");

			table.string("username").notNullable().unique();
			table.string("email").nullable().alter();

			table.string("first_name").notNullable();
			table.string("last_name").notNullable();
			table.enum("role", ["user", "officer", "admin"]).defaultTo("user");
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("username");
			table.dropColumn("first_name");
			table.dropColumn("last_name");
			table.dropColumn("role");

			table.string("full_name").nullable();
		});
	}
}
