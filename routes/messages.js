import dayjs from "dayjs";
import { messageCollection, userCollection } from "../index.js";
import { headerUserSchema, messageSchema, Validator } from "../validations.js";


export const PostMessages = (app)=> {
    app.post("/messages", async (req, res) => {
    const { to, text, type } = req.body;
    const from = req.headers.user.toLowerCase()

    //Header validation
    const headerValidation = Validator(headerUserSchema, {headerUser: from})
    if (headerValidation){
        res.status(422).send(headerValidation)
        return
    }

    
    //Requisition validation
    const validation = Validator(messageSchema, { to, text, type })
    if (validation){
        res.status(422).send(validation)
        return
    }


    //Check user online status
    try {
        const resp = await userCollection.findOne({name: from})
        if(!resp){
            res.status(409).send("this account is currently offline!")
            return
        }
    } catch (error) {
        console.log(error)
    }

    //insertion
    try {
        await messageCollection.insertOne({
            from,
            to: to.toLowerCase(),
            text,
            type,
            time: dayjs().format("hh:mm:ss") 
        })
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
  });
}



export const GetMessages = (app)=> {
    app.get("/messages", async (req, res) => {
        const limit = Number(req.query.limit)
        let user = req.headers.user

        //Header validation
        const headerValidation = Validator(headerUserSchema, {headerUser: user})
        if (headerValidation){
            res.status(422).send(headerValidation)
            return
        } else {
            user = user.toLowerCase()
        }


        let resp
        let list = []
        if(limit){
            resp = messageCollection.find({$or: [
                {from: user},
                {to: user},
                {type: "message"}
            ]})
            .limit(limit)
            .sort({_id:-1});
        } else{
            resp = messageCollection.find({$or: [
                {from: user},
                {to: user},
                {type: "message"}
            ]})
            .sort({_id:-1});
        }
        
        await resp.forEach((user) => {
            list.push(user)
        })
        res.send(list)
    });
}