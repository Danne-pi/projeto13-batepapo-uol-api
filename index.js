import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import { GetParticipants, PostParticipants } from "./routes/participants.js";
import { Refresh } from "./validations.js";
import { GetMessages, PostMessages } from "./routes/messages.js";
import { PostStatus } from "./routes/status.js";


//Basic Config
dotenv.config();
const app = express()
app.use(cors())
app.use(express.json());

//MongoDB
const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
    mongoClient.connect()
} catch (error) {
    console.log(error)
}
const db = mongoClient.db("chatUol");
export const userCollection = db.collection("users");
export const messageCollection = db.collection("messages")

//Routes
PostParticipants(app)
GetParticipants(app)
PostMessages(app)
GetMessages(app)
PostStatus(app)

//Logout Refresh
setInterval(() => {
    Refresh(process.env.LOGOUT_TIME)
}, process.env.REFRESH_TIME);

app.listen(process.env.EXPRESS_PORT, ()=>{
    console.log('Running on http://localhost:'+process.env.EXPRESS_PORT)
})