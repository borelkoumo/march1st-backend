import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Logger from "@ioc:Adonis/Core/Logger"
import Env from "@ioc:Adonis/Core/Env"

import MyHelper from "App/Helpers/MyHelper"
import Fido2Server from "App/Helpers/Fido2Helper"
import DatabaseHelper from "App/Helpers/DatabaseHelper"

export default class AssertionsController {
	private fido2Server = new Fido2Server()
	private databaseHelper = new DatabaseHelper()

	public async options(ctx: HttpContextContract) {
		// Get params
		const { username } = ctx.request.body()

		// Verify params
		ctx.response.status(400)
		if (MyHelper.isEmptyOrNull(username)) {
			return ctx.response.send({
				status: "KO",
				code: 400,
				message: "Required field 'username' is missing",
			})
		}

		try {
			// Retrive userId corresonding to ths username
			const userId = await this.databaseHelper.getUserId(username)

			// Perform request
			const result = await this.fido2Server.getAuthenticationChallenge(userId)
			ctx.response.status(200)
			return ctx.response.send({
				status: "OK",
				code: 200,
				data: result,
			})
		} catch (error) {
			Logger.error("Error", error)
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

		// Get required attestation params
		const { id, type, clientDataJSON, authenticatorData, signature } = ctx.request.body()

		// Get optional attestation params
		const { userHandle, extensions } = ctx.request.body()

		// Get Orign param
		// requestOrigin=front if request is comming from frontend,
		// and requestOrigin = mobile if comming from mobile
		const { requestOrigin } = ctx.request.body()

		// Perform tests
		ctx.response.status(400)
		if (MyHelper.isEmptyOrNull(sessionId)) {
			return ctx.response.send({
				status: "KO",
				code: 400,
				message: "sessionId is missing",
			})
		}
		if (MyHelper.isEmptyOrNull(id, type, clientDataJSON, authenticatorData, signature)) {
			return ctx.response.send({
				status: "KO",
				code: 400,
				message: "A required field in assertion is missing",
			})
		}

		// Check request origin filed
		if (
			MyHelper.isEmptyOrNull(requestOrigin) ||
			(requestOrigin !== "front" && requestOrigin !== "mobile")
		) {
			return ctx.response.send({
				status: "KO",
				code: 400,
				message: "Request origin must be equal to 'front' or 'mobile'",
			})
		}

		// Perform request
		try {
			// Send request to authentication server
			const result = await this.fido2Server.sendAuthenticationResponse(
				requestOrigin,
				id,
				type,
				sessionId,
				clientDataJSON,
				authenticatorData,
				signature,
				userHandle,
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
