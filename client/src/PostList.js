import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default ()=>{
    const [posts, setPosts]= useState({});
    const fetchPosts = async ()=>{
        const res = await axios.get('http://posts.com/posts');
        setPosts(res.data)
    }

    useEffect(()=>{
        fetchPosts()
    }, [])
    const renderedPosts = Object.values(posts).map(post=>{
        return <div className='card' sytle={{width:'30%', marginBotton:'20px'}}>
                <div className='card-body'>
                    <h3>{post.title}</h3>
                    <CommentList postId={post.id} comments={post.comments}/>
                    <CommentCreate postId={post.id}/>
                </div>
                
        </div>
    })
    return <div className='d-flex flow-row flex-wrap justify-content-between'>{ renderedPosts}</div>
}