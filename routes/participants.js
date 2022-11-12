import { userCollection } from "../index.js";
import { userSchema } from "../validations.js";


export const PostParticipants = (app)=> {
    app.post("/participants", async (req, res) => {
    const { user } = req.body;
    const validation = userSchema.validate({user}, { abortEarly: true });
    if (validation.error) {
        // let erros
        // validation.error.details.map((detail) => {erros += detail.message+"\n"});
        res.status(422).send(validation.error.details[0].message)
        return
    }


    const resp = await userCollection.findOne({user})
    if(resp){
        res.status(409).send("Nome atualmente em uso")
        return
    }
        

    try {
        await userCollection.insertOne({ name: user, lastStatus: Date.now() })
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
    });
}



export const GetParticipants = (app)=> {
    
}