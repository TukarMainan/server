const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { Comment,User,Post} = require("../models");
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
const comments=[
    {
        "id": "d4e31eb5-27bd-4d10-99e6-8c75af9231db",
        "PostId": "notifikasi 1",
        "UserId": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        "id": "d4e31eb5-27bd-4d10-99e6-8c75af9231db",
        "PostId": "notifikasi 1",
        "UserId": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
  ]
const posts=[
    {
        "id": "b6f2c698-7eeb-470c-8f73-ec2451d5adb2",
        "title": "Figure Avengers ZD Toys Iron Man",
        "UserId": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        "description": "The toy figure is made of plastic and has a blue and green face with a white beard and mustache. There is also a clear plastic container in the box, as well as two red gloves on the surface below it.",
        "condition": "like new",
        "CategoryId": "e759b264-980a-4d0a-90a4-cd484beffe49",
        "status": "active",
        "meetingPoint": {
            "latitude": -6.2146,
            "longitude": 106.8451
        },
        "images": [
            "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/1/24/80aa5781-cb34-4af9-a8f2-483dee85a6dc.jpg.webp?ect=4g",
            "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/1/24/9c975403-fa61-4fd5-8d76-9f3926bed5a3.jpg.webp?ect=4g",
            "https://images.tokopedia.net/img/cache/100-square/VqbcmM/2023/1/24/38a3cc55-3faa-4a11-b425-ee34a47d3952.jpg.webp?ect=4g"
        ],
        "price": 100000
    },
    {
        "id": "9a7dc419-730f-4a7a-a741-e7ad2d2b7187",
        "title": "Mainan perosotan slide parklon pink foldable lipat",
        "UserId": "c4131dfc-799c-4a35-9eec-6560cdd363b3",
        "description": "mainan perosotan parklon warna pink, tanpa bola ,kondisi oke, hanya sticker sudah agak lepas",
        "condition": "lightly used",
        "CategoryId": "8741881b-59ce-4d9e-b8e0-07d037511022",
        "status": "complete",
        "meetingPoint": {
            "latitude": -7.2575,
            "longitude": 112.7521
        },
        "images": [
            "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/4/10/0bdf1b8d-6ddd-4e8b-ad1a-3068cc884346.jpg",
            "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/4/10/03c584ab-f083-4f18-99c9-0dc366ccb9f9.jpg",
            "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/4/10/e98b4d9c-44c1-42e2-85da-3c239050300a.jpg"
        ],
        "price": 150000
    }
]
beforeAll(async () => {
    try {
        await User.bulkCreate(users)
        await Post.bulkCreate(posts)
        await Comment.bulkCreate(comments)
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
  
  afterAll(async() => {
    try {
        await User.truncate({
            cascade: true
        })
        await Post.truncate({
            cascade: true
        })
        await Comment.truncate({
            cascade: true
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
  });

  describe("POST /comments", () => {
    describe("Success", () => {
        it("should response with http status 201 and message Success creating comment if success", async () => {
            const payload={
                message:"waw mantap",
                PostId:"9a7dc419-730f-4a7a-a741-e7ad2d2b7187"
            }
            const { status, body } = await request(app)
                .post("/comments")
                .set("access_token", state.access_token)
                .send(payload)
            expect(status).toBe(201);
            expect(body).toEqual({
                message:"Success creating comment"
            });
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and message Unauthorized if success", async () => {
            const payload={
                message:"waw mantap",
                PostId:"9a7dc419-730f-4a7a-a741-e7ad2d2b7187"
            }
            const { status, body } = await request(app)
                .post("/comments")
                .set("access_token", state.invalid_access_token)
                .send(payload)
            expect(status).toBe(401);
            expect(body).toEqual({
                message:"Unauthorized"
            });
        })
        it("should response with http status 400 and message Input is required if success", async () => {
            const payload={
                message:"waw mantap",
            }
            const { status, body } = await request(app)
                .post("/comments")
                .set("access_token", state.access_token)
                .send(payload)
            expect(status).toBe(400);
            expect(body).toEqual({
                message:"Input is required"
            });
        })
        it("should response with http status 400 and message Input is required if success", async () => {
            const payload={
                PostId:"9a7dc419-730f-4a7a-a741-e7ad2d2b7187",
            }
            const { status, body } = await request(app)
                .post("/comments")
                .set("access_token", state.access_token)
                .send(payload)
            expect(status).toBe(400);
            expect(body).toEqual({
                message:"Input is required"
            });
        })
        it("should response with http status 400 and message Input is required if success", async () => {
            const payload={}
            const { status, body } = await request(app)
                .post("/comments")
                .set("access_token", state.access_token)
                .send(payload)
            expect(status).toBe(400);
            expect(body).toEqual({
                message:"Input is required"
            });
        })
        it("should response with http status 404 and message Post not found if success", async () => {
            const payload={
                PostId:"9a7dc419-730f-4a7a-a741-e7ad2d2b187",
                message:"waw mantap"
            }
            const { status, body } = await request(app)
                .post("/comments")
                .set("access_token", state.access_token)
                .send(payload)
            expect(status).toBe(404);
            expect(body).toEqual({
                message:"Post not found"
            });
        })
    })
})
