import { post } from "./service";
export const commentMeme = async (meme, message) => {
  const comment = {
    meme: meme.id,
    comment: message,
  };
  const { data: newComment } = await post(`/api/v1/comments`, comment);
  const memeWithCommentsUpdate = {
    ...meme,
    allComments: [...meme.allComments, newComment],
    comments: meme.comments + 1,
  };

  return memeWithCommentsUpdate;
};
