import express from "express"
import protect from "../middleware/auth.js"
import { createSatellite, deleteSatellite, getSatellites, updateSatellite } from "../controllers/satellites.js"
const satellitesRouter = express.Router()

satellitesRouter.get("/", protect, getSatellites)
satellitesRouter.post("/", protect, createSatellite)
satellitesRouter.delete("/:uid", protect, deleteSatellite)
satellitesRouter.patch("/:uid", protect, updateSatellite)

export default satellitesRouter
