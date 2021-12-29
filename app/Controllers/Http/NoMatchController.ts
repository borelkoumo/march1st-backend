import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
export default class NoMatchController {
	public async index(ctx: HttpContextContract) {
		const { request } = ctx
		return {
			"Error": "No route match for this path",
			"request.method": request.method(),
			"request.url": request.url(),
			"request.completeUrl": request.completeUrl(),
		}
	}
}
