import mongoose from "mongoose";

// https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^+_=])[A-Za-z\d@$!%*#?&^+_=]{6,}$/
// https://emailregex.com/
export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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
