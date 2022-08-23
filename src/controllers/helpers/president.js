// https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^+_=])[A-Za-z\d@$!%*#?&^+_=]{6,}$/
// https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
export const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export const isANonEmptyString = (value) => {
   return typeof value === "string" && value.length > 0
}

export const validatePresidentData = ({ name, password, country, email, hasButton }) => {
   const rv = {
      general: undefined,
      fields: {}
   }

   const areRequiredFieldsFilled = name && password && country && email
   if(!areRequiredFieldsFilled){
      rv.general = "fields 'name', 'password', 'country' and 'email' are required"
   }

   const isNameValid = isANonEmptyString(name)
   if(!isNameValid){
      rv.fields.name = "name has to be a non-empty string"
   }
   const isPasswordValid = typeof password === "string" && password.match(passwordRegex) !== null
   if(!isPasswordValid){
      rv.fields.password = "password has to be at least 6 characters long and contain at least 1 number and 1 special character"
   }
   const isCountryValid = isANonEmptyString(country)
   if(!isCountryValid){
      rv.fields.country = "country has to be a non-empty string"
   }
   const isEmailValid = typeof email === "string" && email.length <= 255 && email.match(emailRegex) !== null
   if(!isEmailValid){
      rv.fields.email = "email has to be a valid email string"
   }

   if(hasButton !== undefined){
      const isHasButtonValid = typeof hasButton === "boolean"
      if(!isHasButtonValid){
         rv.fields.hasButton = "hasButton has to be a boolean"
      }
   }

   if(rv.general === undefined && Object.keys(rv.fields).length === 0){
      return undefined
   }
   return rv
}