import express from "express"
import protect from "../middleware/auth.js"
const presidentRouter = express.Router()

import { registerPresident, loginPresident, deletePresident } from "../controllers/president.js"

presidentRouter.post("/", registerPresident)
presidentRouter.post("/login", loginPresident)
presidentRouter.delete("/:uid", protect, deletePresident)

export default presidentRouter
