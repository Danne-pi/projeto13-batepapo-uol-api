import { headerUserSchema, Validator } from "../validations.js";

export const PostStatus = (app)=> {
    app.post("/status", async (req, res) => {
    const user = req.headers.user.toLowerCase()

    //Header validation
    const headerValidation = Validator(headerUserSchema, {headerUser: from})
    if (headerValidation){
        res.status(422).send(headerValidation)
        return
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
        await userCollection.update({}, { name, lastStatus: Date.now() })
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
    });
}
