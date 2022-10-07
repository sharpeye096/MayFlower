import { SudokuBoard, SudokuValidState } from "./Algo";
import { Dispatch } from 'redux';

export interface SudokuHandlers {
    focus?:(index: number)=> void;
    setValue?:(value: number, index: number)=> void;
    revoke?:(index: number)=> void;
}

export interface SudokuState extends SudokuBoard {
    validState: SudokuValidState;
    focusedIndex: number;
    values: number[];
}

export interface SudokuProps extends SudokuHandlers, SudokuState {
    
};

export function toProps(state: SudokuState): SudokuProps {
    return {
        ...state
    };
}


export const mapDispatchToProps = (dispatch: Dispatch) => ({
    focus:(index: number)=>dispatch({type: "Select", payload: {index: index}}),
    setValue: (value: number, index: number)=>dispatch({type: "Set", payload: {index: index, value: value}}),
    revoke: (index: number)=>dispatch({type: "Revoke", payload: {index: index}}),
});
