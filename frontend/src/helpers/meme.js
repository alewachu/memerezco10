import { post,get } from "./service";
export const commentMeme = async (meme, message) => {
  const entryComment = {
    meme: meme.id,
    comment:message
  };
  const { data: newComment } = await post(`/api/v1/comments`, entryComment);
  const memeWithCommentsUpdate = {
    ...meme,
    allComments: [...meme.allComments, newComment],
    comments: meme.comments + 1,
  };

  return memeWithCommentsUpdate;
};

export const commentParent = async (meme,message,parent) =>{
  const comment = {
    meme: meme.id,
    comment: message,
    parent:parent
  };
  const { data: newComment } = await post(`/api/v1/comments`, comment);
  if(newComment){
    const updatedMeme= await getMemeApi(meme.id);
    return updatedMeme;
  }
  return null;

}

export const getMemeApi=async(memeId)=>{
  const response = await get(`/api/v1/memes/${memeId}`);
   return response.data;
  

}

/*function searchCommentFather(meme,id){
 const commentFather= meme.allComments.find(c=>c.id==id);
 return commentFather;

}*/
