const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../../app");
const { User } = require("../../models");
const crypto = require('crypto');

const currentDate = new Date();
const users = require("../../config/database.json").users
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

describe("Get /public/users/:id", () => {
    describe("Success", () => {
        it("should response with http status 200, and array if fetch success", async () => {
            const { status, body } = await request(app)
                .get(`/public/users/${users[0].id}`)
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Object))
        })
    })

    describe("Fails", () => {
        it("should response with http status 404 and message 'User not found' if fails", async () => {
            const { status, body } = await request(app)
            .get(`/public/users/c4131dfc-799c-4a35-9eec-6560cdd363b`)
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "User not found"
            })
        })
    })
})

describe("Get /public/users/verify/:id", () => {
    describe("Success", () => {
        it("should response with http status 200, and message Successfully verified user with id success", async () => {
            const { status, body } = await request(app)
                .get(`/public/users/verify/${users[0].id}?token=${users[0].token}`)
            expect(status).toBe(200);
            expect(body).toEqual({
                message: `Successfully verified User with id ${users[0].id}`
            })
        })
    })

    describe("Fails", () => {
        it("should response with http status 404 and message 'User not found' if fails", async () => {
            const { status, body } = await request(app)
            .get(`/public/users/verify/c4131dfc-799c-4a35-9eec-6560cdd363b?token=${users[0].token}`)
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "User not found"
            })
        })
        it("should response with http status 401 and message 'Unauthorized' if fails", async () => {
            const { status, body } = await request(app)
            .get(`/public/users/verify/${users[0].id}?token=asdas4d65asd231a5sd`)
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            })
        })
        it("should response with http status 400 and message 'Input is required' if fails", async () => {
            const { status, body } = await request(app)
            .get(`/public/users/verify/${users[0].id}`)
            expect(status).toBe(400);
            expect(body).toEqual({
                message: "Input is required"
            })
        })
    })
})