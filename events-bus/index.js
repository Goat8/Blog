const express= require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const app = express();
app.use(bodyParser.json())
app.use(cors());
const events = []
app.post('/events', async (req, res)=>{
    try{
        const event = req.body;
        console.log("EVENT RECEIVED",event);
        events.push(event)                                          //posts-clusterip-srv
        await axios.post("http://posts-clusterip-srv:4000/events", event); //posts http://posts-clusterip-srv:4000
        await axios.post("http://comments-srv:4001/events", event); //comments
        await axios.post("http://query-srv:4002/events", event); //query (all posts and corresponding comments)
        await axios.post("http://moderation-srv:4003/events", event); //moderation service
        res.send({status:'OK'})

    }
    catch(e){
        console.log("eee", e.message)
        res.send({status:'Failed'})

    }
        
})

app.get('/events', async (req, res)=>{
    res.send(events)
})


app.listen(4005, ()=>{
    console.log("Listening on 4005")
})