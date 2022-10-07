import { SudokuBoard } from "./Algo";
import { Dispatch } from 'redux';

export interface SudokuHandlers {
    focus?:(index: number)=> void;
    setValue?:(value: number, index: number)=> void;
    revoke?:(index: number)=> void;
    resolve?: ()=>void;
}

export interface SudokuState extends SudokuBoard {
    // true: resolve succeeded, false: resolve failed, undefined: not resolved
    resolveState: number;
    invalidIndexes: boolean[];
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
    resolve: ()=>dispatch({type: "Resolve", payload: {}}),
});
