const express=require("express")
const app=express()
const userRoute=require("./routes/user")
const courseRoute=require("./routes/course")
const paymentRoute=require("./routes/payment")
const profileRoute=require("./routes/profile")
const contactRoute=require("./routes/contact")
const dbConnect = require('./config/database');
const cookieParser=require("cookie-parser")
const cors=require("cors")  // to connect frontend and backend
const {cloudinaryConnect}=require("./config/cloudinary")
const fileUpload=require("express-fileupload")
require("dotenv").config()
const PORT=process.env.PORT || 4000;
dbConnect.connect()
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin:["http://localhost:3000","https://study-notion-project-client.vercel.app"],
        credentials:true,
    })
)
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}))

cloudinaryConnect()
app.use("/api/v1/auth",userRoute)
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/payment",paymentRoute)
app.use("/api/v1/profile",profileRoute)
app.use("/api/v1/reach",contactRoute)


app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Server is running"
    })
})

app.listen(PORT,()=>{
    console.log("Appp is running at 4000")
})