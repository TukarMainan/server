# TukarMainan API Documentation

## Endpoints

List of Available Endpoints:

### Admin CMS Endpoints

-   `PATCH /admins/update-password` ✔
-   `GET /users` ✔
-   `PATCH /users/:id` ❌
-   `PATCH /posts/:id` ❌
-   `GET /reports` ❌
-   `GET /adminlogs` ❌
-   `POST /categories` ❌
-   `PATCH /categories/:id` ❌

### Authorize User Endpoints

-   `PATCH /users/update-password` ✔
-   `PUT /users/:id` ❌
-   `POST /posts` ❌
-   `PUT /posts/:id` ❌
-   `PATCH /posts/:id` ❌
-   `GET /notifications` ❌
-   `GET /chats` ❌
-   `POST /chats` ❌
-   `GET /messages` ❌
-   `POST /messages` ❌
-   `POST /comments` ❌
-   `POST /reports` ❌

### Public Endpoints

-   `POST /admins/login` ✔
-   `POST /admins/register` ✔
-   `POST /users/login` ✔
-   `POST /users/login/google` ❌
-   `POST /users/register` ✔
-   `GET /public/users/:id` ✔
-   `GET /public/posts` ❌
-   `GET /public/posts/:id` ❌
-   `GET /public/posts/recommendations` ❌
-   `GET /public/categories` ❌
-   `GET /public/categories/:id` ❌

### POST /auth/users/login

#### Description

-   Verify an user then give jwt_token

#### Request

-   Body
    ```json
    {
        "username": < username: String > || < email: String >,
        "password": String
    }
    ```

#### Response

_200 - OK_

-   Body
    ```json
    {
        "access_token": String,
        "id": UUID,
        "username": String,
        "email": String
    }
    ```

_400 - Bad Request_

-   Body
    ```json
    {
        "message": "Input is required"
    }
    ```

_401 - Unauthorized_

-   Body
    ```json
    {
        "message": "Unauthorized"
    }
    ```

### POST /auth/users/register

#### Description

-   Create new user account

#### Request

-   Body
    ```json
    {
        "username": String,
        "email": String,
        "password": String,
        "city": String
    }
    ```

#### Response

_201 - Created_

-   Body
    ```json
    {
        "message": String
    }
    ```

_400 - Bad Request_

-   Body
    ```json
    {
        "message": < sequelize_validation_error: String >
    }
    ```

_409 - Conflict_

-   Body
    ```json
    {
        "message": < sequelize_validation_error: String >
    }
    ```

### POST /auth/users/updatePassword

#### Description

-   Update an existing user password

#### Request

-   Headers
    ```json
    {
      "access_token": < user_jwt_token: String >
    }
    ```
-   Body
    ```json
    {
        "newPassword": String,
        "oldPassword": String
    }
    ```

#### Response

_200 - OK_

-   Body
    ```json
    {
        "message": String
    }
    ```

_400 - Bad Request_

-   Body
    ```json
    {
        "message": < sequelize_validation_error: String >
    }
    ```

_401 - Unauthorized_

-   Body
    ```json
    {
        "message": "Unauthorized"
    }
    ```

_404 - NotFound_

-   Body
    ```json
    {
        "message": String
    }
    ```

### POST /auth/admins/login

#### Description

-   Verify an admin then give jwt_token

#### Request

-   Body
    ```json
    {
        "username": < username: String > || < email: String >,
        "password": String
    }
    ```

#### Response

_200 - OK_

-   Body
    ```json
    {
        "access_token": String,
        "id": UUID,
        "username": String,
        "email": String
    }
    ```

_400 - Bad Request_

-   Body
    ```json
    {
        "message": "Input is required"
    }
    ```

_401 - Unauthorized_

-   Body
    ```json
    {
        "message": "Unauthorized"
    }
    ```

### POST /auth/admins/register

#### Description

-   Create new admin account

#### Request

-   Headers
    ```json
    {
      "access_token": < admin_jwt_token: String >
    }
    ```
-   Body
    ```json
    {
        "username": String,
        "email": String,
        "password": String
    }
    ```

#### Response

_201 - Created_

-   Body
    ```json
    {
        "message": String
    }
    ```

_400 - Bad Request_

-   Body
    ```json
    {
        "message": < sequelize_validation_error: String >
    }
    ```

_409 - Conflict_

-   Body
    ```json
    {
        "message": < sequelize_validation_error: String >
    }
    ```

### POST /auth/admins/updatePassword

#### Description

-   Update an existing admin password

#### Request

-   Headers
    ```json
    {
      "access_token": < admin_jwt_token: String >
    }
    ```
-   Body
    ```json
    {
        "newPassword": String,
        "oldPassword": String
    }
    ```

#### Response

_200 - OK_

-   Body
    ```json
    {
        "message": String
    }
    ```

_400 - Bad Request_

-   Body
    ```json
    {
        "message": < sequelize_validation_error: String >
    }
    ```

_401 - Unauthorized_

-   Body
    ```json
    {
        "message": "Unauthorized"
    }
    ```

_404 - NotFound_

-   Body
    ```json
    {
        "message": String
    }
    ```

### GET /users

#### Description

-   Get all users

#### Request

-   Headers
    ```json
    {
      "access_token": < admin_jwt_token: String >
    }
    ```

#### Response

_200 - OK_

-   Body
    ```json
    [
        {
            "id": UUID,
            "email": String,
            "username": String,
            "profileImg": String,
            "name": String,
            "notes": String,
            "phoneNumber": String,
            "status": Enum(["unverified", "verified", "suspend", "premium"]),
            "city": String,
            "ratings": Integer,
            "warningCount": Integer,
            "createdAt": Date,
            "updatedAt": Date
        },
        ...
    ]
    ```

### GET /public/users/:id

#### Description

-   Get an user profile data based on given id

#### Request

#### Response

_200 - OK_

-   Body

    ```json
    [
        {
            "id": UUID,
            "email": String,
            "username": String,
            "profileImg": String,
            "name": String,
            "notes": String,
            "phoneNumber": String,
            "status": Enum(["unverified", "verified", "suspend", "premium"]),
            "city": String,
            "ratings": Integer,
            "createdAt": Date,
            "updatedAt": Date,
            "Posts": [
                {
                    "id": UUID,
                    "title": String,
                    "condition": Enum(["brand new", "like new", "lightly used", "well used", "heavily used"]),
                    "status": Enum(["active", "inactive", "complete", "suspend"]),
                    "images": [ String ],
                    "price": Integer,
                    "createdAt": Date,
                    "updatedAt": Date,
                    "Category": {
                        "id": UUID,
                        "name": String
                    }
                },
                ...
            ],
            "Reviews": [
                {
                    "id": UUID,
                    "message": String,
                    "createdAt": Date,
                    "updatedAt": Date,
                    "Sender": {
                        "id": UUID,
                        "username": String,
                        "profileImg": String
                    }
                },
                ...
            ]
        },
        ...
    ]
    ```

### Middlewares Authentication and Authorization Error

#### Response

_401 - Unauthorized_

-   Body
    ```json
    {
        "message": "Unauthorized"
    }
    ```

_403 - Forbidden_

-   Body
    ```json
    {
        "message": "Forbidden access"
    }
    ```

### Global Error

#### Response

_500 - Internal Server Error_

-   Body
    ```json
    {
        "message": "Internal Server Error"
    }
    ```
