import React from "react";

function Button(props) {
  const { label, onClick, value, className } = props;

  return (
    <button className={className} onClick={onClick} value={value}>
      {label}
    </button>
  );
}

export default Button;
