import { validationResult } from "express-validator";
import SatelliteModel from "../database/Satellite.js";
import { createSatellitePatchObject, transformValidatorErrors } from "./helpers.js";

const getSatellites = async (_req, res) => {
   res.json(await SatelliteModel.find().select({ __v: 0 }))
}

const createSatellite = async (req, res) => {
   const validationResults = validationResult(req)
   if(!validationResults.isEmpty()){
      const transformedErrorsObject = transformValidatorErrors(validationResults)
      return res.status(400).json(transformedErrorsObject)
   }

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

   await SatelliteModel.findByIdAndDelete(uid)

   res.sendStatus(204)
}

const updateSatellite = async (req, res) => {
   const uid = req.params.uid

   const isExist = await SatelliteModel.exists({ _id: uid })
   if(!isExist){
      return res.sendStatus(404)
   }

   const validationResults = validationResult(req)
   if(!validationResults.isEmpty()){
      const transformedErrorsObject = transformValidatorErrors(validationResults)
      return res.status(400).json(transformedErrorsObject)
   }

   const updateObject = createSatellitePatchObject(req.body)

   const updateResults = await SatelliteModel.findOneAndUpdate({ _id: uid }, updateObject, { new: true })

   res.json(updateResults)
}

export { getSatellites, createSatellite, deleteSatellite, updateSatellite }
