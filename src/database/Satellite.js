import mongoose from "mongoose";
import { launchDateMin, softwareVersionRegex } from "../controllers/helpers/satellites.js";

const SatelliteSchema = mongoose.Schema({
   sideNumber: {
      type: String,
      required: true
   },
   manufacturer: {
      type: String,
      required: true
   },
   model: {
      type: String,
      default: "unknown"
   },
   softwareVersion: {
      type: String,
      default: "1.0.0",
      match: softwareVersionRegex
   },
   vintage: {
      type: Number,
      min: [1900, 'vintage cannot be lesser than 1900'],
      max: [new Date().getFullYear(), 'vintage cannot be greater than than current year'],
      default: new Date().getFullYear()
   },
   launchDate: {
      type: Date,
      default: Date.now(),
      min: [launchDateMin, 'launch date cannot be earlier than 01.01.1970']
   },
   ammunitionLeft: {
      type: Number,
      required: true,
      min: [0, 'ammunitionLeft cannot be lesser than 0']
   },
   altitude: {
      type: Number,
      required: true
   },
   hasAI: {
      type: Boolean,
      default: false
   }
}, { timestamps: true })

const SatelliteModel = mongoose.model("Satellite", SatelliteSchema)

export default SatelliteModel
