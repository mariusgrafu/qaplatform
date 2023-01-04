import React from "react";

import bestAnswerPng from "../assets/bestAnswer.png";

export default function BestAnswerIcon({ size = 30, ...props }) {
  return (
    <img
      className="Best-answer"
      src={bestAnswerPng}
      width={size}
      height={size}
      alt="Best Answer"
      draggable="false"
      loading="lazy"
      {...props}
    />
  );
}
