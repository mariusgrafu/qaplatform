import React from "react";

import "./Logo.scss";
import logoPngV1 from "../assets/logo.png";
import logoPngV2 from "../assets/logo-2.png";

export default function Logo({ size = 50, variant = "v1" }) {
  return (
    <img
      className="Logo"
      src={variant === "v1" ? logoPngV1 : logoPngV2}
      height={size}
      alt="QA Platform Logo"
      draggable="false"
      loading="lazy"
    />
  );
}
