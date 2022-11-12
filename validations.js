import joi from "joi";
import { userCollection } from "./index.js";

export const userSchema = joi.object({
    user: joi.string().min(3).required()
  });

export async function Refresh(){
    const timeNow = Date.now()
    const resp = userCollection.find({})
    await resp.forEach((user) => {
      const timeOnline = timeNow - user.lastStatus
      if(timeOnline > 10000) {
        userCollection.deleteOne({_id: user._id})
      }
    })
}