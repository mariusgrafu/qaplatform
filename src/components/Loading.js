import React from "react";

import "./Loading.scss";

import loadingPng from "../assets/loading.png";

export default function Loading({ size = 50 }) {
  return (
    <img
      className="Loading"
      src={loadingPng}
      width={size}
      height={size}
      alt="Loading..."
      draggable="false"
      loading="lazy"
    />
  );
}
