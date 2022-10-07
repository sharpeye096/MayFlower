import * as React from 'react';
import {connect} from 'react-redux';

import { index, SudokuValidState } from './Algo';
import { mapDispatchToProps, SudokuProps, SudokuState, toProps } from './StateToProps';



class Sudoku extends React.PureComponent<SudokuProps> {
    public componentDidMount(): void {
        document.addEventListener("keydown", (e)=>this.onKeyDown(e));
    }

    public render() {
        return (<>
            <div className="sudokuOuter">
                {this.renderCells()}
            </div>
        </>);
    }

    private onKeyDown(e: KeyboardEvent) {
        if(!this.props.revoke || !this.props.setValue || this.props.focusedIndex < 0) {
            return;
        }
        // skip F1~F12
        if(e.code.startsWith("F")) {
            return;
        }
        if(!e.code.startsWith("Digit") || e.code === "Digit0") {
            this.props.revoke(this.props.focusedIndex);
            return;
        }
        const value = e.keyCode-48;
        this.props.setValue(value, this.props.focusedIndex);
    }

    private renderCells() {
        const rows = Array(9).fill(0);
        return (<>
            { rows.map((v, i)=>this.renderRow(i)) }
        </>
        )
    }
    
    private renderRow(row: number) {        
        const cols = Array(9).fill(0);
        return (<div className='sudokuRow'>
            { cols.map((v, i)=>this.renderCell(row, i)) }
        </div>)
    }

    private renderCell(row: number, col: number) {
        const values = this.props.values;
        const idx = index(row, col);
        let additionalClass = this.cellAdditionalClass(row, col, this.props.validState);
        const classNames = `sudokuCell${additionalClass}`;
        return (<div 
                    className={classNames} 
                    id={`c-${row}-${col}`}
                    onClick={()=>this.props.focus && this.props.focus(idx)}>
                        {values[idx] || ""}
                </div>);
    }

    private cellAdditionalClass(row: number, col: number, validState: SudokuValidState) {
        if(validState === "OK") {
            const idx = index(row, col);
            if(idx === this.props.focusedIndex) {
                return " suCellFocused";
            } else {
                return "";
            }
        }

        const currentFocusedRow = Math.floor(this.props.focusedIndex / 9);
        if(validState === "Row") {
            if(currentFocusedRow === row) {
                return " suCellInvalid";
            } else {
                return "";
            }
        }

        const currentFocusedCol = Math.floor(this.props.focusedIndex % 9);
        if(validState === "Col") {
            if(currentFocusedCol === col) {
                return " suCellInvalid";
            } else {
                return "";
            }
        }

        // square
        const focusedSquareRow = Math.floor(Math.floor(this.props.focusedIndex / 9) / 3);
        const focusedSquareCol = Math.floor(Math.floor(this.props.focusedIndex % 9) / 3);
        const cellSquareRow = Math.floor(row / 3);
        const cellSquareCol = Math.floor(col / 3);
        if(focusedSquareRow === cellSquareRow && focusedSquareCol === cellSquareCol){
            return " suCellInvalid";
        } else {
            return "";
        }
    }
}



export default connect(toProps, mapDispatchToProps)(Sudoku);
