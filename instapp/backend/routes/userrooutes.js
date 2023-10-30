const express = require("express")
const { UserModel } = require("../model/usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { auth } = require("../middleware/authmiddleware")
const { BlacklistModel } = require("../model/balcklistmodel")
const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    const { name, email, gender, password, age, city, is_married } = req.body

    try {
        const existinguser = await UserModel.find({ email })
        if (existinguser.length > 0) {
            return res.status(400).json({ msg: "user is already registered . please login!" })
        }
        const hash = await bcrypt.hash(password, 5)
        const user = new UserModel({ name, email, gender, password: hash, age, city, is_married })

        await user.save()
        res.status(200).json({ msg: "user is regustered", user: user })
    } catch (error) {
        res.status(400).json(error)
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
    
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ userId: user._id, username: user.name }, "masai", { expiresIn: "7d" })
                    res.status(200).json({ msg: "user is logged n",token })

                }else{
                    res.status(400).json({msg:"wrong details"})
                }
            })
        }
    } catch (error) {
res.status(400).json({msg:"something went wrong"})
    }
})

userRouter.get("/logout",async(req,res)=>{
    const token=req.headers.authorization

    try {
        if(token){
const black=new BlacklistModel({token})
await black.save()
res.status(200).json({msg:"user is logged out"})
        }else{
            res.status(400).json({msg:"first login"})
        }
    } catch (error) {
        
    }
})

module.exports = {
    userRouter
}