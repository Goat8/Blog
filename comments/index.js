const express= require('express');
const {randomBytes}= require('crypto')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId  = {
};

app.get('/post/:id/comments',(req, res)=>{
    const {id: postId} = req.params;

    res.send(commentsByPostId[postId] || [])
});
app.post('/post/:id/comments',async (req, res)=>{
    try{
        const commentId = randomBytes(4).toString('hex'); //hex decimal string;
        const {content} = req.body;
        const {id: postId} = req.params;
        const comments = commentsByPostId[postId] || []
        comments.push({
            id:commentId,
            content
        })
        
        commentsByPostId[postId] = comments;
        await axios.post("http://localhost:4005/events", {
            type: "CommentCreated",
            data:{
                postId,
                id:commentId,
                content
            }
        })
        console.log("vroooooosd");
        res.status(201).send(comments)
    }
    catch(e){
        console.log("waht si e",e);
    }

});

app.post("/events", (req, res)=>{
    console.log("Receieved Event", req.body.type);

    res.send({})
})


app.listen(4001, ()=>{
    console.log("listening on Port 4001.")
})