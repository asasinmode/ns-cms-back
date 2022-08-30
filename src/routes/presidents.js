import express from "express"
const presidentRouter = express.Router()

import { registerPresident, loginPresident, deletePresident } from "../controllers/presidents.js"
import protect from "../middleware/auth.js"

presidentRouter.post("/", registerPresident)
presidentRouter.post("/login", loginPresident)
presidentRouter.delete("/:uid", protect, deletePresident)   // for dev only

export default presidentRouter
