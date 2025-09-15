/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router";
import { middleware } from "./kernel.js";

router.get("up", () => {
	return "OK";
});

router
	.group(() => {
		router
			.group(() => {
				router
					.group(() => {
						router.post("login", () => {});
						router.post("register", () => {});
						router
							.group(() => {
								router.post("logout", () => {
									return "no";
								});
								router.post("logout-all", () => {});
								router.post("refresh", () => {});
							})
							.use(middleware.auth());
					})
					.prefix("authentication");

				router
					.group(() => {
						router.get("", () => {});
					})
					.prefix("files");

				router
					.group(() => {
						router
							.group(() => {
								router.get("profile", () => {});
							})
							.prefix("users");

						router
							.group(() => {
								router.get("", () => {});
								router.post("", () => {});
								router.get(":reportId", () => {});
								router.patch("update-status/:reportId", () => {});
								router.delete(":reportId", () => {});

								router
									.group(() => {
										router.post(":reportId", () => {});
										router.delete(":reportId/:witnessId", () => {});
									})
									.prefix("witness");
							})
							.prefix("reports");

						router
							.group(() => {
								router.get("token", () => {});
							})
							.prefix("mapbox");

						router
							.group(() => {
								router.get("", () => {});
								router.post("", () => {});
								router.get(":lostItemId", () => {});
								router.delete(":lostItemId", () => {});

								router
									.group(() => {
										router.post(":lostArticleId", () => {});
										router.get(":lostArticleId", () => {});
										router.get(":personalDetailsId", () => {});
										router.delete(":personalDetailsId", () => {});
									})
									.prefix("personal-details");
							})
							.prefix("lost-items");

						router
							.group(() => {
								router.get("", () => {});
								router.post("", () => {});
								router.get(":alertId", () => {});
								router.delete(":alertId", () => {});
								router.patch(":alertId", () => {});
							})
							.prefix("alerts");

						router
							.group(() => {
								router
									.group(() => {
										router.get(":resourceId", () => {});
										router.post(":resourceId", () => {});
									})
									.prefix("resource");

								router.get(":noteId", () => {});
								router.patch(":noteId", () => {});
								router.delete(":noteId", () => {});
							})
							.prefix("notes");
					})
					.use(middleware.auth());
			})
			.prefix("v1");
	})
	.prefix("api");
