import React from "react";
import CardMeme from "../components/CardMeme/CardMeme";
export default function Home() {
  const item = [1, 2, 3, 4, 5];
  return (
    <div>
      {item.map((item) => {
        return <CardMeme key={item} />;
      })}
    </div>
  );
}
