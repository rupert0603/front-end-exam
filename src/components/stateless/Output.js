import React from "react";

function Output(props) {
  const { value, id } = props;

  return <input type="text" id={id} value={value} readOnly></input>;
}

export default Output;
