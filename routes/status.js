import { userCollection } from "../index.js";
import { headerUserSchema, Validator } from "../validations.js";

export const PostStatus = (app)=> {
    app.post("/status", async (req, res) => {
    let user = req.headers.user

    //Header validation
    const headerValidation = Validator(headerUserSchema, {headerUser: user})
    if (headerValidation){
        res.status(422).send(headerValidation)
        return
    } else {
        user = user.toLowerCase()
    }

    //Check for user status
    try {
        const resp = await userCollection.findOne({name: user})
        if(!resp){
            res.sendStatus(404)
            return
        }
    } catch (error) {
        console.log(error)
    }

    //insertion
    try {
        await userCollection.updateOne({name: user}, {$set: {lastStatus: Date.now()}})
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
    });
}