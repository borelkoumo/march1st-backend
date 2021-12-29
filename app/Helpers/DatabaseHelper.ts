import User from "App/Models/User"
import Logger from "@ioc:Adonis/Core/Logger"

export default class DatabaseHelper {
	public async saveUserId(username: string, userId: string): Promise<User> {
		// Assign username and email
		try {
			const user = await User.create({
				username: username,
				userId: userId,
			})
			console.log(user.$isPersisted) // true
			Logger.info(`username='${user.username}' userId='${user.userId}' inserted !. #ID=${user.id}`)
			return Promise.resolve(user)
		} catch (error) {
			Logger.error(`Error in saveUserId`, error)
			return Promise.reject(error)
		}
	}

	public async getUserId(username: string): Promise<string> {
		try {
			const user = await User.findByOrFail("username", username)
			Logger.info(`User with username '${username}' = ${user.userId}`)
			return Promise.resolve(user.userId)
		} catch (error) {
			Logger.error(`Error in getUserId`, error)
			return Promise.reject(error)
		}
	}

	public async userExists(username: string): Promise<boolean> {
		try {
			const user = await User.findByOrFail("username", username)
			// console.log(JSON.stringify(user))
			Logger.info(`userExists. username='${username}'; userId='${user.userId}'`)
			return true
		} catch (error) {
			Logger.error(`Error in userExists`, error)
			return false
		}
	}
}
