export const transformValidatorErrors = (validationResults) => {
   const rv = validationResults.array().reduce((previous, current) => {
      const field = current.param
      if(previous[field] === undefined){
         return {
            ...previous,
            [field]: [current.msg]
         }
      }

      previous[field].push(current.msg)
      return previous
   }, {})
   return {
      errors: rv
   }
}

export const createSatellitePatchObject = (requestBody) => {
   const validSatelliteKeys = ["sideNumber", "manufacturer", "model", "softwareVersion", "vintage", "launchDate", "ammunitionLeft", "altitude", "hasAI"]

   // go through all valid satellite keys and, if specified in req.body add them to return object
   const rv = validSatelliteKeys.reduce((previous, current) => {
      if(requestBody[current] !== undefined){
         return {
            ...previous,
            [current]: requestBody[current]
         }
      }
      return previous
   }, {})

   // transform date from timestamp to date object
   if(rv.launchDate !== undefined){
      rv.launchDate = new Date(parseInt(rv.launchDate))
   }

   return rv
}
