const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { Category, Admin } = require("../models");

const state = {
    access_token: "",
    invalid_access_token: "sufef82n4428rn8rqn0qr9nar9nanuafnanr387n3r2r7",
}

const admins = [
    {
        "id": "05ef6fb8-be74-4904-99b8-8fd0c84ddf78",
        "email": "admin1@gmail.com",
        "password": "admin111",
        "username": "admin1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

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
        await Category.bulkCreate(categories)
        await Admin.bulkCreate(admins)
        const { status, body } = await request(app)
            .post("/admins/login")
            .send({
                username: admins[0].username,
                password: admins[0].password
            })
        state.access_token = body.access_token;
    } catch (err) {
        console.log(err)
        process.exit(1);
    }
});

afterAll(async () => {
    try {
        await Admin.truncate({
            cascade: true
        })
        await Category.truncate({
            cascade: true
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});

describe("POST /categories", () => {
    describe("Success", () => {
        it("should response with http status 200 and array of categories if success", async () => {
            const { status, body } = await request(app)
                .post("/categories")
                .set("access_token", state.access_token)
                .send({
                    name: "new Category",
                })
            expect(status).toBe(201);
            expect(body).toEqual({
                message: "Success creating new category"
            });
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .post("/categories")
                .set("access_token", state.invalid_access_token)
                .send({
                    name: "new Category",
                })
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
        it("should response with http status 401 and messages Input is required if fails", async () => {
            const { status, body } = await request(app)
                .post("/categories")
                .set("access_token", state.access_token)
                .send({})
            expect(status).toBe(400);
            expect(body).toEqual({
                message: "Input is required"
            });
        })
    })
})

describe("PATCH /categories/:id", () => {
    describe("Success", () => {
        it("should response with http status 200, and return message Success updating category name", async () => {
            const payload = {
                name: "update Category"
            };
            const { status, body } = await request(app)
                .patch("/categories/e759b264-980a-4d0a-90a4-cd484beffe49")
                .send(payload)
                .set("access_token", state.access_token);
            expect(status).toBe(200);
            expect(body).toEqual({
                message: " Success updating category name"
            });
        });
    });
    describe("Fails", () => {
        it("should response with http status 400, and return message Input is required", async () => {
            const payload = {};
            const { status, body } = await request(app)
                .patch("/categories/e759b264-980a-4d0a-90a4-cd484beffe49")
                .send(payload)
                .set("access_token", state.access_token);
            expect(status).toBe(400);
            expect(body).toEqual({
                message: "Input is required"
            });
        });
        it("should response with http status 401, and return message Unauthorized", async () => {
            const payload = {
                name: "update Category"
            };
            const { status, body } = await request(app)
                .patch("/categories/e759b264-980a-4d0a-90a4-cd484beffe49")
                .send(payload)
                .set("access_token", state.invalid_access_token);
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        });
        it("should response with http status 404, and return message Category not found", async () => {
            const payload = {
                name: "update Category"
            };
            const { status, body } = await request(app)
                .patch("/categories/e759b264-980a-4d0a-90a4-cd484beffe4")
                .send(payload)
                .set("access_token", state.access_token);
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "Category not found"
            });
        });
    });
})
