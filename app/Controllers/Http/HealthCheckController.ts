import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
export default class HealthCheckController {
	public async index(ctx: HttpContextContract) {
		ctx.response.status(200)
		return ctx.response.send({
			status: "OK",
		})
	}
}
