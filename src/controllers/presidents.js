import bcryptjs from "bcryptjs"
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import PresidentModel from "../database/President.js"
import { transformValidatorErrors } from "./helpers.js"

const registerPresident = async (req, res) => {
   const validationResults = validationResult(req)
   if(!validationResults.isEmpty()){
      const transformedErrorsObject = transformValidatorErrors(validationResults)
      return res.status(400).json(transformedErrorsObject)
   }

   const { name, password, email, country, hasButton } = req.body

   const salt = await bcryptjs.genSalt(12)
   const hashedPassword = await bcryptjs.hash(password, salt)

   const newPresident = await PresidentModel.create({
      name,
      password: hashedPassword,
      email,
      country,
      hasButton: hasButton || false
   })

   res.status(201).json({
      _id: newPresident._id,
      name: newPresident.name,
      token: generateJWT(newPresident._id),
      country: newPresident.country,
      hasButton: newPresident.hasButton
   })
}

const loginPresident = async (req, res) => {
   const validationResults = validationResult(req)
   if(!validationResults.isEmpty()){
      const transformedErrorsObject = transformValidatorErrors(validationResults)
      return res.status(400).json(transformedErrorsObject)
   }

   const { email, password } = req.body

   const president = await PresidentModel.findOne({ email })

   if(!president || !bcryptjs.compareSync(password, president.password)){
      return res.status(400).json({ message: "invalid credentials" })
   }

   res.json({
      _id: president._id,
      name: president.name,
      token: generateJWT(president._id),
      country: president.country,
      hasButton: president.hasButton
   })
}

// for tests and dev
const deletePresident = async (req, res) => {
   const uid = req.params.uid

   await PresidentModel.findByIdAndDelete(uid)

   res.sendStatus(204)
}

const generateJWT = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
   })
}

export { registerPresident, loginPresident, deletePresident }
