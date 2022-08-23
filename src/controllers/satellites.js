import SatelliteModel from "../database/Satellite.js";
import { validateSatelliteData } from "./helpers/satellites.js"

const getSatellites = async (_req, res) => {
   res.json(await SatelliteModel.find().select({ __v: 0 }))
}

const createSatellite = async (req, res) => {
   const validationErrors = validateSatelliteData(req.body)
   if(validationErrors){
      return res.status(400).json(validationErrors)
   }
   console.log("creating satellite")

   const { sideNumber, manufacturer, model, softwareVersion, vintage, launchDate, ammunitionLeft, altitude, hasAI  } = req.body

   const newSatellite = await SatelliteModel.create({
      sideNumber: sideNumber,
      manufacturer,
      model,
      softwareVersion,
      vintage,
      launchDate,
      ammunitionLeft,
      altitude,
      hasAI
   })

   res.status(201).json(newSatellite)
}

const deleteSatellite = async (req, res) => {
   const uid = req.params.uid

   const deletionResults = await SatelliteModel.findByIdAndDelete(uid)
   if(!deletionResults){
      return res.status(404).json({ message: "not found" })
   }

   res.status(204).end()
}

const updateSatellite = async (req, res) => {
   const uid = req.params.uid

   const isExist = await SatelliteModel.exists({ _id: uid })
   if(!isExist){
      return res.status(404).json({ message: "not found" })
   }

   const validationErrors = validateSatelliteData(req.body, true)
   if(validationErrors){
      return res.status(400).json(validationErrors)
   }

   // go through all valid satellite keys and, if specified in req.body add them to updateObject
   const validSatelliteKeys = ["sideNumber", "manufacturer", "model", "softwareVersion", "vintage", "launchDate", "ammunitionLeft", "altitude", "hasAI"]
   const updateObject = validSatelliteKeys.reduce((previous, current) => {
      if(req.body[current] !== undefined){
         return {
            ...previous,
            [current]: req.body[current]
         }
      }
      return previous
   }, {})

   if(updateObject.launchDate !== undefined){
      updateObject.launchDate = new Date(updateObject.launchDate)
   }

   const updateResults = await SatelliteModel.findOneAndUpdate({ _id: uid }, updateObject, { new: true })

   res.json(updateResults)
}

export { getSatellites, createSatellite, deleteSatellite, updateSatellite }
