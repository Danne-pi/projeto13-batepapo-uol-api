import dayjs from "dayjs";
import joi from "joi";
import { messageCollection, userCollection } from "./index.js";


export function Validator(validationSchema, requestObject){
  const validation = validationSchema.validate(requestObject, { abortEarly: false });
  if (validation.error) {
      let erros
      validation.error.details.forEach((detail) => {erros += detail.message+"\n"});
      return erros
  }
}


export const userSchema = joi.object({
  name: joi.string().min(3).required().alphanum()
});

export const headerUserSchema = joi.object({
  headerUser: joi.string().min(3).required().alphanum()
})


export const messageSchema = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.string().required().custom((value, helper) => {
    if (value === "message" || value === "private_message") {
      return true
    } else {
      return helper.message("The field 'type' must be equal to 'message' or 'private_message' only!")
    }
}),
});

export async function Refresh(timeout){
    const timeNow = Date.now()
    const resp = userCollection.find({})
    resp.forEach( async (user) => {
      const timeOnline = timeNow - user.lastStatus
      if(timeOnline > timeout) {
        userCollection.deleteOne({_id: user._id})
        const msg = {
          from: user.name,
          to: "Todos",
          text: "saiu da sala...",
          type: 'status',
          time: dayjs().format("hh:mm:ss")
        }
        try {
          await messageCollection.insertOne(msg)
      } catch (error) {
        console.log(error)
      }
      }
    })
}