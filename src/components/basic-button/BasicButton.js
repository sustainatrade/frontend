import React, { useState, useCallback } from "react";
import { Icon } from "semantic-ui-react";
import "./BasicButton.css";

export default function BasicButton({ content, floated, onClick, ...rest }) {
  const [hovered, setHovered] = useState(false);
  const style = {
    color: `rgba(0,0,0,${hovered ? 0.6 : 0.4})`
  };
  floated && (style.float = floated);
  return (
    <span
      className="uph-basic-btn"
      onMouseEnter={useCallback(() => setHovered(true))}
      onMouseLeave={useCallback(() => setHovered(false))}
      style={style}
      onClick={onClick}
    >
      <Icon {...rest} link />
      {content}
    </span>
  );
}
