import { userCollection } from "../index.js";
import { userSchema, Validator } from "../validations.js";


export const PostParticipants = (app)=> {
    app.post("/participants", async (req, res) => {
    let name = req.body.name.toLowerCase()

    //Requisition validation
    const validation = Validator(userSchema, {name})
    if (validation){
        res.status(422).send(validation)
        return
    }

    //Case name already exists
    try {
        const resp = await userCollection.findOne({name})
        if(resp){
            res.status(409).send("Nome atualmente em uso")
            return
        }
    } catch (error) {
        console.log(error)
    }

    //insertion
    try {
        await userCollection.insertOne({ name, lastStatus: Date.now() })
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
    });
}



export const GetParticipants = (app)=> {
    app.get("/participants", async (req, res) => {
        const resp = userCollection.find({})
        let list = []
        await resp.forEach((user) => {
            list.push(user)
        })
        res.send(list)
    });
}