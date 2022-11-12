import joi from "joi";
import { userCollection } from "./index.js";

export const userSchema = joi.object({
  user: joi.string().min(3).required()
});

export async function Refresh(timeout){
    const timeNow = Date.now()
    const resp = userCollection.find({})
    await resp.forEach((user) => {
      const timeOnline = timeNow - user.lastStatus
      if(timeOnline > timeout) {
        userCollection.deleteOne({_id: user._id})
      }
    })
}