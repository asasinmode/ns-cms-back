import express from "express"
import protect from "../middleware/auth.js"
import { createSatellite, deleteSatellite, getSatellites, updateSatellite } from "../controllers/satellites.js"
import { validateSatellitePost, validateSatellitePatch } from "../middleware/validation/satellites.js"
const satellitesRouter = express.Router()

satellitesRouter.get("/", protect, getSatellites)
satellitesRouter.post("/", protect, validateSatellitePost, createSatellite)
satellitesRouter.delete("/:uid", protect, deleteSatellite)
satellitesRouter.patch("/:uid", protect, validateSatellitePatch, updateSatellite)

export default satellitesRouter
