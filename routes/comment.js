const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");

router.get("/comments", (req, res) =>{
    Comment.find().populate("post", "_id title").then((comments) => {
        res.json({ comments });
    }).catch(err => {
        console.log(err);
    })
});

//Get comments of post
router.get("/comments/post/:postId", (req, res) =>{
    Comment.find({ post: { _id: req.params.postId } }).populate("post", "_id title").then((comments) => {
        res.json({ comments });
    }).catch(err => {
        console.log(err);
    })
});

//Get number of comments by post
router.get("/comments-num/post/:postId", (req, res) =>{
    Comment.count({ post: { _id: req.params.postId } }).populate("post", "_id title").then((comments) => {
        res.json({ comments });
    }).catch(err => {
        console.log(err);
    })
});

router.get("/comment-num", (req, res) =>{
    Comment.count({}).then((comments) => {
        res.json({ comments });
    }).catch(err => {
        console.log(err);
    })
});

router.post("/new-comment", (req, res) => {
    const {body, post} = req.body;

    if(!body || !post ){
        res.json({ err:"All Fields are Required" });
    }

    Post.findOne({ _id:post.id }).then((pst) => {
        const comment = new Comment({
            body,
            post: pst,
        });

        comment.save().then(()=>{
            res.json({message:"Comment Created"});
        }).catch((err)=>{
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
});

module.exports = router;