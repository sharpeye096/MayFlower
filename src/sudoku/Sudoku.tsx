import * as React from 'react';
import {connect} from 'react-redux';

import { allIndexes, index } from './Algo';
import { mapDispatchToProps, SudokuProps, toProps } from './StateToProps';

class Sudoku extends React.PureComponent<SudokuProps> {
    public componentDidMount(): void {
        document.addEventListener("keydown", (e)=>this.onKeyDown(e));
    }

    public render() {
        console.log("resolve state: "+this.props.resolveState);
        return (<>
            <div className="sudokuOuter">
                {this.renderCells()}
            </div>
            <button onClick={()=>this.tryResolve()}>
                Resolve
            </button>
            <button onClick={()=>this.increaseSelected(1)}>
                +
            </button>
            <button onClick={()=>this.increaseSelected(-1)}>
                -
            </button>
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
        // array of [0, 1, ..., 9]
        const keys = Array(10).fill(0).map((v, i)=>i);
        const value = keys[parseInt(e.key)];
        if(!!value) {
            this.props.setValue(value, this.props.focusedIndex, true);    
        } else {
            this.props.revoke(this.props.focusedIndex, true);
        }
    }

    private renderCells() {
        const squreRows = [0,1,2];
        return (<>
            { squreRows.map((i)=>this.renderSquareRow(i)) }
        </>
        )
    }
    
    private renderSquareRow(row: number) {        
        const squareCols = [0,1,2];
        return (<div className='rowBig'>
            { squareCols.map((v)=>this.renderSquare(row, v)) }
        </div>)
    }

    private renderSquare(squareRow: number, squareCol: number) {
        const cellIndexes = allIndexes[squareRow*3+squareCol+18];
        return (<div className='square'>
                    <div className='row'>
                        { cellIndexes.slice(0, 3).map(idx=>this.renderCell(idx)) }
                    </div>
                    <div className='row'>
                        { cellIndexes.slice(3, 6).map(idx=>this.renderCell(idx)) }
                    </div>
                    <div className='row'>
                        { cellIndexes.slice(6, 9).map(idx=>this.renderCell(idx)) }
                    </div>
        </div>)
    }

    private renderCell(idx: number) {
        const row = Math.floor(idx / 9);
        const col = Math.floor(idx % 9);
        const values = this.props.values;
        
        const value = values[idx];
        const isProblemValue = !!(this.props.problemValues && this.props.problemValues[idx]);
        let additionalClass = this.cellAdditionalClass(row, col, this.props.invalidIndexes, isProblemValue);
        const classNames = `sudokuCell${additionalClass}`;
        
        return (<div 
                    className={classNames} 
                    id={`c-${row}-${col}`}
                    onClick={()=>this.props.focus && this.props.focus(idx)}>
                        {value || ""}
                </div>);
    }

    private cellAdditionalClass(row: number, col: number, invalidIndexes: boolean[], isProblemValue: boolean) {
        const colId = col + 9;
        const squareRId = Math.floor(row/3);
        const squareCId = Math.floor(col/3);
        const squareId = squareRId * 3 + squareCId + 18;

        const anyInvalid = !invalidIndexes[row] || !invalidIndexes[colId] || !invalidIndexes[squareId];
        if(anyInvalid) {
            return " suCellInvalid";
        } 
        if(this.props.focusedIndex === index(row, col)) {
            return " suCellFocused";
        }

        return isProblemValue ? " suCellBold" : "";
    }

    private tryResolve() {
        if(this.props.invalidIndexes.filter(i=>!i).length > 0) {
            console.log("conflicting...")
            return;
        }
        this.props.resolve && this.props.resolve();
    }

    private increaseSelected(delta: number) {
        const currentValue = this.props.values[this.props.focusedIndex];
        const nextValue = (currentValue+delta+10) % 10;
        if(!!nextValue) {
            this.props.setValue && this.props.setValue(nextValue, this.props.focusedIndex, false);    
        } else {
            this.props.revoke && this.props.revoke(this.props.focusedIndex, false);
        }
    }
}



export default connect(toProps, mapDispatchToProps)(Sudoku);
