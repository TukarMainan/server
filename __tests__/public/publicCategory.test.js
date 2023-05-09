const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../../app");
const { sequelize, AdminLog} = require("../../models");
const { queryInterface } = sequelize;


const categories = [
    {
        "id": "e759b264-980a-4d0a-90a4-cd484beffe49",
        "name": "Boys",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        "id": "8741881b-59ce-4d9e-b8e0-07d037511022",
        "name": "Girls",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        "id": "a7bb0fc2-c23f-4602-9e3c-318476e41e4b",
        "name": "Neutral",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
  ]
beforeAll(async () => {
    try {
       await  queryInterface
      .bulkInsert("Categories",categories )
    } catch (err) {
        console.log(err)
        process.exit(1);
    }
  });
  
  afterAll(async() => {
    try {
        await Admin.destroy({ truncate: true, cascade: true, restartIdentity: true })
        await AdminLog.destroy({ truncate: true, cascade: true, restartIdentity: true })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
  });

  describe("GET /public/categories", () => {
    describe("Success", () => {
        it("should response with http status 200 and array of users if success", async () => {
            const { status, body } = await request(app)
                .get("/public/categories")
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
            expect(body.length).toBe(categories.length);
        })
    })
})

describe("Get /public/categories/:id", () => {
    describe("Success", () => {
        it("should response with http status 200, access_token, id, username and email if login success with email", async () => {
            const { status, body } = await request(app)
                .get("/public/categories/e759b264-980a-4d0a-90a4-cd484beffe49")
            expect(status).toBe(200);
            expect(body).toEqual({
                id: expect.any(String),
                name: expect.any(String),
            })
        })
    })

    describe("Fails", () => {
        it("should response with http status 404 and message 'Input is required' if username not sent", async () => {
            const { status, body } = await request(app)
                .post("/public/categories/e759b264-980a-4d0a-90a4-cd484beffe49")
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "Category not found"
            })
        })
    })
})