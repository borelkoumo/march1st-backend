import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm"
import { CamelCaseNamingStrategy } from "../../database/strategies/CamelCaseNamingStrategy"
/**
 * TO MAKE MODEL :
 *  - node ace make:model User
 *  - node ace make:model User -m (generate the migration alongside the model)
 */
export default class User extends BaseModel {
	public static table = "users"
	public static namingStrategy = new CamelCaseNamingStrategy()

	@column({ isPrimary: true })
	public id: number

	@column()
	public username: string

	@column()
	public userId: string

	@column()
	public typeUser: string
}
