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
        case "SequelizeDatabaseError":
            status = 400;
            message = err.message;
            break;
        case "BadRequest":
            status = 400;
            message = `Input is required`;
            break;
        case "MulterError":
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                status = 400;
                message = `Maximum 5 images upload`;
            }
            break;
        // case "ImageLimitExceed":
        //     status = 400;
        //     message = `Exceeded the image upload limit`;
        //     break;
        case "InactiveEmail":
            status = 400;
            message = `Email is not active`;
            break;
        case "JsonWebTokenError":
        case "InvalidToken":
        case "Unauthorized":
            status = 401;
            message = `Unauthorized`;
            break;
        case "UserSuspended":
            status = 401;
            message = `Your account is Suspended`;
            break;
        case "Forbidden":
            status = 403;
            message = `Forbidden access`;
            break;
        case "MeetingPointNotFound":
            status = 404;
            message = `Meeting point not found`;
            break;
        case "PostNotFound":
            status = 404;
            message = `Post not found`;
            break;
        case "UserNotFound":
            status = 404;
            message = `User not found`;
            break;
        case "TradeNotFound":
            status = 404;
            message = `Trade not found`;
            break;
        case "CategoryNotFound":
            // console.log("MAAAAAAAAAAASUUUUUUUUUUUUUUUUUUUKKKKKKKKKKKKKKKKK");
            status = 404;
            message = `Category not found`;
            break;
        case "NodeMailerError":
            status = 500;
            message = `Nodemailer error`;
            break;
        case "ImageKitServerError":
            status = 500;
            message = `Imagekit error`;
            break;
    }

    res.status(status).json({ message });
}