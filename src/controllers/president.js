import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import PresidentModel from "../database/President.js"
import { validatePresidentData } from "./helpers/president.js"

const registerPresident = async (req, res) => {
   const validationErrors = validatePresidentData(req.body)
   if(validationErrors){
      return res.status(400).json(validationErrors)
   }
   const { name, password, email, country, hasButton } = req.body

   const isEmailTaken = await PresidentModel.exists({ email: email })
   if(isEmailTaken){
      return res.status(400).json({
         general: `email is already taken`
      })
   }

   console.log("registering president")

   const salt = await bcryptjs.genSalt(10)
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
      token: generateJWT(newPresident._id)
   })
}

const loginPresident = async (req, res) => {
   const { email, password } = req.body

   const president = await PresidentModel.findOne({ email })

   if(!president || !bcryptjs.compareSync(password, president.password)){
      return res.status(400).json({ message: "invalid credentials" })
   }

   res.json({
      _id: president._id,
      name: president.name,
      token: generateJWT(president._id)
   })
}

// deletable
const deletePresident = async (req, res) => {
   const uid = req.params.uid

   const deletionResults = await PresidentModel.findByIdAndDelete(uid)
   if(!deletionResults){
      return res.status(404).json({ message: "not found" })
   }

   res.status(204).end()
}

const generateJWT = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
   })
}

export { registerPresident, loginPresident, deletePresident }
