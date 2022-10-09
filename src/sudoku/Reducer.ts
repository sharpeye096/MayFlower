
import { UserAction } from "./Actions";
import { test } from "./Algo";
import { tryResolve } from "./Resolve";
import { SudokuState } from "./StateToProps";

export const initState: SudokuState = {
    resolveState: 0,
    invalidIndexes: Array(27).fill(true),
    focusedIndex: -1,
    values: Array(81).fill(0),
    problemValues: undefined
}

// the reducer function (Chessboard, MoveAction) => Chessboard
const reducerFunc = (state = initState, action: UserAction): SudokuState => {
    if(action.type === "Select" && action.payload.index !== undefined) {
        return {
            ...state,
            focusedIndex: action.payload.index
        };
    }
    if(action.type === "Set") {
        const values = [...state.values];
        values[state.focusedIndex] = action.payload.value || 0;
        const invalidIndexes = test(values);
        const nextFocus = state.focusedIndex+(!!action.payload.shiftFocus?1:0);
        return {
            ...state,
            focusedIndex: nextFocus%81,
            resolveState: 0,
            invalidIndexes,
            values,
        };
    }
    if(action.type === "Revoke") {
        const values = [...state.values];
        values[state.focusedIndex] = 0;
        const invalidIndexes = test(values);
        const nextFocus = state.focusedIndex+(!!action.payload.shiftFocus?1:0);
        return {
            ...state,
            focusedIndex: nextFocus%81,
            resolveState: 0,
            invalidIndexes,
            values,
        };
    }

    if(action.type === "Resolve") {
        const problemValues = [...state.values];
        const values = tryResolve(state.values);
        
        if(values && values.length) {
            const invalidIndexes = test(values);
            return {
                ...state,
                problemValues,
                resolveState: 2,
                invalidIndexes,
                values,
            };
        } else {
            // resolve failed
            return {
                ...state,
                problemValues: undefined,
                resolveState: 1
            }
        }
    }
    return state;
}

export default reducerFunc;