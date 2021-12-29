import BaseSchema from "@ioc:Adonis/Lucid/Schema"
import { CamelCaseNamingStrategy } from "Database/strategies/CamelCaseNamingStrategy"

/**
 * TO RUN : node ace migration:run
 * TO ROLBACK : node ace migration:rollback
 */
export default class UserSchema extends BaseSchema {
	protected tableName = "users"
	public static namingStrategy = new CamelCaseNamingStrategy()

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id")
			table.string("username")
			table.string("userId")
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
