import React from "react";

import Avatar from "./Avatar";
import Badge from "./Badge";

import "./User.scss";

export default function User({ user, avatarSize = 30 }) {
  return (
    <span className="User blur-avt-trigger">
      <Avatar displayName={user.displayName} size={avatarSize} />
      &nbsp;{user.displayName}
      {user.badge ? <Badge badgeId={user.badge} /> : null}
    </span>
  );
}
