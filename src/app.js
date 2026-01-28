// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// const app=express();

// app.use(cors({
//     origin:process.env.CORS_ORIGIN,
//     credentials:true
// }))

// app.use(express.json({limit:"12kb"}))
// app.use(express.urlencoded({extended:true}))
// app.use(express.static("public"))
// app.use(cookieParser())

// app.use((req, res, next) => {
//   console.log("👉 REQUEST HIT:", req.method, req.url);
//   next();
// });



// import userRouter from "./routes/user.routes.js"

// app.use("/api/v1/users",userRouter)

// export  {app}


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();

 app.use(cors({
    origin:process.env.CORS_ORIGIN,
   credentials:true
 }))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

app.use((req, res, next) => {
  console.log("👉 REQUEST HIT:", req.method, req.url);
  next();
});



app.use("/api/v1/users", userRouter);

export { app };

