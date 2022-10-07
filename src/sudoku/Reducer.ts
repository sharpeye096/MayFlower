import { stat } from "fs";
import { UserAction } from "./Actions";
import { index, test, testByIndex } from "./Algo";
import { SudokuState } from "./StateToProps";

export const initState: SudokuState = {
    validState: "OK",
    focusedIndex: -1,
    values: Array(81).fill(0)
}

// the reducer function (Chessboard, MoveAction) => Chessboard
const reducerFunc = (state = initState, action: UserAction): SudokuState => {
    if(action.type === "Select") {
        return {
            ...state,
            focusedIndex: action.payload.index || -1
        };
    }
    if(action.type === "Set") {
        const values = [...state.values];
        values[state.focusedIndex] = action.payload.value || 0;
        const validState = testByIndex(state.focusedIndex, values);
        return {
            ...state,
            validState,
            values,
        };
    }
    if(action.type === "Revoke") {
        const values = [...state.values];
        values[state.focusedIndex] = 0;
        const validState = testByIndex(state.focusedIndex, values);
        return {
            ...state,
            validState,
            values,
        };
    }
    return state;
}

export default reducerFunc;