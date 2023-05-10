const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../../app");
const { User, Post, Sequelize, Category } = require("../../models");
const crypto = require('crypto');


const currentDate = new Date();
const users = require("../../config/database.json").users
    .map(el => {
        el.createdAt = el.updatedAt = currentDate;
        el.token = crypto.randomBytes(32).toString('hex');
        return el;
    })
const posts = require("../../config/database.json").posts
    .map(el => {
        el.createdAt = el.updatedAt = currentDate;
        el.meetingPoint = Sequelize.fn(
            'ST_GeomFromText',
            Sequelize.literal(`'POINT(${el.meetingPoint.longitude} ${el.meetingPoint.latitude})'`),
            '4326'
        );
        return el;
    })
const categories = require("../../config/database.json").categories
    .map(el => {
        el.createdAt = el.updatedAt = currentDate;
        return el;
    })

beforeAll(async () => {
    try {
        await User.bulkCreate(users)
        await Category.bulkCreate(categories)
        await Post.bulkCreate(posts)
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
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});

describe("GET /public/posts", () => {
    describe("Success", () => {
        it("should response with http status 200 and array of posts if success", async () => {
            const { status, body } = await request(app)
                .get("/public/posts")
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
            expect(body.length).toBe(posts.length);
        })
        it("should response with http status 200 and array of posts if success", async () => {
            const { status, body } = await request(app)
                .get("/public/posts?sortby=DESC")
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
        })
        it("should response with http status 200 and array of posts if success", async () => {
            const { status, body } = await request(app)
                .get(`/public/posts?CategoryId=${categories[0].id}`)
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
        })
        it("should response with http status 200 and array of posts if success", async () => {
            const { status, body } = await request(app)
                .get(`/public/posts?condition=like new`)
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
        })
        it("should response with http status 200 and array of posts if success", async () => {
            const { status, body } = await request(app)
                .get(`/public/posts?search=aa`)
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
        })
        it("should response with http status 200 and array of posts if success", async () => {
            const { status, body } = await request(app)
                .get(`/public/posts?city=Jakarta`)
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
        })
    })
    describe("Fails",()=>{
        it("should response with http status 400 and message if success", async () => {
            const { status, body } = await request(app)
                .get(`/public/posts?CategoryId=asda`)
            expect(status).toBe(400);
            expect(body).toEqual(expect.any(Object));
        })
    })
})

describe("Get /public/posts/:id", () => {
    describe("Success", () => {
        it("should response with http status 200, and array if fetch success", async () => {
            const { status, body } = await request(app)
                .get(`/public/posts/${posts[0].id}`)
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Object))
        })
    })

    describe("Fails", () => {
        it("should response with http status 404 and message 'Post not found' if fails", async () => {
            const { status, body } = await request(app)
            .get(`/public/posts/c4131dfc-799c-4a35-9eec-6560cdd363b`)
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "Post not found"
            })
        })
    })
})