import React from "react";

function Output(props) {
  const { text } = props;

  return <div className="output">{text}</div>;
}

export default Output;
