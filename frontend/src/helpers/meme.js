import Axios from "axios";
export async function commentMeme(meme, message,token) {
  const comment = {
    meme:{
      _id:meme._id
    },
    comment:message
  };
 
  const {data:newComment} = await Axios.post(`http://localhost:3001/api/v1/comments`,comment,{
    headers: {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${token}`
    }
  });
  const memeWithCommentsUpdate={
    ...meme,
    allComments:[...meme.allComments,newComment.data],
    comments:meme.comments+1
  }

  return memeWithCommentsUpdate;
  

    
}
