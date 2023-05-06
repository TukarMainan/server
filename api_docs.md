# TukarMainan API Documentation

## Endpoints

List of Available Endpoints:

No Authentication and Authorization

-   `POST /auth/users/login`
-   `POST /auth/users/register`
-   `POST /auth/admins/login`
-   `POST /auth/admins/register`

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
        "access_token": String
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
        "access_token": String
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
      "access_token": < jwt_token: String >
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
