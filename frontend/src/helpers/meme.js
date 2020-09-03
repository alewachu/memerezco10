export async function commentMeme(meme, comment,user) {
  const data = {
    meme:meme._id,
    comment,
    user
  };
 return fetch("/api/v1/comments", {
    method: "POST",
    body: JSON.stringify(data),
  })
    
}
