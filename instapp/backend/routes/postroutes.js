const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { auth } = require("../middleware/authmiddleware")
const { PostModel } = require("../model/postmodel")
const postRouter = express.Router()


postRouter.post("/add", auth, async (req, res) => {
    const payload = req.body
    console.log(payload)
    try {
        const post = new PostModel(payload)
        await post.save()
        res.status(200).json({ msg: "poist is created" })

    } catch (error) {
        res.status(400).json({ error })
    }
})

postRouter.get("/", auth,async (req, res) => {
    let query = {}
    if (req.query.device) {
        query.device = req.query.device
    }
    if (req.query.device1 && req.query.device2) {
        query.device = { $in: [req.query.device1, req.query.device2] }
    }
    try {
const post=await PostModel.find({username:req.body.username,...query})
res.status(200).json({msg:post})
    } catch (error) {
res.status(400).json({error})
    }
})

postRouter.get("/top",auth,async(req,res)=>{
    const pipeline=[
        {
            $sort:{no_of_comments:-1}
        },
        {
            $limit:3
        }
    ]
    try {
       const posts=await PostModel.find({username:req.body.username}).sort({no_of_comments:-1}).limit(3)
       res.status(200).json({msg:posts})
    } catch (error) {
        res.status(400).json({error})
    }
})

postRouter.delete("/delete/:id",auth,async(req,res)=>{
    const {id}=req.params
try {
    const post=await PostModel.findById(id)
if(!post){
    return res.status(400).json({msg:"post not found"})
}
if(post.userId!==req.body.userId){
    return res.status(400).json({msg:"you are not authorised"})
}
await PostModel.findByIdAndDelete(id)
res.status(200).json({msg:"post is deleted"})
} catch (error) {
    res.status(400).json({error})
}
})
postRouter.patch("/update/:id",auth,async(req,res)=>{
    const {id}=req.params
    const {title,body,device,no_of_comments}=req.body
try {
    const post=await PostModel.findById(id)
if(!post){
    return res.status(400).json({msg:"post not found"})
}
if(post.userId!==req.body.userId){
    return res.status(400).json({msg:"you are not authorised"})
}
if(title && body && device && no_of_comments){
    post.title=title
    post.body=body,
    post.device=device,
    post.no_of_comments=no_of_comments
}
await post.save()
res.status(200).json({msg:"post is updated"})
} catch (error) {
    res.status(400).json({error})
}
})

module.exports = {
    postRouter
}