import React, { useState } from "react";

export default function CreateComment({ onSubmitComment,show }) {
  const [message, setMessage] = useState("");
  const [sendingComment,setSendingComment] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if(sendingComment){
      return;
    }

    try{
      setSendingComment(true);
      await onSubmitComment(message);
      setMessage('');
      setSendingComment(false);

    }
    catch(error){
      setSendingComment(false);

    }
  }

  return (
    <>
      {show && (
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un comentario..."
            value={message}
            required
          ></input>
          <button type="submit">Comentar</button>
        </form>
      )}
    </>
  );
}
