import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Logger from "@ioc:Adonis/Core/Logger"
import Env from "@ioc:Adonis/Core/Env"

import MyHelper from "App/Helpers/MyHelper"
import Fido2Server from "App/Helpers/Fido2Helper"
import DatabaseHelper from "App/Helpers/DatabaseHelper"

export default class AttestationsController {
	private fido2Server = new Fido2Server()
	private databaseHelper = new DatabaseHelper()

	public async options(ctx: HttpContextContract) {
		// Get params
		const { username, displayName } = ctx.request.body()
		let { typeUser } = ctx.request.body()

		// Verify params
		ctx.response.status(400)
		if (MyHelper.isEmptyOrNull(username)) {
			return ctx.response.send({
				status: "KO",
				code:400,
				message: "Username is missing",
			})
		}
		if (MyHelper.isEmptyOrNull(displayName)) {
			return ctx.response.send({
				status: "KO",
				code:400,
				message: "Display Name is missing",
			})
		}
		if (MyHelper.isEmptyOrNull(typeUser) || !["client", "hacker"].includes(typeUser)) {
			typeUser = "client"
		}

		try {
			// Does his username already exist in our local database?
			const userExists = await this.databaseHelper.userExists(username, typeUser)
			if (userExists) {
				return ctx.response.send({
					status: "KO",
					code:400,
					message: "Username already exists in RP backend database",
				})
			}

			// Perform request
			const result: any = await this.fido2Server.getRegistrationChallenge(username, displayName)

			// Retreive session as cookie and send it to response
			Logger.info("Session ID : %s", result.sessionId)
			ctx.response.cookie(Env.get("FIDO2_COOKIE_NAME"), result.sessionId)

			// Save username and userId in local database
			const user = await this.databaseHelper.saveUserId(username, result.user.id, typeUser)
			Logger.info(`Saved #id = ${user.id}`)

			// Send response
			ctx.response.status(200)
			return ctx.response.send({
				status: "OK",
				code: 200,
				data: result,
			})
		} catch (error) {
			ctx.response.status(error.code)
			return ctx.response.send({
				status: "KO",
				code: error.code,
				message: error.message,
			})
		}
	}

	public async result(ctx: HttpContextContract) {
		// Get session params
		const { sessionId } = ctx.request.body()

		// Get cookie
		const fido2Cookie = ctx.request.cookie(Env.get("FIDO2_COOKIE_NAME"), null)
		Logger.info("fido2Cookie : %s", fido2Cookie)

		// Get attestation params
		const { rawId, id, response, type, extensions } = ctx.request.body()

		// Get Orign param
		// requestOrigin=front if request is comming from frontend,
		// and requestOrigin = mobile if comming from mobile
		const { requestOrigin } = ctx.request.body()

		ctx.response.status(400)
		if (MyHelper.isEmptyOrNull(sessionId)) {
			return ctx.response.send({
				status: "KO",
				code:400,
				message: "sessionId is missing",
			})
		}
		if (MyHelper.isEmptyOrNull(rawId, id, response, type)) {
			return ctx.response.send({
				status: "KO",
				code:400,
				message: "Client attestation data are missing",
			})
		}
		if (
			MyHelper.isEmptyOrNull(requestOrigin) ||
			(requestOrigin !== "front" && requestOrigin !== "mobile")
		) {
			return ctx.response.send({
				status: "KO",
				code:400,
				message: "Request origin must be equal to 'front' or 'mobile'",
			})
		}

		// Perform request
		try {
			// Send request to authentication server
			const result = await this.fido2Server.sendRegistrationResponse(
				requestOrigin,
				sessionId,
				id,
				response,
				type,
				extensions
			)

			ctx.response.status(200)
			return ctx.response.send({
				status: "OK",
				code: 200,
				data: result,
			})
		} catch (error) {
			ctx.response.status(error.code)
			return ctx.response.send({
				status: "KO",
				code: error.code,
				message: error.message,
			})
		}
	}
}
