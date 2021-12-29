import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Logger from "@ioc:Adonis/Core/Logger"

export default class LogRequest {
	public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
		// Log request params
		Logger.info(`URL ==> %s`, request.url())
		Logger.info(`PARAMS`)
		switch (request.method()) {
			case "GET":
				Logger.info(`\t\t${JSON.stringify(request.params(), null, 2)}`)
				break
			case "POST":
				Logger.info(`\t\t${JSON.stringify(request.body(), null, 2)}`)
				break
			default:
				Logger.warn(`Unknowm request method : ${request.method()}`)
		}

		// ABOVE THE NEXT CALL
		await next()
	}
}
