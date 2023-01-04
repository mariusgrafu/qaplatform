import React, { useCallback } from 'react'

import './Avatar.scss';

export default function Avatar({displayName, size = 40}) {

    const getInitials = useCallback(() => displayName.split(' ').slice(0, 3).map(name => name.slice(0, 1)).join(''), [displayName]);

    const initials = getInitials();

  return (
    <div className="Avatar no-select" style={{width: `${size}px`, height: `${size}px`, fontSize: `${size * (1)/(initials.length + 1)}px`}}>{initials}</div>
  )
}
