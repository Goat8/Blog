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
            content,
            status:'pending'
        })
        commentsByPostId[postId] = comments;

        await axios.post("http://event-bus-srv:4005/events", {
            type: "CommentCreated",
            data:{
                postId,
                id:commentId,
                content,
                status:'pending'
            }
        })
        res.status(201).send(comments)
    }
    catch(e){
        console.log("waht si e",e);
    }

});

app.post("/events", async(req, res)=>{
    try{

    
    console.log("Receieved Event", req.body.type);
    const { type, data } = req.body;
    if(type === 'CommentModerated'){
        const {postId, id, status,content} = data;
        const comments = commentsByPostId[postId]
        const comment = comments.find(comment =>{
            return comment.id ===id
        });
        comment.status = status;
        await axios.post('http://event-bus-srv:4005/events', {
            type:'CommentUpdated',
            data:{
                id,
                status,
                postId,
                content
            }

        })

    }
    
    res.send({})
}
  catch(e) {
    res.send({status:"failde", message: e.message})

}
})


app.listen(4001, ()=>{
    console.log("listening on Port 4001.")
})