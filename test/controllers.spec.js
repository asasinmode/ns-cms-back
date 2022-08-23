import assert from "assert/strict"
import mongoose from "mongoose"
import request from "supertest"

import app from "../src/app.js"
import connect from "../src/database/index.js"
import PresidentModel from "../src/database/President.js"
import SatelliteModel from "../src/database/Satellite.js"
import { validPresidentObject, validSatelliteDataObject } from "./helpers.spec.js"

describe("controllers", () => {
   const randomPrefix = Date.now().toString() + Math.floor(Math.random() * 100)
   const testEmail = `${ randomPrefix }@test.test`
   const testSideNumber = `test${ randomPrefix }`
   let token
   let testSatellite

   before((done) => {
      connect().then(done)
   })
   after(async () => {
      await PresidentModel.findOneAndRemove({ email: testEmail })
      await SatelliteModel.deleteMany({ sideNumber: testSideNumber })
      mongoose.connection.close()
   })

   describe("president", () => {
      it("reject president without required fields", (done) => {
         request(app)
            .post('/president')
            .send({})
            .expect(400, done)
      })
      it("create president with valid fields and return JWT", () => {
         return request(app)
            .post('/president')
            .send({
               ...validPresidentObject,
               email: testEmail
            })
            .expect(201)
            .then(res => {
               assert.ok(res.body.token !== undefined)
            })
      })
      it("return jwt on login", () => {
         return request(app)
            .post('/president/login')
            .send({
               email: testEmail,
               password: "secure123!"
            })
            .expect(200)
            .then(res => {
               assert.ok(res.body.token !== undefined)
               token = res.body.token
            })
      })
   })
   describe("satellites", () => {
      it("reject satellite without required fields", (done) => {
         request(app)
            .post('/satellites')
            .set('Authorization', `Bearer: ${ token }`)
            .send({})
            .expect(400, done)
      })
      it("create satellite with valid fields and return its data", () => {
         return request(app)
            .post('/satellites')
            .set('Authorization', `Bearer: ${ token }`)
            .send({
               ...validSatelliteDataObject,
               sideNumber: testSideNumber
            })
            .expect(201)
            .then(res => {
               assert.ok(res.body._id !== undefined)
               testSatellite = res.body
            })
      })
      it("patches satellite with only data sent and updates updatedAt", () => {
         return request(app)
            .patch(`/satellites/${ testSatellite._id }`)
            .set('Authorization', `Bearer: ${ token }`)
            .send({
               vintage: 2000,
               launchedAt: Date.parse("01 Jan 2000 00:00:00 GMT")
            })
            .expect(200)
            .then(res => {
               assert.ok(res.body.sideNumber === testSatellite.sideNumber, "side number changed")
               assert.ok(res.body.vintage === 2000, "vintage hasn't changed")
               assert.ok(res.body.updatedAt !== testSatellite.updatedAt, "updatedAt is same as at creation")
            })
      })
      it("deletes satellite by id", (done) => {
         request(app)
            .delete(`/satellites/${ testSatellite._id }`)
            .set('Authorization', `Bearer: ${ token }`)
            .expect(204, done)
      })
      describe("rejects without authorization", () => {
         it("post request", (done) => {
            request(app)
               .post('/satellites')
               .send({})
               .expect(403, done)
         })
         it("patch request", (done) => {
            request(app)
               .patch(`/satellites/${ testSatellite._id }`)
               .send({})
               .expect(403, done)
         })
         it("delete request", (done) => {
            request(app)
               .delete(`/satellites/${ testSatellite._id }`)
               .expect(403, done)
         })
      })
   })
})
