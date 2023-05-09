const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const crypto = require('crypto');

const currentDate = new Date();
const users = require("../config/database.json").users
    .map(el => {
        el.createdAt = el.updatedAt = currentDate;
        el.token = crypto.randomBytes(32).toString('hex');
        return el;
    })

beforeAll(async () => {
    try {
        await User.bulkCreate(users);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})

afterAll(async () => {
    try {
        await User.truncate({
            cascade: true
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})

describe("GET /users", () => {
    describe("Success", () => {
        it("should response with http status 200 and array of users if success", async () => {
            const { status, body } = await request(app)
                .get("/users")
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
            expect(body.length).toBe(users.length);
        })
    })
})

describe("POST /users/login", () => {
    describe("Success", () => {
        it("should response with http status 200, access_token, id, username and email if login success with email", async () => {
            const { status, body } = await request(app)
                .post("/users/login")
                .send({
                    username: users[0].email,
                    password: users[0].password
                })
            expect(status).toBe(200);
            expect(body).toEqual({
                access_token: expect.any(String),
                id: expect.any(String),
                username: expect.any(String),
                email: expect.any(String)
            })
        })

        it("should response with http status 200, access_token, id, username and email if login success with username", async () => {
            const { status, body } = await request(app)
                .post("/users/login")
                .send({
                    username: users[0].username,
                    password: users[0].password
                })
            expect(status).toBe(200);
            expect(body).toEqual({
                access_token: expect.any(String),
                id: expect.any(String),
                username: expect.any(String),
                email: expect.any(String)
            })
        })
    })

    describe("Fails", () => {
        it("should response with http status 400 and message 'Input is required' if username not sent", async () => {
            const { status, body } = await request(app)
                .post("/users/login")
                .send({
                    password: "wrong password"
                })
            expect(status).toBe(400);
            expect(body).toEqual({
                message: "Input is required"
            })
        })

        it("should response with http status 400 and message 'Input is required' if password not sent", async () => {
            const { status, body } = await request(app)
                .post("/users/login")
                .send({
                    username: users[0].username
                })
            expect(status).toBe(400);
            expect(body).toEqual({
                message: "Input is required"
            })
        })

        it("should response with http status 401 and message 'Unauthorized' if login password wrong with email", async () => {
            const { status, body } = await request(app)
                .post("/users/login")
                .send({
                    username: users[0].email,
                    password: "wrong password"
                })
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            })
        })

        it("should response with http status 401 and message 'Unauthorized' if login password wrong with username", async () => {
            const { status, body } = await request(app)
                .post("/users/login")
                .send({
                    username: users[0].username,
                    password: "wrong password"
                })
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            })
        })
    })
})