const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { Trade, User, Post, Sequelize, Category } = require("../models");
const crypto = require('crypto');

const state = {
    access_token: "",
    invalid_access_token: "sufef82n4428rn8rqn0qr9nar9nanuafnanr387n3r2r7",
}
const currentDate = new Date();
const users = require("../config/database.json").users
    .map(el => {
        el.createdAt = el.updatedAt = currentDate;
        el.token = crypto.randomBytes(32).toString('hex');
        return el;
    })
const posts = require("../config/database.json").posts
    .map(el => {
        el.createdAt = el.updatedAt = currentDate;
        el.meetingPoint = Sequelize.fn(
            'ST_GeomFromText',
            Sequelize.literal(`'POINT(${el.meetingPoint.longitude} ${el.meetingPoint.latitude})'`),
            '4326'
        );
        return el;
    })
const categories = require("../config/database.json").categories
    .map(el => {
        el.createdAt = el.updatedAt = currentDate;
        return el;
    })
const trades = [
    {
        "id": "e759b264-980a-4d0a-90a4-cd484beffe49",
        "SenderPostId": "b6f2c698-7eeb-470c-8f73-ec2451d5adb2",
        "TargetPostId": "1590e5ca-bbca-46ff-be71-a7ec95e6379f",
        "SenderUserId": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        "TargetUserId": "3d131ee0-6f16-4fc7-a033-fa8e06acd172",
        "status": "requesting",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        "id": "8741881b-59ce-4d9e-b8e0-07d037511022",
        "SenderPostId": "49e0900b-15cf-4558-a5bb-92eaa18117ec",
        "TargetPostId": "9a7dc419-730f-4a7a-a741-e7ad2d2b7187",
        "SenderUserId": "3d131ee0-6f16-4fc7-a033-fa8e06acd172",
        "TargetUserId": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        "status": "requesting",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
]
beforeAll(async () => {
    try {
        await User.bulkCreate(users)
        await Category.bulkCreate(categories)
        await Post.bulkCreate(posts)
        await Trade.bulkCreate(trades)
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
        await Category.truncate({
            cascade: true
        })
        await Post.truncate({
            cascade: true
        })
        await Trade.truncate({
            cascade: true
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});

describe("POST /trades", () => {
    describe("Success", () => {
        it("should response with http status 201 and array of users if success", async () => {
            const { status, body } = await request(app)
                .post("/trades")
                .set("access_token", state.access_token)
                .send({
                    TargetUserId: "8a023fb1-7d88-4921-ae6a-16350ac8b2b0",
                    SenderPostId: "32d55956-10c4-4e0d-9e07-fa9a6d6a3509",
                    TargetPostId: "86c8b025-6e30-4f0d-9d6a-ee106f62fa11",
                })
            expect(status).toBe(201);
            expect(body).toEqual({
                message: "Trade successfully created",
                SenderUserId,
                TargetUserId
            });
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .post("/trades")
                .set("access_token", state.invalid_access_token)
                .send({
                    TargetUserId: "8a023fb1-7d88-4921-ae6a-16350ac8b2b0",
                    SenderPostId: "941dd6be-f907-40f7-992a-f5ad52ecb505",
                    TargetPostId: "86c8b025-6e30-4f0d-9d6a-ee106f62fa11",
                })
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
        it("should response with http status 400 and messages Input is required if fails", async () => {
            const { status, body } = await request(app)
                .post("/trades")
                .set("access_token", state.access_token)
                .send({
                    TargetUserId: "8a023fb1-7d88-4921-ae6a-16350ac8b2b0",
                    TargetPostId: "86c8b025-6e30-4f0d-9d6a-ee106f62fa11",
                })
            expect(status).toBe(400);
            expect(body).toEqual({
                message: "Input is required"
            });
        })
        it("should response with http status 400 and messages Input is required if fails", async () => {
            const { status, body } = await request(app)
                .post("/trades")
                .set("access_token", state.access_token)
                .send({})
            expect(status).toBe(400);
            expect(body).toEqual({
                message: "Input is required"
            });
        })
        it("should response with http status 404 and messages User not found if fails", async () => {
            const { status, body } = await request(app)
                .post("/trades")
                .set("access_token", state.access_token)
                .send({
                    TargetUserId: "8a023fb1-7d88-4921-ae6a-163ac8b2b0",
                    SenderPostId: "941dd6be-f907-40f7-992a-f5ad52ecb505",
                    TargetPostId: "86c8b025-6e30-4f0d-9d6a-ee106f62fa11",
                })
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "User not found"
            });
        })
        it("should response with http status 404 and messages Post not found if fails", async () => {
            const { status, body } = await request(app)
                .post("/trades")
                .set("access_token", state.access_token)
                .send({
                    TargetUserId: "8a023fb1-7d88-4921-ae6a-16350ac8b2b0",
                    SenderPostId: "941dd6be-f907-40f7-992a-f5adecb505",
                    TargetPostId: "86c8b025-6e30-4f0d-9d6a-ee106f62fa11",
                })
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "Post not found"
            });
        })

    })
})
