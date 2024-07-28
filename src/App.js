import "./styles.css"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import { useReducer } from "react"



export const ACTIONS = {
  ADD_DIGIT: "add",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE: "delete",
  EQUALS: "equals",
}


/**
 * Reducer function for managing the state of the calculator.
 *
 * @param {Object} state - The current state of the calculator.
 * @param {Object} action - The action object containing the type and payload.
 * @returns {Object} - The new state after applying the action.
 */
function reducer(state, {type, payload}) {
  switch (type) {

    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false }
      }

      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }

      return { 
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      } 

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR:
      return {
        currentOperand: null,
        previousOperand: null,
        operation: null
      }

    case ACTIONS.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        }
      }

      if (state.currentOperand == null) {
        return state
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    case ACTIONS.EQUALS:
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null
      }
  }
}


function evaluate({currentOperand, previousOperand, operation}) {
  const current = parseFloat(currentOperand)
  const previous = parseFloat(previousOperand)

  if (isNaN(current) || isNaN(previous)) {
    return
  }

  let result = ""

  switch (operation) {
    case "+":
      result = previous + current
      break
    case "-":
      result = previous - current
      break
    case "*":
      result = previous * current
      break
    case "÷":
      result = previous / current
      break
  }

  return result.toString()
}

const INTEGER_FORMAT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })

function formatOperand(operand) {
  if (operand == null) return

  const [integer, decimal] = operand.toString().split(".")

  if (decimal == null) {
    return INTEGER_FORMAT.format(integer)
  }

  return `${INTEGER_FORMAT.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">

      <div className="output">
        <div data-previous-operand className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div data-current-operand className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      <button data-all-clear className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button data-delete onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>

      <OperationButton dispatch={dispatch} operation="÷" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button data-equals className="span-two" onClick={() => dispatch({ type: ACTIONS.EQUALS })}>=</button>
    </div>
  )
}

export default App;