import assert from "assert/strict"
import { validatePresidentData, validateEmail, validatePassword } from "../src/controllers/helpers/president.js"
import { validateSatelliteData } from "../src/controllers/helpers/satellites.js"

export const validPresidentObject = {
   name: "Ronald Reagan",
   country: "USA",
   email: "valid@email.com",
   password: "secure123!"
}
export const validSatelliteDataObject = {
   sideNumber: "USA001",
   manufacturer: "example",
   ammunitionLeft: 5,
   altitude: 100
}

describe("helpers", () => {
   describe("president data validation", () => {
      it("show general error when required fields are missing", () => {
         const validationResults = validatePresidentData({})
         assert.ok(validationResults.general !== undefined)
      })
      it("show field errors when fields are missing", () => {
         const validationResults = validatePresidentData({})
         const { name, password, country, email } = validationResults.fields

         assert.ok(name !== undefined, "name message")
         assert.ok(password !== undefined, "password message")
         assert.ok(country !== undefined, "country message")
         assert.ok(email !== undefined, "email message")
      })
      it("rejects empty 'name' and 'country'", () => {
         const { fields } = validatePresidentData({
            ...validPresidentObject,
            name: "",
            country: ""
         })

         assert.ok(fields.name !== undefined, "name message")
         assert.ok(fields.country !== undefined, "country message")
      })
      it("shows hasButton error field for non-boolean values", () => {
         const stringButton = validatePresidentData({ ...validPresidentObject, hasButton: "false" }).fields.hasButton
         const numberButton = validatePresidentData({ ...validPresidentObject, hasButton: 0 }).fields.hasButton

         assert.ok(stringButton !== undefined, "string button")
         assert.ok(numberButton !== undefined, "number button")
      })
      describe("password validation", () => {
         it("rejects insecure passwords", () => {
            assert.ok(!validatePassword("almostSecure123"), "no special characters")
            assert.ok(!validatePassword("stillNotSecure!@#"), "no numbers")
            assert.ok(!validatePassword("srt1%"), "shorter than 6 characters")
         })
         it("accepts secure password", () => {
            assert.ok(validatePassword("password123!@#"))
         })
      })
      describe("email validation", () => {
         it("rejects invalid emails", () => {
            assert.ok(!validateEmail("invalid@email."), "empty TLD")
            assert.ok(!validateEmail("@mail.com"), "no prefix")
            assert.ok(!validateEmail("invalid@"), "no domain")
         })
         it("accepts valid email", () => {
            assert.ok(validateEmail("valid@email.com"))
         })
      })
   })
   describe("satellite data validation", () => {
      it("show field errors when fields are missing", () => {
         const { general, fields } = validateSatelliteData({})
         assert.ok(general !== undefined, "general message")
         assert.ok(Object.keys(fields).length > 0, "fields error messages")
      })
      it("accepts minimum required data", () => {
         assert.ok(validateSatelliteData(validSatelliteDataObject) === undefined)
      })
      it("accepts undefined fields with flag", () => {
         assert.ok(validateSatelliteData({}, true) === undefined)
      })
   })
})
