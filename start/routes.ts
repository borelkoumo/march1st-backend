/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route"
import "App/Controllers/Http/HomeController"
import "App/Controllers/Http/AttestationsController"

/**
 * ROUTE for homepage /
 */
Route.any("/", "HomeController.index").middleware(["logRequest"])

/**
 * ROUTE GROUP /rpbackend
 */
Route.group(() => {
	/**
	 * ROUTE for /rpbackend/
	 */
	Route.any("/", "NoMatchController.index").middleware(["logRequest"])
	/**
	 *  ATTESTATION CONTROLLER /rpbackend/attestation
	 *  To create it, use : node ace make:controller Attestation
	 */
	Route.group(() => {
		// 1. /rpbackend/attestation/options used to get registration challenge
		Route.post("options", "AttestationsController.options")
		// 2. /rpbackend/attestation/result used to send registration response
		Route.post("result", "AttestationsController.result")
	}).prefix("/attestation")

	/**
	 * ASSERTION CONTROLLER
	 * To create it, use : node ace make:controller Assertion
	 */
	Route.group(() => {
		// 1. /rpbackend/assertion/options used to get login challenge
		Route.post("options", "AssertionsController.options")
		// 2. /rpbackend/assertion/result used to get authentication response
		Route.post("result", "AssertionsController.result")
	}).prefix("/assertion")

	/**
	 * HEALTH CHECK
	 */
	Route.any("/health", "HealthCheckController.index").middleware(["logRequest"])
})
	.prefix("/rpbackend")
	.middleware(["logRequest"])
