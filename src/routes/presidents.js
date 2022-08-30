import express from "express"
const presidentRouter = express.Router()

import { registerPresident, loginPresident, deletePresident } from "../controllers/presidents.js"
import { validatePresidentLogin, validatePresidentRegister } from "../middleware/validation/presidents.js"
import protect from "../middleware/auth.js"

presidentRouter.post("/", validatePresidentRegister, registerPresident)
presidentRouter.post("/login", validatePresidentLogin, loginPresident)
presidentRouter.delete("/:uid", protect, deletePresident)   // for dev only

export default presidentRouter
