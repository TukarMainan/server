const { expect, it, describe } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { AdminLog, Admin } = require("../models");

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
const adminLogs = [
    {
        "id": "51cc75fe-b3eb-42ab-a458-6fc6c6f2e532",
        "name": "login",
        "description": "admin hendra telah login",
        "AdminId": "05ef6fb8-be74-4904-99b8-8fd0c84ddf78",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        "id": "2c30eb97-0bc7-45e0-a4e5-e59512d569e2",
        "name": "logout",
        "description": "admin hendra telah logout",
        "AdminId": "05ef6fb8-be74-4904-99b8-8fd0c84ddf78",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        "id": "58be14dd-e9e8-4597-b2b1-0ae02ce42a0e",
        "name": "login",
        "description": "admin2 telah login",
        "AdminId": "097d9c2e-c914-436b-9445-7894511463bc",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        "id": "93e7c626-e760-4580-825b-7e068bb46be7",
        "name": "logout",
        "description": "admin2 telah login",
        "AdminId": "097d9c2e-c914-436b-9445-7894511463bc",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
]

beforeAll(async () => {
    try {
        await Admin.bulkCreate(admins);
        await AdminLog.bulkCreate(adminLogs);
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
        await Admin.destroy({ truncate: true, cascade: true, restartIdentity: true })
        await AdminLog.destroy({ truncate: true, cascade: true, restartIdentity: true })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
});

describe("GET /adminlogs", () => {
    describe("Success", () => {
        it("should response with http status 200 and array of users if success", async () => {
            const { status, body } = await request(app)
                .get("/adminlogs")
                .set("access_token", state.access_token)
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Array));
            expect(body.length).toBe(adminLogs.length);
        })
    })
    describe("Fails", () => {
        it("should response with http status 401 and messages unauthorized if fails", async () => {
            const { status, body } = await request(app)
                .get("/adminlogs")
                .set("access_token", state.invalid_access_token)
            expect(status).toBe(401);
            expect(body).toEqual({
                message: "Unauthorized"
            });
        })
    })
})
