const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Notification } = require("../models");
const crypto = require('crypto');

const state = {
    access_token: "",
    invalid_access_token: "sufef82n4428rn8rqn0qr9nar9nanuafnanr387n3r2r7",
}
const users = [
    {
        "id": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        "email": "alice@gmail.com",
        "username": "Alice",
        "password": "alice123",
        "profileImg": "https://akcdn.detik.net.id/community/media/visual/2020/02/21/91662e7e-2966-404f-a628-495a8c12c7b8_43.jpeg?w=250&q=",
        "name": "Alice Wonderland",
        "notes": "i am a verified user",
        "phoneNumber": "082110981550",
        "status": "verified",
        "city": "Jakarta",
        "ratings": [0],
        "token": crypto.randomBytes(32).toString('hex')
    }
]
const notifications = [
    {
        "id": "d4e31eb5-27bd-4d10-99e6-8c75af9231db",
        "message": "notifikasi 1",
        "UserId": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        "id": "ac0ccc1b-90ed-431a-8fee-03423aa051df",
        "message": "notifikasi 2",
        "UserId": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        "id": "cfc5751e-82fd-4a5d-9bdc-bbae4791b89a",
        "message": "notifikasi 3",
        "UserId": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
]
beforeAll(async () => {
    try {
        await User.bulkCreate(users)
        await Notification.bulkCreate(notifications)
        const { status, body } = await request(app)
            .post("/users/login")
            .send({
                username: users[0].username,
                password: users[0].password
            })
        state.access_token = body.access_token;
    } catch (err) {
        console.log(err)
        process.exit(1);
    }
});

afterAll(async () => {
    try {
        await User.truncate({
            cascade: true
        })
        await Notification.truncate({
            cascade: true
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});

describe("GET /notifications", () => {
    describe("Success", () => {
        it("should response with http status 200 and array of notifications if success", async () => {
            const { status, body } = await request(app)
                .get("/notifications")
                .set("access_token", state.access_token)
            console.log(body, status);
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .get("/notifications")
                .set("access_token", state.invalid_access_token)
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
    })
})
