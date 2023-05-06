module.exports = (err, req, res, next) => {
    console.log(err);

    let status = 500;
    let message = "Internal Server Error";

    switch (err.name) {
        case "SequelizeForeignKeyConstraintError":
            status = 409;
            message = err.parent.detail;
            break;
        case "AggregateError":
        case "SequelizeUniqueConstraintError":
        case "SequelizeValidationError":
            status = 400;
            message = err.errors[0].message;
            break;
        case "BadRequest":
            status = 400;
            message = `Input is required`;
            break;
        case "JsonWebTokenError":
        case "InvalidToken":
        case "Unauthorized":
            status = 401;
            message = `Unauthorized`;
            break;
        case "Forbidden":
            status = 403;
            message = `Forbidden access`;
            break;
        case "PostNotFound":
            status = 404;
            message = `Post not found`;
            break;
    }

    res.status(status).json({ message });
}