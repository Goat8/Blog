import React, {useState} from 'react';
import axios from 'axios';

export default ({postId}) =>{
    const [content, setContent] = useState('');
    const onSubmit = async(event)=>{
        event.preventDefault();
        const resposne = await axios.post(`http://posts.com/post/${postId}/comments`, {content})
        setContent('')
    }
    return <div>
        <form onSubmit= {onSubmit}>
            <div className='form-group'>
                    <label>New Comment</label>
                    <input className='form-control' onChange={e=>setContent(e.target.value)}/>
            </div>
            <button className='btn btn-primary  mt-2'>Submit</button>
        </form>
    </div>
}