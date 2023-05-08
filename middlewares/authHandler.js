const { verifyToken } = require("../helpers");
const { User, Admin, Post } = require("../models");

const authenticationUser = async (req, res, next) => {
    try {
        const { access_token } = req.headers;
        if (!access_token) throw { name: "Unauthorized" };

        const { id: UserId } = verifyToken(access_token);
        const user = await User.findByPk(UserId);
        if (!user) throw { name: "Unauthorized" };

        req.user = {
            id: user.id
        }

        next();
    } catch (error) {
        error.ERROR_FROM_FUNCTION = "Middlewares: authenticationUser";
        next(error);
    }
}

const authenticationAdmin = async (req, res, next) => {
    try {
        const { access_token } = req.headers;
        if (!access_token) throw { name: "Unauthorized" };

        console.log(access_token);
        const { id: AdminId } = verifyToken(access_token);
        const admin = await Admin.findByPk(AdminId);
        if (!admin) throw { name: "Unauthorized" };

        req.admin = {
            id: admin.id
        }

        next();
    } catch (error) {
        error.ERROR_FROM_FUNCTION = "Middlewares: authenticationAdmin";
        next(error);
    }
}

const authorizeUserPost = async (req, res, next) => {
    try {
        const { id: UserId } = req.user;
        const { id: PostId } = req.params;
        if (!UserId) throw { name: "Unauthorized" };
        if (!PostId) throw { name: "BadRequest" };

        const user = await User.findByPk(UserId);
        if (!user) throw { name: "Unauthorized" };

        const post = await Post.findByPk(PostId);
        if (!post) throw { name: "PostNotFound" };

        if (user.id !== post.UserId) throw { name: "Forbidden" };

        next();
    } catch (error) {
        error.ERROR_FROM_FUNCTION = "Middlewares: authorizeUserPost";
        next(error);
    }
}

const authorizeUser = async (req, res, next) => {
    try {
        const { id: UserIdToken } = req.user;
        const { id: UserIdParams } = req.params;
        if (!UserIdToken) throw { name: "Unauthorized" };
        if (!UserIdParams) throw { name: "BadRequest" };

        if (UserIdToken !== UserIdParams) throw { name: "Forbidden" };

        next();
    } catch (error) {
        error.ERROR_FROM_FUNCTION = "Middlewares: authorizeUser";
        next(error);
    }
}

module.exports = {
    authenticationAdmin,
    authenticationUser,
    authorizeUserPost,
    authorizeUser,
}