const jwt = require("jsonwebtoken")
const { BlacklistModel } = require("../model/balcklistmodel")

const auth = async(req, res, next) => {
    const token = req.headers.authorization
const tokenispresent=await BlacklistModel.findOne({token})
    if (!tokenispresent) {


        jwt.verify(token, "masai", (err, decoded) => {
            if (err) {
                return res.send(err)
            }
            if (decoded) {
                // console.log(decoded)
                req.body.userId = decoded.userId
                req.body.username = decoded.username
                next()
            }
        })
    } else {
        res.status(400).json({ msg: "you are not authorised" })
    }
}



module.exports={
    auth
}