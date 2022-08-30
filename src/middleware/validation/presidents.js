import { body } from "express-validator"
import PresidentModel, { emailRegex, passwordRegex } from "../../database/President.js"

const isEmailTaken = async (value) => {
   const isTaken = await PresidentModel.exists({ email: value })
   if(isTaken){ throw new Error() }
}

const validateNonEmptyString = (field) => body(field)
   .exists()
   .withMessage("cannot be undefined")
   .notEmpty()
   .withMessage("cannot be empty")
   .isString()
   .withMessage("must be a string")

const validateEmail = validateNonEmptyString('email')
   .isLength({ max: 255 })
   .withMessage("cannot be longer than 255 characters")
   .matches(emailRegex)
   .withMessage("must be a valid email")
   .custom(isEmailTaken).bail()
   .withMessage("email is already taken")

const validatePassword = validateNonEmptyString('password')
   .isLength({ min: 6 })
   .withMessage("must be at least 6 characters long")
   .matches(passwordRegex)
   .withMessage("must contain at least 1 number and 1 special character")

const validateButton = body('hasButton')
   .optional()
   .isBoolean()
   .withMessage("must be a boolean")

export const validatePresidentRegister = [
   validateEmail,
   validateNonEmptyString('name'),
   validateNonEmptyString('country'),
   validatePassword,
   validateButton
]

export const validatePresidentLogin = [
   validateNonEmptyString('email'),
   validateNonEmptyString('password')
]
