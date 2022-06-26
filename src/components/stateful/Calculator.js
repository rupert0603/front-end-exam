import React, { useCallback, useState } from "react";
import Button from "../stateless/Button";
import { isNumeric } from "../../lib/casting";

function Calculator() {
  // const [output, setOutput] = useState(0);

  const [addend1, setAddend1] = useState(0);
  const [addend2, setAddend2] = useState(null);
  const [operator, setOperator] = useState("");
  const [result, setResult] = useState(null);

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
        if (addend2 === 0 || addend2 === null) {
          setAddend2(Number(value));
        } else setAddend2(Number(addend2.toString() + value.toString()));
      } else {
        if (addend1 === 0 || addend1 === null) {
          setAddend1(Number(value));
        } else setAddend1(Number(addend1.toString() + value.toString()));
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
      if (operator && addend1 !== null && addend2 === null) {
        console.log("here1");
        //can update addend2 here and use it instead as argument
        const newResult = solveExpression(addend1, addend1, operator);
        setResult(newResult);

        //solve then use the new operator
        setOperator(value);
        setAddend1(newResult);

        return;
      }

      if (operator && addend1 !== null && addend2 !== null) {
        console.log("here2");
        const newResult = solveExpression(addend1, addend2, operator);
        setResult(newResult);

        //solve then use the new operator
        setOperator(value);
        setAddend1(newResult);
        setAddend2(null);

        return;
      }

      //   if (result && !addend1 === null) {
      if (result && addend1 === null) {
        console.log("here3");
        setOperator(value);
        setAddend1(result);
        return;
      }

      setOperator(value);
    },
    [addend1, addend2, result, operator, solveExpression]
  );

  const handleEqualsClick = useCallback(() => {
    if (result && addend1 === null) {
      return;
    }

    if (!operator && addend1 !== null) {
      setResult(addend1);
      setAddend1(null);
      return;
    }

    if (addend1 !== null && addend2 === null && operator) {
      const newResult = solveExpression(addend1, addend1, operator);
      setResult(newResult);
      setOperator("");
      setAddend1(null);
      return;
    }

    const newResult = solveExpression(addend1, addend2, operator);
    setResult(newResult);
    setOperator("");
    setAddend1(null);
    setAddend2(null);

    // if there's a result shown and equals is clicked and there's no addend(s)

    // if only one addend and equalis is clicked, return addend1 as result
    // and that bbecomes result

    // if only one addend and there's an operator and equals is clicked,
    // apply the operator to itself and that bebcomes result
  }, [addend1, addend2, operator, result, solveExpression]);

  const handleTogglePercentClick = useCallback(() => {
    if (addend2 !== null) {
      setAddend2(addend2 / 100);
      return;
    }

    if (result !== null && addend1 === null) {
      setAddend1(result / 100);
      return;
    }

    if (operator && addend2 !== null && addend2 === null) {
      setAddend1(addend1 / 100);
      return;
    }

    setAddend1(addend1 / 100);

    //if addend1 is null, use the result as the addend1
    //if there is an operator, and there's no addend2, applyt it to addend1
  }, [addend1, addend2, operator, result]);

  const handleToggleSignClick = useCallback(() => {
    if (addend2 !== null) {
      setAddend2(addend2 * -1);
      return;
    }

    if (result !== null && addend1 === null) {
      setAddend1(result * -1);
      return;
    }

    if (operator && addend2 !== null && addend2 === null) {
      setAddend1(addend1 * -1);
      return;
    }

    setAddend1(addend1 * -1);
    //if addend1 is null, use the result as the addend1
    //if there is an operator, and there's no addend2, applyt it to addend1
  }, [addend1, addend2, operator, result]);

  const handleClearClick = useCallback(() => {
    if (addend2 !== null) {
      setAddend2(0);
      return;
    }

    setAddend1(0);
    // doesn't clear the operator
    // set to zero if addend is not null
  }, [addend2]);

  const handleClearAllClick = useCallback(() => {
    setAddend1(0);
    setAddend2(null);
    setOperator("");
    setResult(null);
  }, []);

  //   const handleDecimalPointClick = useCallback(() => {
  //     if(result !== null && addend1 === null){
  //         set
  //     }

  //   }, [addend1, addend2, result])

  //this can be refactored
  const handleButtonClick = useCallback(
    (e) => {
      if (isNumeric(e.target.value)) {
        handleNumberClick(Number(e.target.value));
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
      //   addend1,
      //   addend2,
      //   operator,
      handleNumberClick,
      handleOperatorClick,
      handleEqualsClick,
      handleToggleSignClick,
      handleTogglePercentClick,
      handleClearClick,
      handleClearAllClick,
      //   handleDecimalPointClick
    ]
  );

  return (
    <>
      <Button label={1} onClick={handleButtonClick} value={1} />
      {/* <Button label={2} onClick={handleButtonClick} value={2} />
      <Button label={2} onClick={handleButtonClick} value={2} />
      <Button label={2} onClick={handleButtonClick} value={2} />
      <Button label={2} onClick={handleButtonClick} value={2} />
      <Button label={2} onClick={handleButtonClick} value={2} />
      <Button label={2} onClick={handleButtonClick} value={2} />
      <Button label={2} onClick={handleButtonClick} value={2} /> */}
      <Button label={9} onClick={handleButtonClick} value={9} />
      <Button label={2} onClick={handleButtonClick} value={2} />
      <Button label={"+"} onClick={handleButtonClick} value={"+"} />
      <Button label={"-"} onClick={handleButtonClick} value={"-"} />
      <Button
        label={"toggle sign"}
        onClick={handleButtonClick}
        value={"toggle-sign"}
      />
      <Button label={"percent"} onClick={handleButtonClick} value={"percent"} />
      <Button
        label={"all clear"}
        onClick={handleButtonClick}
        value={"all-clear"}
      />
      <Button label={"clear"} onClick={handleButtonClick} value={"clear"} />
      <Button
        label={"decimal-point"}
        onClick={handleButtonClick}
        value={"decimal-point"}
      />
      <Button label={"="} onClick={handleButtonClick} value={"="} />
      <div>
        <strong>ADDEND 1</strong>: {addend1}
      </div>
      <div>
        <strong>OPERATOR</strong>: {operator}
      </div>
      <div>
        <strong>ADDEND 2</strong>: {addend2}
      </div>
      <div>
        <strong>RESULT</strong>: {result}
      </div>
    </>
  );
}

export default Calculator;
