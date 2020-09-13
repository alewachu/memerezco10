import React from "react";
import Image404 from "../assets/404.jpg";

export default function Error404() {
  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={Image404}
        alt="Error 404 Not Found"
        style={{ maxWidth: "100%", height: "85vh" }}
      />
    </div>
  );
}
