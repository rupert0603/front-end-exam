import React, { useContext } from "react";
import CalculatorButtonClassContext from "../../contexts/CalculatorButtonClassContext";

function Button(props) {
  const { label, onClick, value, className } = props;

  const calculatorButtonClassName = useContext(CalculatorButtonClassContext);

  return (
    <button
      className={
        className
          ? `${className} ${calculatorButtonClassName}`
          : calculatorButtonClassName
      }
      onClick={onClick}
      value={value}
    >
      {label}
    </button>
  );
}

export default Button;
