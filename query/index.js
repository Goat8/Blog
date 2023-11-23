const express= require('express');
const bodyParser = require('body-parser');
const axios = require('axios')


const cors = require('cors')
const app = express();
app.use(bodyParser.json())
app.use(cors())

const posts = {};
const handleEvents = (type, data)=>{
    if(type ==="PostCreated") {
        const {id, title} = data;

        posts[id] = {id, title, comments:[]}

    }
    if(type ==="CommentCreated"){
        const {id, content, postId, status} = data;
        const post = posts[postId];
        if(post)post.comments.push({id, content, status})
    }
    console.log("Posts" ,posts);
    if(type === "CommentUpdated"){
        const {id, content, postId, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment=>{
            return comment.id === id
        })
        comment.status =status;
        comment.content = content;
    }
}
app.post("/events", (req, res)=>{
    const {type, data} = req.body;
    handleEvents(type,data)
   
    res.send({})
})

app.get("/posts", (req, res)=>{
    res.send(posts)
})

app.listen(4002, async ()=>{
    console.log("Listening on 4002")
    const response = await axios.get("http://localhost:4005/events"); //all events
    for(let event of response.data){
        handleEvents(event.type, event.data)

    }

})