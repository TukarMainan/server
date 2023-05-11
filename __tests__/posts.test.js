const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Post, Sequelize, Category,Admin } = require("../models");
const crypto = require('crypto');
const fs = require('fs')

const state = {
    access_token: "",
    admin_access_token: "",
    invalid_access_token: "sufef82n4428rn8rqn0qr9nar9nanuafnanr387n3r2r7"
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
const admins = require("../config/database.json").admins
.map(el => {
    el.createdAt = el.updatedAt = currentDate;
    return el;
})
beforeAll(async () => {
    try {
        await User.bulkCreate(users)
        await Category.bulkCreate(categories)
        await Post.bulkCreate(posts)
        await Admin.bulkCreate(admins)
        const { status, body } = await request(app)
            .post("/users/login")
            .send({
                username: users[0].username,
                password: users[0].password
            })
        state.access_token = body.access_token;
        const res = await request(app)
            .post("/admins/login")
            .send({
                username: admins[0].username,
                password: admins[0].password
            })
        state.admin_access_token = res.body.access_token;
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
        await Admin.truncate({
            cascade: true
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});

describe("GET /posts/posts-by-average-profile-price", () => {
    describe("Success", () => {
        it("should response with http status 200 and array of posts if success", async () => {
            const { status, body } = await request(app)
                .get("/posts/posts-by-average-profile-price")
                .set("access_token", state.access_token)
            console.log(body, status);
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .get("/posts/posts-by-average-profile-price")
                .set("access_token", state.invalid_access_token)
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
    })
})

describe("PATCH /posts/:id/archive", () => {
    describe("Success", () => {
        it("should response with http status 200 and message Successfully archive Post with id if success", async () => {
            const { status, body } = await request(app)
                .patch(`/posts/${posts[0].id}/archive`)
                .set("access_token", state.admin_access_token)
            expect(status).toBe(200);
            expect(body).toEqual(
                { message: `Successfully archive Post with id ${posts[0].id}` }
            );
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .patch(`/posts/${posts[0].id}/archive`)
                .set("access_token", state.invalid_access_token)
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
        it("should response with http status 404 and messages Post not found if fails", async () => {
            const { status, body } = await request(app)
                .patch(`/posts/8741881b-59ce-4d9e-b8e0-07d03751022/archive`)
                .set("access_token", state.admin_access_token)
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "Post not found"
            });
        })
    })
})

describe("PATCH /posts/:id", () => {
    describe("Success", () => {
        it("should response with http status 200 and message Successfully updated status Post with id if success", async () => {
            const { status, body } = await request(app)
                .patch(`/posts/${posts[0].id}`)
                .set("access_token", state.access_token)
                .send({
                    status:"complete"
                })
            expect(status).toBe(200);
            expect(body).toEqual(
                { message: `Successfully updated status Post with id ${posts[0].id}` }
            );
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .patch(`/posts/${posts[0].id}`)
                .set("access_token", state.invalid_access_token)
                .send({
                    status:"complete"
                })
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
        it("should response with http status 404 and messages Post not found if fails", async () => {
            const { status, body } = await request(app)
                .patch(`/posts/8741881b-59ce-4d9e-b8e0-07d03751022`)
                .set("access_token", state.access_token)
                .send({
                    status:"complete"
                })
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "Post not found"
            });
        })
        it("should response with http status 400 and messages Input is required if fails", async () => {
            const { status, body } = await request(app)
                .patch(`/posts/${posts[0].id}`)
                .set("access_token", state.access_token)
                .send()
            expect(status).toBe(400);
            expect(body).toEqual({
                message: "Input is required"
            });
        })
        it("should response with http status 200 and message Successfully updated status Post with id if success", async () => {
            const { status, body } = await request(app)
                .patch(`/posts/${posts[2].id}`)
                .set("access_token", state.access_token)
                .send({
                    status:"complete"
                })
            expect(status).toBe(403);
            expect(body).toEqual(
                { message: `Forbidden access` }
            );
        })
    })
})


describe("DELETE /posts/:id", () => {
    describe("Success", () => {
        it("should response with http status 200 and message Successfully delete post if success", async () => {
            const { status, body } = await request(app)
                .delete(`/posts/${posts[0].id}`)
                .set("access_token", state.access_token)
            expect(status).toBe(201);
            expect(body).toEqual(
                { message: `Successfully delete post` }
            );
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .delete(`/posts/${posts[0].id}`)
                .set("access_token", state.invalid_access_token)
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .delete(`/posts/${posts[0].id}`)
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .delete(`/posts/${posts[2].id}`)
                .set("access_token", state.access_token)
            expect(status).toBe(403);
            expect(body).toEqual({
                message: "Forbidden access"
            });
        })
    })
})

describe("POST /posts", () => {
    describe("Success", () => {
        it("should response with http status 200 and message Successfully create post if success", async () => {            
            const { status, body } = await request(app)
                .post("/posts")
                .set("access_token", state.access_token)
                .set('Content-Type', 'multipart/form-data')
                .field("title",'new post')
                .field("description",'test post description')
                .field("condition",'like new')
                .field("CategoryId",'e759b264-980a-4d0a-90a4-cd484beffe49')
                .field('meetingPoint', JSON.stringify({ longitude: 1.23456, latitude: 7.89012 }))
                .field("price",200000)
                .attach("images",'./__tests__/assets/post1.jpg')
                .attach("images",'./__tests__/assets/post1.jpg')
                .attach("images",'./__tests__/assets/post1.jpg')
                .attach("images",'./__tests__/assets/post1.jpg')
                .attach("images",'./__tests__/assets/post1.jpg')
            expect(status).toBe(201);
            expect(body).toEqual({
                message:"Successfully create post"
            });
        },50000)
        it("should response with http status 200 and message Successfully create post if success", async () => {            
            const { status, body } = await request(app)
                .post("/posts")
                .set("access_token", state.access_token)
                .set('Content-Type', 'multipart/form-data')
                .field("title",'new post 2')
                .field("description",'test post description 2')
                .field("condition",'like new')
                .field("CategoryId",'e759b264-980a-4d0a-90a4-cd484beffe49')
                .field('meetingPoint', JSON.stringify({ longitude: 1.23456, latitude: 7.89012 }))
                .field("price",150000)
                .attach("images",'./__tests__/assets/post1.jpg')
                .attach("images",'./__tests__/assets/post1.jpg')
                .attach("images",'./__tests__/assets/post1.jpg')
            expect(status).toBe(201);
            expect(body).toEqual({
                message:"Successfully create post"
            });
        },50000)
    })
    describe("Fails",()=>{
            it("should response with http status 400 and maessage Images is required if fails", async () => {            
                const { status, body } = await request(app)
                    .post("/posts")
                    .set("access_token", state.access_token)
                    .set('Content-Type', 'multipart/form-data')
                    .field("title",'new post')
                    .field("description",'test post description')
                    .field("condition",'like new')
                    .field("CategoryId",'e759b264-980a-4d0a-90a4-cd484beffe49')
                    .field('meetingPoint', JSON.stringify({ longitude: 1.23456, latitude: 7.89012 }))
                    .field("price",200000)
                expect(status).toBe(400);
                expect(body).toEqual({
                    message:"Images is required"
                });
            },50000)
            it("should response with http status 400 and maessage Maximum 5 images upload if fails", async () => {            
                const { status, body } = await request(app)
                    .post("/posts")
                    .set("access_token", state.access_token)
                    .set('Content-Type', 'multipart/form-data')
                    .field("title",'new post')
                    .field("description",'test post description')
                    .field("condition",'like new')
                    .field("CategoryId",'e759b264-980a-4d0a-90a4-cd484beffe49')
                    .field('meetingPoint', JSON.stringify({ longitude: 1.23456, latitude: 7.89012 }))
                    .field("price",200000)
                    .attach("images",'./__tests__/assets/post1.jpg')
                    .attach("images",'./__tests__/assets/post1.jpg')
                    .attach("images",'./__tests__/assets/post1.jpg')
                    .attach("images",'./__tests__/assets/post1.jpg')
                    .attach("images",'./__tests__/assets/post1.jpg')
                    .attach("images",'./__tests__/assets/post1.jpg')
                expect(status).toBe(400);
                expect(body).toEqual({
                    message:"Maximum 5 images upload"
                });
            },50000)
            it("should response with http status 400 and maessage title is required if fails", async () => {            
                const { status, body } = await request(app)
                    .post("/posts")
                    .set("access_token", state.access_token)
                    .set('Content-Type', 'multipart/form-data')
                    .field("description",'test post description')
                    .field("condition",'like new')
                    .field("CategoryId",'e759b264-980a-4d0a-90a4-cd484beffe49')
                    .field('meetingPoint', JSON.stringify({ longitude: 1.23456, latitude: 7.89012 }))
                    .field("price",200000)
                    .attach("images",'./__tests__/assets/post1.jpg')
                expect(status).toBe(400);
                expect(body).toEqual({
                    message:"Title is required"
                });
            },50000)
            it("should response with http status 404 and maessage Category not found if fails", async () => {            
                const { status, body } = await request(app)
                    .post("/posts")
                    .set("access_token", state.access_token)
                    .set('Content-Type', 'multipart/form-data')
                    .field("title",'new post')
                    .field("description",'test post description')
                    .field("condition",'like new')
                    .field("CategoryId",'e759b264-980a-4d0a-90a4-cd484')
                    .field('meetingPoint', JSON.stringify({ longitude: 1.23456, latitude: 7.89012 }))
                    .field("price",200000)
                    .attach("images",'./__tests__/assets/post1.jpg')
                expect(status).toBe(404);
                expect(body).toEqual({
                    message:"Category not found"
                });
            },50000)
            it("should response with http status 400 and maessage Maximum 5 images upload if fails", async () => {            
                const { status, body } = await request(app)
                    .post("/posts")
                    .set("access_token", state.access_token)
                    .set('Content-Type', 'multipart/form-data')
                    .field("title",'new post')
                    .field("description",'test post description')
                    .field("condition", "like")
                    .field("CategoryId",'e759b264-980a-4d0a-90a4-cd484beffe49')
                    .field('meetingPoint', JSON.stringify({ longitude: 1.23456, latitude: 7.89012 }))
                    .field("price",200000)
                    .attach("images",'./__tests__/assets/post1.jpg')
                expect(status).toBe(400);
                expect(body).toEqual({
                    message:`invalid input value for enum \"enum_Posts_condition\": \"like\"`
                });
            },50000)
            it("should response with http status 400 and maessage Internal Server Error if fails", async () => {            
                const { status, body } = await request(app)
                    .post("/posts")
                    .set("access_token", state.access_token)
                    .set('Content-Type', 'multipart/form-data')
                    .field("title",'new post')
                    .field("description",'test post description')
                    .field("condition",'like new')
                    .field("CategoryId",'e759b264-980a-4d0a-90a4-cd484beffe49')
                    .field('meetingPoint', "test")
                    .field("price",200000)
                    .attach("images",'./__tests__/assets/post1.jpg')
                expect(status).toBe(500);
                expect(body).toEqual({
                    message:"Internal Server Error"
                });
            },50000)
            it("should response with http status 400 and maessage Maximum 5 images upload if fails", async () => {            
                const { status, body } = await request(app)
                    .post("/posts")
                    .set("access_token", state.access_token)
                    .set('Content-Type', 'multipart/form-data')
                    .field("title",'new post')
                    .field("description",'test post description')
                    .field("condition",'like new')
                    .field("CategoryId",'e759b264-980a-4d0a-90a4-cd484beffe49')
                    .field('meetingPoint', JSON.stringify({ longitude: 1.23456, latitude: 7.89012 }))
                    .field("price","test")
                    .attach("images",'./__tests__/assets/post1.jpg')
                expect(status).toBe(400);
                expect(body).toEqual({
                    message:"invalid input syntax for type integer: \"test\""
                });
            },50000)
    })
})