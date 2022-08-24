import express from "express"
const presidentRouter = express.Router()

import { registerPresident, loginPresident, deletePresident } from "../controllers/president.js"

presidentRouter.post("/", registerPresident)
presidentRouter.post("/login", loginPresident)
presidentRouter.delete("/:uid", deletePresident)   // for dev only

export default presidentRouter
