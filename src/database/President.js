import mongoose from "mongoose";
import { emailRegex } from "../controllers/helpers/president.js"

const PresidentSchema = mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   country: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      maxLength: [255, 'email needs to be shorter than 255 characters'],
      match: emailRegex
   },
   hasButton: {
      type: Boolean,
      default: false
   },
   createdAt: {
      type: Date,
      default: Date.now()
   }
})

const PresidentModel = mongoose.model("President", PresidentSchema)

export default PresidentModel
