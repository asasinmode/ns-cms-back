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
         fields: {
            email: `email is already taken`
         }
      })
   }

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
   const { email, password } = req.body

   if(!email || !password){
      return res.status(400).json({ message: `fields "email" and "password" are required` })
   }
   if(typeof email !== "string" || typeof password !== "string"){
      return res.status(400).json({ message: `fields "email" and "password" need to be strings` })
   }

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
