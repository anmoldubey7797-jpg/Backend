import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import connectCloudinary from "./utils/cloudinary.js";

dotenv.config({ path: "./.env" });

connectDB()
.then(async () => {

    await connectCloudinary();  

    app.listen(process.env.PORT || 6000, () => {
        console.log(`Server running on ${process.env.PORT || 6000}`);
    });

})
.catch((err) => {
    console.log(" MongoDB error", err);
});