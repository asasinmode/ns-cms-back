import mongoose from "mongoose";

// https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^+_=])[A-Za-z\d@$!%*#?&^+_=]{6,}$/
// https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
export const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

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
