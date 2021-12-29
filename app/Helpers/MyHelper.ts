import { types } from "@ioc:Adonis/Core/Helpers"

export default class MyHelper {
	public static isEmptyOrNull(...fields: any[]): boolean {
		for (let i = 0; i < fields.length; i++) {
			if (
				fields[i] == null ||
				fields[i] == undefined ||
				(types.isString(fields[i]) && fields[i] === "")
			) {
				return true
			}
		}
		return false
	}
}
