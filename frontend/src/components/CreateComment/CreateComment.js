import React, { useState } from "react";

export default function CreateComment({ onSubmitComment,show }) {
  const [message, setMessage] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    alert("enviando comentario");
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
