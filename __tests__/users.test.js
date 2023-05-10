const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Post, Sequelize, Category,Admin } = require("../models");
const crypto = require('crypto');
const fs = require ("fs")

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
const profileImg ='./__tests__/assets/profile.jpg'
const backgroundImg ='./__tests__/assets/background.jpg'

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
describe("GET /users", () => {
    describe("Success", () => {
        it("should response with http status 200 and array of users if success", async () => {
            const { status, body } = await request(app)
                .get("/users")
                .set("access_token",state.admin_access_token)
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
            expect(body.length).toBe(users.length);
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and message Unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .get("/users")
                .set("access_token",state.invalid_access_token)
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
        it("should response with http status 401 and message Unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .get("/users");
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
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
        it("should response with http status 200, access_token, id, username and email if login success with email", async () => {
          const { status, body } = await request(app)
              .post("/users/login")
              .send({
                  username: users[2].email,
                  password: users[2].password
              })
          expect(status).toBe(401);
          expect(body).toEqual({
              message:"Your account is Suspended"
          })
      })
    })
})

describe("PATCH /users/:id/suspend", () => {
    describe("Success", () => {
        it("should response with http status 200 and message Successfully suspend User with id if success", async () => {
            const { status, body } = await request(app)
                .patch(`/users/${users[0].id}/suspend`)
                .set("access_token", state.admin_access_token)
            expect(status).toBe(200);
            expect(body).toEqual(
                { message: `Successfully suspend User with id ${users[0].id}` }
            );
        })
        it("should response with http status 200 and message Successfully suspend User with id if success", async () => {
            const { status, body } = await request(app)
                .patch(`/users/${users[1].id}/suspend`)
                .set("access_token", state.admin_access_token)
            expect(status).toBe(200);
            expect(body).toEqual(
                { message: `Successfully suspend User with id ${users[1].id}` }
            );
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .patch(`/users/${users[0].id}/suspend`)
                .set("access_token", state.invalid_access_token)
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .patch(`/users/${users[0].id}/suspend`);
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
        it("should response with http status 404 and messages User not found if fails", async () => {
            const { status, body } = await request(app)
                .patch(`/users/${posts[0].id}/suspend`)
                .set("access_token", state.admin_access_token)
            expect(status).toBe(404);
            expect(body).toEqual({
                message: "User not found"
            });
        })
    })
})

describe("PATCH /users/update-password", () => {
    describe("Success", () => {
      it("should response with http status 200, and return message Successfully updated Password if success", async () => {
        const payload = {
          oldpassword: users[0].password,
          newpassword: "newpassword"
        };
        const { status, body } = await request(app)
          .patch("/users/update-password")
          .send(payload)
          .set("access_token", state.access_token);
        expect(status).toBe(200);
        expect(body).toEqual({
          message: "Successfully updated Password"
        });
      });
    });
    describe("Fails", () => {
      it("should response with http status 400, and return message Input is required", async () => {
        const payload = {
          oldpassword: users[0].password
        };
        const { status, body } = await request(app)
          .patch("/users/update-password")
          .send(payload)
          .set("access_token", state.access_token);
        expect(status).toBe(400);
        expect(body).toEqual({
          message: "Input is required"
        });
      });
      it("should response with http status 400, and return message Input is required", async () => {
        const payload = {
          newpassword: "newpassword"
        };
        const { status, body } = await request(app)
          .patch("/users/update-password")
          .send(payload)
          .set("access_token", state.access_token);
        expect(status).toBe(400);
        expect(body).toEqual({
          message: "Input is required"
        });
      });
      it("should response with http status 400, and return message Input is required", async () => {
        const payload = {};
        const { status, body } = await request(app)
          .patch("/users/update-password")
          .send(payload)
          .set("access_token", state.access_token);
        expect(status).toBe(400);
        expect(body).toEqual({
          message: "Input is required"
        });
      });
      it("should response with http status 400, and return message Input is required", async () => {
        const payload = {
          oldpassword: users[0].password,
          newpassword: "newpassword"
        };
        const { status, body } = await request(app)
          .patch("/users/update-password")
          .send(payload)
          .set("access_token", state.invalid_access_token);
        expect(status).toBe(401);
        expect(body).toEqual({
          message: "Unauthorized"
        });
      });
      it("should response with http status 400, and return message Input is required", async () => {
        const payload = {
          oldpassword: users[0].password,
          newpassword: "newpassword"
        };
        const { status, body } = await request(app)
          .patch("/users/update-password")
          .send(payload);
        expect(status).toBe(401);
        expect(body).toEqual({
          message: "Unauthorized"
        });
      });
      it("should response with http status 400, and return message Input is required", async () => {
        const payload = {
          oldpassword: "wrongpassword",
          newpassword: "newpassword"
        };
        const { status, body } = await request(app)
          .patch("/users/update-password")
          .send(payload)
          .set("access_token", state.access_token);
        expect(status).toBe(401);
        expect(body).toEqual({
          message: "Unauthorized"
        });
      });
    });
  })

describe("POST /users/register", () => {
    describe("Success", () => {
      it("should response with http status 201, and return message Success creating new admin", async () => {
        const payload = {
          username: "user4",
          email: "user4@gmail.com",
          password: "user1234",
          city:"Jakarta"
        };
        const res = await request(app).post("/users/register").send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("message", expect.any(String));
      });
      it("should response with http status 201, and return message Success creating new admin", async () => {
        const payload = {
          username: "user5",
          email: "user511@gmail.com",
          password: "user12345",
          city:"Jakarta"
        };
        const res = await request(app).post("/users/register").send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("message", expect.any(String));
      });
    });
  
    describe("Fails", () => {
      it("should response with http status 400 and messages 'Password is required' if fails", async () => {
        const payload = {
            username: "user5",
            email: "user15@gmail.com",
            city:"Jakarta"
          };
        const { status, body } = await request(app)
          .post("/users/register")
          .send(payload)
        expect(status).toBe(400);
        expect(body).toEqual({
          message: "Password is required"
        });
      });
      it("should response with http status 400 and messages 'Email is required' if fails", async () => {
        const payload = {
            username: "user5",
            password: "user12345",
            city:"Jakarta"
          };
        const { status, body } = await request(app)
          .post("/users/register")
          .send(payload)
        expect(status).toBe(400);
        expect(body).toEqual({
          message: "Email is not active"
        });
      });
      it("should response with http status 400 and messages 'Username is required' if fails", async () => {
        const payload = {
            email: "user52@gmail.com",
            password: "user12345",
            city:"Jakarta"
          };
        const { status, body } = await request(app)
          .post("/users/register")
          .send(payload)
        expect(status).toBe(400);
        expect(body).toEqual({
          message: "Username is required"
        });
      });
      it("should response with http status 400 and messages input is required if fails", async () => {
        const payload = {
            username: "user5",
            email: "user5@gmail.com",
            password: "user12345",
          };
        const { status, body } = await request(app)
          .post("/users/register")
          .send(payload)
        expect(status).toBe(400);
        expect(body).toEqual({
          message: "City is required"
        });
      });
    });
  })

// describe("PUT /users", () => {
//     describe("Success", () => {
//       it("should response with http status 201, and return message Success updating profile", async () => {
        
//         const formData = new FormData();
//         formData.append("name",'test new');
//         formData.append("notes",'test notes');
//         formData.append("phoneNumber",'085487511215');
//         formData.append("city",'Jakarta');
//         // formData.append("data", JSON.stringify(payload));
//         formData.append('profileImg', fs.createReadStream(profileImg));
//         formData.append('backgroundImg', fs.createReadStream(backgroundImg));

//         const { status, body } = await request(app)
//         .put("/users")
//         .set("access_token",state.access_token)
//         .set('Content-Type', 'multipart/form-data')
//         .field("name",'test new')
//         .field("notes",'test notes')
//         .field("phoneNumber",'085487511215')
//         .field("city",'Jakarta')
//         .attach("profileImg",profileImg)
//         .attach("backgroundImg",backgroundImg)
//         expect(status).toBe(200);
//         expect(body).toEqual({
//           message:"test"
//         });
//       });
//     });
//     describe("Fails", () => {
//       it("should response with http status 201, and return message Success updating profile", async () => {
        
//         const formData = new FormData();
//         formData.append("name",'test new');
//         formData.append("notes",'test notes');
//         formData.append("phoneNumber",'085487511215');
//         formData.append("city",'Jakarta');
//         // formData.append("data", JSON.stringify(payload));
//         formData.append('profileImg', fs.createReadStream(profileImg));
//         formData.append('backgroundImg', fs.createReadStream(backgroundImg));

//         const { status, body } = await request(app)
//         .put("/users")
//         .set("access_token",state.access_token)
//         .set('Content-Type', 'multipart/form-data')
//         .field("name",'test new')
//         .field("notes",'test notes')
//         .field("phoneNumber",'085487511215')
//         .field("city",'Jakarta')
//         .attach("profileImg",profileImg)
//         .attach("backgroundImg",backgroundImg)
//         expect(status).toBe(404);
//         expect(body).toEqual({
//           message:"test"
//         });
//       });
//     });
// })