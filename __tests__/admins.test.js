const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { Admin } = require("../models");

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
  {
    "id": "097d9c2e-c914-436b-9445-7894511463bc",
    "email": "admin2@gmail.com",
    "password": "admin222",
    "username": "admin2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    "id": "76848f29-55b4-474a-8fc3-f958997d2d04",
    "email": "admin3@gmail.com",
    "password": "admin333",
    "username": "admin3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

beforeAll(async () => {
  try {
    await Admin.bulkCreate(admins);
    const { status, body } = await request(app)
      .post("/admins/login")
      .send({
        username: admins[0].username,
        password: admins[0].password
      })
    state.access_token = body.access_token;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})

afterAll(async () => {
  try {
    await Admin.truncate({
      cascade: true
    })
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})

describe("POST /admins/login", () => {
  describe("Success", () => {
    it("should response with http status 200, access_token, id, username and email if login success with email", async () => {
      const { status, body } = await request(app)
        .post("/admins/login")
        .send({
          username: admins[0].email,
          password: admins[0].password
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
        .post("/admins/login")
        .send({
          username: admins[0].username,
          password: admins[0].password
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
        .post("/admins/login")
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
        .post("/admins/login")
        .send({
          username: admins[0].username
        })
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Input is required"
      })
    })

    it("should response with http status 401 and message 'Unauthorized' if login password wrong with email", async () => {
      const { status, body } = await request(app)
        .post("/admins/login")
        .send({
          username: admins[0].email,
          password: "wrong password"
        })
      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unauthorized"
      })
    })

    it("should response with http status 401 and message 'Unauthorized' if login password wrong with username", async () => {
      const { status, body } = await request(app)
        .post("/admins/login")
        .send({
          username: admins[0].username,
          password: "wrong password"
        })
      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unauthorized"
      })
    })
  })
})

describe("POST /admins/register", () => {
  describe("Success", () => {
    it("should response with http status 201, and return message Success creating new admin", async () => {
      const payload = {
        username: "admin4",
        email: "admin4@mail.com",
        password: "admin123"
      };
      const res = await request(app).post("/admins/register").send(payload).set("access_token", state.access_token);
      expect(res.status).toBe(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", expect.any(String));
    });
  });

  describe("Fails", () => {
    it("should response with http status 401 and messages unauthorized if fails", async () => {
      const payload = {
        username: "admin4",
        email: "admin4@mail.com",
        password: "admin123"
      };
      const { status, body } = await request(app)
        .post("/admins/register")
        .send(payload)
        .set("access_token", state.invalid_access_token);
      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unauthorized"
      });
    });
    it("should response with http status 400 and messages 'Password is required' if fails", async () => {
      const payload = {
        username: "admin4",
        email: "admin4@mail.com",
      };
      const { status, body } = await request(app)
        .post("/admins/register")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Password is required"
      });
    });
    it("should response with http status 400 and messages 'Email is required' if fails", async () => {
      const payload = {
        username: "admin4",
      };
      const { status, body } = await request(app)
        .post("/admins/register")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Email is required"
      });
    });
    it("should response with http status 400 and messages 'Username is required' if fails", async () => {
      const payload = {
        email: "admin4@mail.com",
        password: "admin123"
      };
      const { status, body } = await request(app)
        .post("/admins/register")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Username is required"
      });
    });
    it("should response with http status 400 and messages input is required if fails", async () => {
      const payload = {
        password: "lalala"
      };
      const { status, body } = await request(app)
        .post("/admins/register")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Email is required"
      });
    });
    it("should response with http status 400 and messages input is required if fails", async () => {
      const payload = {
        username: "admin4",
        password: "lalala"
      };
      const { status, body } = await request(app)
        .post("/admins/register")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Email is required"
      });
    });
    it("should response with http status 400 and messages input is required if fails", async () => {
      const payload = {
        email: "admin4@mail.com",
        password: "lalala"
      };
      const { status, body } = await request(app)
        .post("/admins/register")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Username is required"
      });
    });
    it("should response with http status 400 and messages input is required if fails", async () => {
      const payload = {};
      const { status, body } = await request(app)
        .post("/admins/register")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Email is required"
      });
    });
  });
})

describe("PATCH /admins/update-password", () => {
  describe("Success", () => {
    it("should response with http status 201, and return message Successfully updating Password", async () => {
      const payload = {
        oldPassword: admins[0].password,
        NewPassword: "newpassword"
      };
      const { status, body } = await request(app)
        .patch("/admins/update-password")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(201);
      expect(body).toEqual({
        message: "Successfully updating Password"
      });
    });
  });
  describe("Fails", () => {
    it("should response with http status 400, and return message Input is required", async () => {
      const payload = {
        oldPassword: admins[0].password
      };
      const { status, body } = await request(app)
        .patch("/admins/update-password")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Input is required"
      });
    });
    it("should response with http status 400, and return message Input is required", async () => {
      const payload = {
        NewPassword: "newpassword"
      };
      const { status, body } = await request(app)
        .patch("/admins/update-password")
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
        .patch("/admins/update-password")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Input is required"
      });
    });
    it("should response with http status 400, and return message Input is required", async () => {
      const payload = {
        oldPassword: admins[0].password,
        NewPassword: "newpassword"
      };
      const { status, body } = await request(app)
        .patch("/admins/update-password")
        .send(payload)
        .set("access_token", state.invalid_access_token);
      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unauthorized"
      });
    });
    it("should response with http status 400, and return message Input is required", async () => {
      const payload = {
        oldPassword: "wrongpassword",
        NewPassword: "newpassword"
      };
      const { status, body } = await request(app)
        .patch("/admins/update-password")
        .send(payload)
        .set("access_token", state.access_token);
      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unauthorized"
      });
    });
  });
})
