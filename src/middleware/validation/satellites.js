import { body } from "express-validator";
import { softwareVersionRegex, launchDateMin } from "../../database/Satellite.js";

const validateString = (field) => body(field)
   .isString()
   .withMessage("must be a string")
   .notEmpty()
   .withMessage("cannot be empty")

const validatePositiveInt = (field) => body(field)
   .isInt({ min: 0 })
   .withMessage("must be a positive integer")

const isLaunchDateValid = (value) => {
   const parsedDate = new Date(parseInt(value))
   if(parsedDate < launchDateMin || parsedDate > new Date()){ return false }
   return true
}
const currentYear = new Date().getFullYear()

// required
// must be functions because later they are exported and mapped over
// which changes the underlying validator method if it's a const
const validateSideNumber = () => validateString('sideNumber')
const validateManufacturer = () => validateString('manufacturer')
const validateAmmunitionLeft = () => validatePositiveInt('ammunitionLeft')
const validateAltitude = () => validatePositiveInt('altitude')

// optional
const validateModel = validateString('model')

const validateSoftwareVersion = validateString('softwareVersion')
   .matches(softwareVersionRegex)
   .withMessage("must be a valid semantic version (example: 1.0.0)")

const validateVintage = body('vintage')
   .isInt({ min: 1900, max: currentYear })
   .withMessage(`must be an integer between 1900 and ${ currentYear }`)

const validateHasAI = body('hasAI')
   .isBoolean()
   .withMessage("must be a boolean")

const validateLaunchDate = body('launchDate')
   .isInt()
   .withMessage("must be an integer")
   .custom(isLaunchDateValid).bail()
   .withMessage("must be after 01.01.1970 and cannot be in the future")

// combined into middleware
const requiredFields = () => [
   validateSideNumber(),
   validateManufacturer(),
   validateAmmunitionLeft(),
   validateAltitude()
]
const optionalFields = [
   validateModel,
   validateSoftwareVersion,
   validateVintage,
   validateLaunchDate,
   validateHasAI
].map(validation => validation.optional())

export const validateSatellitePost = [
   ...requiredFields().map(validation => validation.exists().withMessage("cannot be undefined")),
   ...optionalFields
]

export const validateSatellitePatch = [
   ...requiredFields().map(validation => validation.optional()),
   ...optionalFields
]
