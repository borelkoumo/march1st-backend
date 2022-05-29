import User from "App/Models/User"
import Logger from "@ioc:Adonis/Core/Logger"
import Database from "@ioc:Adonis/Lucid/Database"

export default class DatabaseHelper {
	public async saveUserId(username: string, userId: string, typeUser: string): Promise<User> {
		// Assign username and email
		try {
			const user = await User.create({
				username: username,
				userId: userId,
				typeUser: typeUser,
			})
			Logger.info(`user.$isPersisted = ${user.$isPersisted}`) // true
			Logger.info(`username='${user.username}' userId='${user.userId}' inserted !. #ID=${user.id}`)
			return user
		} catch (error) {
			Logger.error(`Error in saveUserId : ${error.message}`)
			throw new Error(error.message)
		}
	}

	public async getUserId(username: string): Promise<string> {
		try {
			const user = await User.findByOrFail("username", username)
			Logger.info(`User with username '${username}' = ${user.userId}`)
			return user.userId
		} catch (error) {
			Logger.error(`Error in getUserId : ${error.message}`)
			throw new Error(error.message)
		}
	}

	public async userExists(username: string, typeUser: string) {
		try {
			const user = await Database.from(User.table) // 👈 gives an instance of select query builder
				.select("*")
				.where("username", "=", username)
				.andWhere("typeUser", "=", typeUser)
				.first()
			if (user) {
				Logger.info(`User already exists. username='${user.username}'; userId='${user.userId}'`)
				return true
			} else {
				return false
			}
		} catch (error) {
			Logger.error(`Error in userExists`, error)
			Logger.error(`User.table = ${User.table}`)
		}
	}
}
