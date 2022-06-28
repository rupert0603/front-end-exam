import { createContext } from "react";

const CalculatorButtonClassContext = createContext("calculator-btn");

export const CalculatorButtonClassProvider =
  CalculatorButtonClassContext.Provider;
export default CalculatorButtonClassContext;
