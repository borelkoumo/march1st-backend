/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from "@ioc:Adonis/Core/Env"

export default Env.rules({
	APP_NAME: Env.schema.string(),
	HOST: Env.schema.string({ format: "host" }),
	PORT: Env.schema.number(),
	NODE_ENV: Env.schema.enum(["development", "production", "testing"] as const),
	DRIVE_DISK: Env.schema.enum(["local"] as const),
	RP_NAME: Env.schema.string(),
	RP_ICON: Env.schema.string(),
	RP_ID: Env.schema.string(),
	RP_ORIGIN_FRONT: Env.schema.string(),
	RP_ORIGIN_MOBILE: Env.schema.string(),
	FIDO2_SERVER_URL: Env.schema.string(),
	FIDO2_COOKIE_NAME: Env.schema.string(),
	DB_CONNECTION: Env.schema.string(),
})
