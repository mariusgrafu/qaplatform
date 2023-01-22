import React, { useEffect, useState } from "react";
import BadgesSingleton from "../BadgesSingleton";

export default function Badge({ badgeId, size = 30 }) {
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const badgesSingletonInstance = BadgesSingleton.getInstance();
    const onReady = () => {
      setLoading(false);
      setBadge(badgesSingletonInstance.getBadgeById(badgeId));
    };

    badgesSingletonInstance.onReady(onReady);

    return () => badgesSingletonInstance.removeListener(onReady);
  }, [badgeId]);

  if (!badge || loading) {
    return null;
  }

  return (
    <div className="Badge" title={badge.title}>
      <img
        src={badge.image}
        alt={badge.title}
        width={size}
        height={size}
        draggable={false}
      />
    </div>
  );
}
