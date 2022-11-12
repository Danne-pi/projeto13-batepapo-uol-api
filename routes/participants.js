import { userCollection } from "../index.js";


export const PostParticipants = (app)=> {
    app.post("/participants", async (req, res) => {
    const { user } = req.body;
    const resp = await userCollection.findOne({user})
    if(resp){
        res.status(409).send("Nome atualmente em uso")
        return
    }
        
    try {
        await userCollection.insertOne({ user })
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
    });
}

export const GetParticipants = (app)=> {
    
}