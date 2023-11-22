import React from 'react';
import PostCreate  from './PostCreate';
import PostList  from './PostList';
export default ()=>{
    return <div className='container'>
        <h1>
            Create Post
        </h1>
        <div>
        <PostCreate/>
        </div>
        <hr/>
        <h1>Post</h1>
        <PostList/>
    </div>
}