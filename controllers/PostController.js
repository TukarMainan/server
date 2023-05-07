const { Op } = require("sequelize");
const { Post,User,Chat, } = require("../models");


class PostController{

    static async getPosts(req,res,next){
        try {
            const { CategoryId, sortby,search,city } = req.query
            const options = {
            order: [],
            where: {}
            }
            if(CategoryId){
            options.where={
                ...options.where,
                CategoryId
            }
             if(sortby){
                options.order=[['createdAt', sortby]]
                }
            }
            if (search) {
            options.where = {
              ...options.where,
              title: { [Op.iLike]: `%${search}%` }
            }
            }
            if(city){
            options.where={
                ...options.where,
                city
            }
            }
            const posts = await Post.findAll(options);
            res.status(200).json(posts);
        } catch (error) {
            err.ERROR_FROM_CONTROLLER = "PostController: getPosts";
            next(err);
        }
    }

    static async getPostById(req,res,next){
        try {
          const { id } = req.params;
          const postById = await Post.findByPk(id,{
            include:[User,Category]
          });
          if (!postById) throw ({ name: "PostNotFound" });
          res.status(200).json(postById);
        } catch (err) {
          err.ERROR_FROM_CONTROLLER = "PostController: getPostById";
          next(err);
        }
      }
    
      static async postUpdateStatus(req,res,next){
        try {
          const { status } = req.body;
          const { id } = req.params;
          const findPost = await Post.findByPk(id);
          if (!findPost) throw({ name: "PostNotFound" });
          const updatedPost = await Post.update(
            {
              status
            },
            {
              where: { id },
            }
          );
          res
            .status(200)
            .json({ message: `Successfully updated status Post with id ${id}` });
        } catch (err) {
          err.ERROR_FROM_CONTROLLER = "PostController: postUpdateStatus";
          next(err);
        }
      }
    
      static async updatePost(req,res,next){
        try {
          const { title,description,condition,CategoryId,meetingPoint,images,price } = req.body;
          const { id } = req.params;
          const foundPost = await Post.findByPk(id);
          if (!foundPost) throw({ name: "PostNotFound" });
          const updatedPost = await Post.update(
            {
                title,
                description,
                condition,
                CategoryId,
                meetingPoint,
                images,
                price
            },
            {
              where: { id },
            }
          );
          res
            .status(200)
            .json({ message: `Successfully updated post` });
        } catch (err) {
          err.ERROR_FROM_CONTROLLER = "PostController: updatePost";
          next(err);
        }
      }

}
module.exports = PostController;