import React, { useCallback, useState, useEffect, useMemo } from "react";
import Button from "../stateless/Button";
import Output from "../stateless/Output";
import { isNumeric } from "../../lib/casting";
import "../../styles/calculator.css";
import { CalculatorButtonClassProvider } from "../../contexts/CalculatorButtonClassContext";

function Calculator() {
  const [addend1, setAddend1] = useState("0");
  const [addend2, setAddend2] = useState("");
  const [operator, setOperator] = useState("");
  const [result, setResult] = useState("");
  const [isShowClearBtn, setIsShowClearBtn] = useState(false);

  useEffect(() => {
    //if addend1 is zero and there's no operator and addend2, it should be AC
    //if result is showing, and there are no others, show C

    if (addend1 === "0" && operator === "" && addend2 === "") {
      setIsShowClearBtn(false);
      return;
    }

    if (result && addend1 === "" && operator === "" && addend2 === "") {
      setIsShowClearBtn(true);
      return;
    }

    setIsShowClearBtn(true);
  }, [addend1, addend2, operator, result]);

  // no inputs yet
  // press a number
  // if addend1 is null, store it there
  // alternatively, if there's still no operator, store it in addend1
  //for the toggler, if an operator has already been pressed, copy the
  //addend1 and toggle its sign and put it in addend2

  const solveExpression = useCallback((operand1, operand2, operator) => {
    let solvedResult;

    switch (operator) {
      case "+":
        solvedResult = operand1 + operand2;
        break;
      case "-":
        solvedResult = operand1 - operand2;
        break;
      case "*":
        solvedResult = operand1 * operand2;
        break;
      case "/":
        solvedResult = operand1 / operand2;
        break;
      default:
        break;
    }

    return solvedResult;
  }, []);

  const handleNumberClick = useCallback(
    (value) => {
      //what if the result is shown, and the user enters a number
      if (operator) {
        if (addend2 === "0" || addend2 === "") {
          setAddend2(value);
        } else setAddend2(addend2 + value);
      } else {
        if (addend1 === "0" || addend1 === "") {
          setAddend1(value);
        } else setAddend1(addend1 + value);
      }

      return;
    },
    [addend1, addend2, operator]
  );

  const handleOperatorClick = useCallback(
    (value) => {
      //if there's already an operator, apply the existing operator to itself
      //then go straight to result,
      //then the result becomes the addend 1 and the new operator becomes the state operator

      //if result is shown, and addend is zero, and operator is clicked, set the result
      //as the addend

      //this handles the case of only one addend - what if this happened on second addend
      if (operator && addend1 !== "" && addend2 === "") {
        //can update addend2 here and use it instead as argument
        const newResult = solveExpression(
          Number(addend1),
          Number(addend1),
          operator
        );
        setResult(newResult.toString());

        //solve then use the new operator
        setOperator(value);
        setAddend1(newResult.toString());

        return;
      }

      if (operator && addend1 !== "" && addend2 !== "") {
        const newResult = solveExpression(
          Number(addend1),
          Number(addend2),
          operator
        );
        setResult(newResult.toString());

        //solve then use the new operator
        setOperator(value);
        setAddend1(newResult.toString());
        setAddend2("");

        return;
      }

      if (result && addend1 === "") {
        setOperator(value);
        setAddend1(result);
        return;
      }

      setOperator(value);
    },
    [addend1, addend2, result, operator, solveExpression]
  );

  const handleEqualsClick = useCallback(() => {
    if (result && addend1 === "") {
      return;
    }

    if (!operator && addend1 !== "") {
      setResult(addend1);
      setAddend1("");
      return;
    }

    if (addend1 !== "" && addend2 === "" && operator) {
      const newResult = solveExpression(
        Number(addend1),
        Number(addend1),
        operator
      );
      setResult(newResult.toString());
      setOperator("");
      setAddend1("");
      return;
    }

    const newResult = solveExpression(
      Number(addend1),
      Number(addend2),
      operator
    );
    setResult(newResult.toString());
    setOperator("");
    setAddend1("");
    setAddend2("");

    // if there's a result shown and equals is clicked and there's no addend(s)

    // if only one addend and equalis is clicked, return addend1 as result
    // and that bbecomes result

    // if only one addend and there's an operator and equals is clicked,
    // apply the operator to itself and that bebcomes result
  }, [addend1, addend2, operator, result, solveExpression]);

  const handleTogglePercentClick = useCallback(() => {
    if (addend2 !== "") {
      setAddend2((Number(addend2) / 100).toString());
      return;
    }

    if (result !== "" && addend1 === "") {
      setAddend1((Number(result) / 100).toString());
      return;
    }

    if (operator && addend2 !== "" && addend2 === "") {
      setAddend1((Number(addend1) / 100).toString());
      return;
    }

    setAddend1((Number(addend1) / 100).toString());

    //if addend1 is null, use the result as the addend1
    //if there is an operator, and there's no addend2, applyt it to addend1
  }, [addend1, addend2, operator, result]);

  const handleToggleSignClick = useCallback(() => {
    if (addend2 !== "") {
      setAddend2((Number(addend2) * -1).toString());
      return;
    }

    if (result !== "" && addend1 === "") {
      setAddend1((Number(result) * -1).toString());
      return;
    }

    if (operator && addend2 !== "" && addend2 === "") {
      setAddend1((Number(addend1) * -1).toString());
      return;
    }

    setAddend1((Number(addend1) * -1).toString());
    //if addend1 is null, use the result as the addend1
    //if there is an operator, and there's no addend2, applyt it to addend1
  }, [addend1, addend2, operator, result]);

  const handleClearClick = useCallback(() => {
    if (addend2 !== "") {
      setAddend2("0");
    } else {
      setAddend1("0");
    }

    setIsShowClearBtn(false);

    // doesn't clear the operator
    // set to zero if addend is not null
  }, [addend2]);

  const handleClearAllClick = useCallback(() => {
    setAddend1("0");
    setAddend2("");
    setOperator("");
    setResult("");
  }, []);

  const handleDecimalPointClick = useCallback(() => {
    if (result !== "" && addend1 === "") {
      if (result.includes(".")) return;
      setAddend1(result + ".");
      return;
    }

    if (operator) {
      if (addend2.includes(".")) return;
      setAddend2(addend2 + ".");
    } else {
      if (addend1.includes(".")) return;
      setAddend1(addend1 + ".");
    }
  }, [addend1, addend2, result, operator]);

  //this can be refactored
  const handleButtonClick = useCallback(
    (e) => {
      if (isNumeric(e.target.value)) {
        handleNumberClick(e.target.value);
        return;
      }

      if (["+", "-", "*", "/"].includes(e.target.value)) {
        handleOperatorClick(e.target.value);
      }

      if (e.target.value === "=") {
        handleEqualsClick();
      }

      if (e.target.value === "toggle-sign") {
        handleToggleSignClick();
      }

      if (e.target.value === "percent") {
        handleTogglePercentClick();
      }

      if (e.target.value === "clear") {
        handleClearClick();
      }

      if (e.target.value === "all-clear") {
        handleClearAllClick();
      }

      if (e.target.value === "decimal-point") {
        handleDecimalPointClick();
      }
    },
    [
      handleNumberClick,
      handleOperatorClick,
      handleEqualsClick,
      handleToggleSignClick,
      handleTogglePercentClick,
      handleClearClick,
      handleClearAllClick,
      handleDecimalPointClick,
    ]
  );

  const mainOutput = useMemo(() => {
    if (result && addend1 === "" && addend2 === "") {
      return result;
    }

    if (addend2 !== "") {
      return addend2;
    }

    return addend1;
  }, [addend1, addend2, result]);

  return (
    <CalculatorButtonClassProvider value="calculator-btn">
      <div id="calculator">
        <div id="output">
          <Output value={`${addend1} ${operator} ${addend2}`} id="expression" />
          <Output value={mainOutput} id="main" />
          {/* <input
            type="text"
            id="expression"
            value={`${addend1} ${operator} ${addend2}`}
            readOnly
          ></input>
          <input type="text" id="main" value={mainOutput} readOnly></input> */}
        </div>
        <div id="buttons-container">
          {isShowClearBtn ? (
            <Button
              label={"C"}
              onClick={handleButtonClick}
              value={"clear"}
              className={"util"}
            />
          ) : (
            <Button
              label={"AC"}
              onClick={handleButtonClick}
              value={"all-clear"}
              className={"util"}
            />
          )}

          <Button
            label={"+/-"}
            onClick={handleButtonClick}
            value={"toggle-sign"}
            className={"util"}
          />

          <Button
            label={"%"}
            onClick={handleButtonClick}
            value={"percent"}
            className={"util"}
          />
          <Button
            label={"/"}
            onClick={handleButtonClick}
            value={"/"}
            className={"operator"}
          />
          <Button
            label={7}
            onClick={handleButtonClick}
            value={7}
            className={"number"}
          />
          <Button
            label={8}
            onClick={handleButtonClick}
            value={8}
            className={"number"}
          />
          <Button
            label={9}
            onClick={handleButtonClick}
            value={9}
            className={"number"}
          />
          <Button
            label={"x"}
            onClick={handleButtonClick}
            value={"*"}
            className={"operator"}
          />
          <Button
            label={4}
            onClick={handleButtonClick}
            value={4}
            className={"number"}
          />
          <Button
            label={5}
            onClick={handleButtonClick}
            value={5}
            className={"number"}
          />
          <Button
            label={6}
            onClick={handleButtonClick}
            value={6}
            className={"number"}
          />
          <Button
            label={"-"}
            onClick={handleButtonClick}
            value={"-"}
            className={"operator"}
          />

          <Button
            label={1}
            onClick={handleButtonClick}
            value={1}
            className={"number"}
          />
          <Button
            label={2}
            onClick={handleButtonClick}
            value={2}
            className={"number"}
          />
          <Button
            label={3}
            onClick={handleButtonClick}
            value={3}
            className={"number"}
          />

          <Button
            label={"+"}
            onClick={handleButtonClick}
            value={"+"}
            className={"operator"}
          />

          <Button
            label={0}
            onClick={handleButtonClick}
            value={0}
            className={"number zero"}
          />

          <Button
            label={"."}
            onClick={handleButtonClick}
            value={"decimal-point"}
          />
          <Button
            label={"="}
            onClick={handleButtonClick}
            value={"="}
            className={"operator"}
          />
        </div>
      </div>
    </CalculatorButtonClassProvider>
  );
}

export default Calculator;
