import express,{Express} from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app:Express = express();

app.use(express.json());
app.use(cors({
    origin:process.env.CORS_ORIGIN,
}));

app.get("/",(req,res)=>{
    res.status(200).json({status:"Titamonix: Shattered Core - Server running..."});
})

export default app;