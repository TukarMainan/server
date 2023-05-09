const { Review, User, Post } = require("../models");
const { validate: uuidValidate } = require('uuid');

class ReviewController {
    static async create(req, res, next) {
        try {
            const { id: SenderId } = req.user;
            const { UserId, message, rating, PostId } = req.body;

            if (!uuidValidate(UserId)) throw { name: "UserNotFound" };
            if (!uuidValidate(PostId)) throw { name: "PostNotFound" };

            const user = await User.findByPk(UserId);
            if (!user) throw { name: "UserNotFound" };
            if (user.status === "suspend") throw { name: "Forbidden" };

            const post = await Post.findByPk(PostId);
            if (!post) throw { name: "PostNotFound" };
            if (post.status === "archive") throw { name: "Forbidden" };
            if (UserId !== post.UserId) throw { name: "Forbidden" };

            const newReview = await Review.create({
                UserId,
                SenderId,
                message,
                rating,
                PostId
            });

            user.ratings = user.ratings ? [...user.ratings, newReview.rating] : [rating];
            await user.save();

            res.status(201).json({ message: "Review successfully created" });
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "ReviewController: create";
            next(err);
        }
    }
}

module.exports = ReviewController;
