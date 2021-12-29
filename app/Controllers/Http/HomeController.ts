import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Env from "@ioc:Adonis/Core/Env"
export default class HomeController {
	public async index(ctx: HttpContextContract) {
		return {
			hello: "RP BACKEND CONFIG",
			RP_ORIGIN: Env.get("RP_ORIGIN"),
			FIDO2_SERVER_URL: Env.get("FIDO2_SERVER_URL"),
			url: ctx.request.url(),
			completeUrl: ctx.request.completeUrl(),
		}
	}
}
