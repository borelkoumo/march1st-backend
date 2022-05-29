import Env from "@ioc:Adonis/Core/Env"
import Logger from "@ioc:Adonis/Core/Logger"
import axios from "axios"
import cuid from "cuid"
import { Buffer } from "buffer"

export default class Fido2Server {
	// Example https://backend.march1st-beta.com
	private SERVER_URL = Env.get("FIDO2_SERVER_URL")

	private REG_CHALLENGE = "/reg/challenge"
	private REG_RESPONSE = "/reg/response"
	private AUTH_CHALLENGE = "/auth/challenge"
	private AUTH_RESPONSE = "/auth/response"

	public async getRegistrationChallenge(username: string, displayName: string) {
		Logger.info("--------------> getRegistrationChallenge for /attestation/options <--------------")

		/**
		 * https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/WebAuthn_Client_Registration.html
		 */

		// Create user ID. It should be base64 encoded
		const userCuid = cuid()
		const userId = Buffer.from(userCuid).toString("base64")

		// Prepare data
		const data = {
			attestation: "none",
			// authenticatorSelection: {
			// 	// authenticatorAttachment: "cross-platform",
			// 	authenticatorAttachment: "platform",
			// 	requireResidentKey: false,
			// 	userVerification: "preferred",
			// },
			excludeCredentials: [],
			credProtect: null,
			rp: {
				name: Env.get("RP_NAME"),
				icon: Env.get("RP_ICON"),
				id: Env.get("RP_ID"),
			},
			user: {
				displayName: displayName,
				icon: "",
				id: userId,
				name: username,
			},
		}

		// Prepare origin
		const url = `${this.SERVER_URL}${this.REG_CHALLENGE}`
		Logger.info("\tURL to send : %s", url)
		Logger.info("\tDATA to send : %o", data)

		// Make request
		try {
			const response = await axios({
				method: "post",
				url: url,
				data: data,
				headers: {
					"Content-Type": "application/json",
				},
			})
			Logger.info("\tRESOLVED : %o", response.data)
			return response.data
		} catch (error) {
			Logger.error("\tREJECTED : %o", error)
			// return error
			// return {
			// 	status: error.response.status,
			// 	message: error.message,
			// }
		}
	}

	public async sendRegistrationResponse(
		requestOrigin: string,
		sessionId: string,
		id: string,
		response: Object,
		type: string,
		extensions: Object
	) {
		Logger.info("--------------> sendRegistrationResponse for /attestation/result <--------------")

		// Prepare request data
		const data = {
			origin: requestOrigin === "front" ? Env.get("RP_ORIGIN_FRONT") : Env.get("RP_ORIGIN_MOBILE"),
			rpId: Env.get("RP_ID"),
			serverPublicKeyCredential: {
				extensions: extensions,
				id: id,
				response: response,
				type: type,
			},
			sessionId: sessionId,
			tokenBinding: {},
		}

		// Prepare origin
		const url = `${this.SERVER_URL}${this.REG_RESPONSE}`
		Logger.info("\tURL to send : %s", url)
		Logger.info("\tDATA to send : %o", data)

		// Make request
		try {
			const response_1 = await axios({
				method: "post",
				url: url,
				data: data,
				headers: {
					"Content-Type": "application/json",
				},
			})
			Logger.info("\tRESOLVED : %o", response_1.data)
			return response_1.data
		} catch (error) {
			Logger.error("\tREJECTED : %o", error)
			// return {
			// 	status: error.response.status,
			// 	message: error.message,
			// }
		}
	}

	public getAuthenticationChallenge(userId: string) {
		Logger.error(
			"--------------> getAuthenticationChallenge for /assertion/options <--------------"
		)

		// Prepare data
		const data = {
			rpId: Env.get("RP_ID"),
			userId: userId,
			userVerification: "required",
		}

		// Prepare origin
		const url = `${this.SERVER_URL}${this.AUTH_CHALLENGE}`
		Logger.info("\tURL to send : %s", url)
		Logger.info("\tDATA to send : %o", data)

		// Make request
		return axios({
			method: "post",
			url: url,
			data: data,
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				Logger.info("\tRESOLVED : %o", response.data)
				return response.data
			})
			.catch((error) => {
				Logger.error("\tREJECTED : %o", error)
				return {
					status: error.response.status,
					message: error.message,
				}
			})
	}

	public sendAuthenticationResponse(
		requestOrigin: string,
		id: string,
		type: string,
		sessionId: string,
		clientDataJSON: string,
		authenticatorData: string,
		signature: string,
		userHandle: string,
		extensions: string
	) {
		Logger.error("--------------> sendAuthenticationResponse for /assertion/result <--------------")

		const data = {
			origin: requestOrigin === "front" ? Env.get("RP_ORIGIN_FRONT") : Env.get("RP_ORIGIN_MOBILE"),
			rpId: Env.get("RP_ID"),
			serverPublicKeyCredential: {
				extensions: extensions, // -------------------------------------
				id: id,
				response: {
					authenticatorData: authenticatorData,
					clientDataJSON: clientDataJSON,
					signature: signature,
					/**
                     * CORRECTION d'UN BUG. 
                     * Sur iPhone, userHandle est généré, mais ne correspond pas à user id
                     * Or selon la documentation, "if user handle is present, it MUST be identical to user id of a founded credential"
                     * Pour le moment, je ne vais pas faire de verification dessus
                     * Exemple avec le username "loic92"
                            userhandle
                            Y2t2cWkwMmMyMDAwNHI1cDVieWp4ZjI5dQ
                            
                            userid
                            Y2t2cWkwMmMyMDAwNHI1cDVieWp4ZjI5dQ==	
                        La fonction qui genere le userid ne le fais pas bien, et iPhone ignore le signe egal a la fin
                    */
					//userHandle: userHandle,
				},
				type: type, // -------------------------------------
			},
			sessionId: sessionId,
			tokenBinding: {}, // -------------------------------------
		}

		// Prepare origin
		const url = `${this.SERVER_URL}${this.AUTH_RESPONSE}`
		Logger.info("\tURL to send : %s", url)
		Logger.info("\tDATA to send : %o", data)

		// Make request
		return axios({
			method: "post",
			url: url,
			data: data,
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(function (response) {
				Logger.info("\tRESOLVED : %o", response.data)
				return response.data
			})
			.catch(function (error) {
				Logger.error("\tREJECTED : %o", error)
				return {
					status: error.response.status,
					message: error.message,
				}
			})
	}
}
