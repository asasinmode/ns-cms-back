import { isANonEmptyString } from "./president.js"

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
// modified to only accept major, minor and patch numeric identifiers
// so 1.0.0, 0.0.0, 1.2.3 and so on without letters at the end
export const softwareVersionRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

export const launchDateMin = new Date('01 Jan 1970 00:00:00 GMT')

export const validateSatelliteData = ({ sideNumber, manufacturer, model, softwareVersion, vintage, launchDate, ammunitionLeft, altitude, hasAI }, ignoreRequiredness = false) => {
   const currentYear = new Date().getFullYear()
   const rv = {
      general: undefined,
      fields: {}
   }

   const areRequiredFieldsFilled = ignoreRequiredness || (sideNumber && manufacturer && ammunitionLeft && altitude)
   if(!areRequiredFieldsFilled){
      rv.general = `fields "sideNumber", "manufacturer", "ammunitionLeft" and "altitude" are required`
   }

   let isAltitudeValid = typeof altitude === "number" && altitude > 0
   let isAmmunitionLeftValid = typeof ammunitionLeft === "number" && Number.isInteger(ammunitionLeft) && ammunitionLeft >= 0
   let isManufacturerValid = isANonEmptyString(manufacturer)
   let isSideNumberValid = typeof sideNumber === "number" || (typeof sideNumber === "string" && sideNumber.length > 0)
   const isHasAIValid = hasAI === undefined || typeof hasAI === "boolean"
   const isModelValid = model === undefined || isANonEmptyString(model)
   const isSoftwareVersionValid = softwareVersion === undefined || (typeof softwareVersion === "string" && softwareVersion.match(softwareVersionRegex) !== null)
   const isVintageValid = vintage === undefined || (typeof vintage === "number" && (vintage >= 1900 && vintage <= currentYear))

   // for patching satellites all fields are optional
   // so if it's undefined it's okay and if it's not
   // then it needs to be in a valid format
   if(ignoreRequiredness){
      isAltitudeValid = altitude === undefined || isAltitudeValid
      isAmmunitionLeftValid = ammunitionLeft === undefined || isAmmunitionLeftValid
      isManufacturerValid = manufacturer === undefined || isManufacturerValid
      isSideNumberValid = sideNumber === undefined || isSideNumberValid
   }

   if(!isAltitudeValid){
      rv.fields.altitude = "altitude has to be a positive number"
   }
   if(!isAmmunitionLeftValid){
      rv.fields.ammunitionLeft = "ammunitionLeft has to be a positive integer"
   }
   if(!isManufacturerValid){
      rv.fields.manufacturer = "manufacturer has to be a non-empty string"
   }
   if(!isSideNumberValid){
      rv.fields.sideNumber = "sideNumber has to be a non-empty string or a number"
   }

   if(!isHasAIValid){
      rv.fields.hasAI = "hasAI, if specified, has to be a boolean"
   }
   if(!isModelValid){
      rv.fields.model = "model, if specified, has to be a non-empty string"
   }
   if(!isSoftwareVersionValid){
      rv.fields.softwareVersion = `softwareVersion, if specified, has to be in "1.0.0" format`
   }
   if(!isVintageValid){
      rv.fields.vintage = `vintage, if specified, has to be a number in range <1900, ${ currentYear }>`
   }

   if(launchDate !== undefined){
      const isLaunchDateANumber = typeof launchDate === "number"
      if(!isLaunchDateANumber){
         rv.fields.launchDate = "launchDate, if specified, has to be a Unix Time Stamp number"
      } else {
         const parsedLaunchDate = new Date(launchDate)
         if(parsedLaunchDate < launchDateMin){
            rv.fields.launchDate = "launchDate, if specified, has to be after 01.01.1970"
         } else if(parsedLaunchDate > Date.now()){
            rv.fields.launchDate = "launchDate, if specified, cannot be in the future"
         }
      }
   }

   if(rv.general === undefined && Object.keys(rv.fields).length === 0){
      return undefined
   }
   return rv
}
