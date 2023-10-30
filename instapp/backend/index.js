const express=require("express")
const { connection } = require("./database")
const { userRouter } = require("./routes/userrooutes")
const { postRouter } = require("./routes/postroutes")


const app=express()

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hell")
})

app.use("/users",userRouter)
app.use("/posts",postRouter)
app.listen(3000,async()=>{
try {
    await connection
    console.log("database is connected ")
    console.log("server is runnug")
} catch (error) {
    console.log(error)
}
})


// {

//     "title":"hgyg",
//     "body":"guyg",
//     "device":"mobile",
//     "no_of_comments":7
//     }