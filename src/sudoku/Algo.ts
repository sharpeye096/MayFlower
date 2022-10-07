export interface SudokuBoard {
    values: number[];
}

export type SudokuValidState = "Row" | "Col" | "Square" | "OK";


export function index(row: number, col: number): number {
    return row*9+col;
}

export function getByRowCol(row: number, col: number, values: number[]): number {
    return values[index(row, col)];
}

export function getByIndex(index: number, values: number[]): number {
    return values[index];
}

export function testByIndex(index: number, values: number[]): SudokuValidState {
    const row = Math.floor(index / 9);
    const col = Math.floor(index % 9);
    return test(row, col, values);
}

export function test(row: number, col: number, values: number[]): SudokuValidState {
    // test row
    if(!test9Values(getValues(values, rowIndexes(row)))) {
        return "Row";
    }

    // test col
    if(!test9Values(getValues(values, colIndexes(col)))) {
        return "Col";
    }

    // test square
    if(!test9Values(getValues(values, squareIndexes(row, col)))) {
        return "Square";
    }
    return "OK";
}

export function set(value: number, row: number, col: number, values: number[]): void {
    const idx = index(row, col);
    values[idx] = value;
}

// test if the given array are numbers from 1-9, one per value
function test9Values(values: number[]): boolean {
    const test = Array(9).fill(0);
    for(let i=0;i<9;i++) {
        const value = values[i];
        if(value === 0) {
            continue;
        }
        const prev = test[value-1];
        // duplication
        if(prev !== 0) {
            return false;
        }
        test[value-1] = 1;
    }
    return true;
}

function getValues(values: number[], indexes: number[]): number[] {
    return indexes.map(index=>getByIndex(index, values));
}

function rowIndexes(row: number): number[] {
    return Array(9).fill(0).map((v,i)=>index(row, i));
}

function colIndexes(col: number): number[] {
    return Array(9).fill(0).map((v,i)=>index(i, col));
}

function squareIndexes(row: number, col: number): number[] {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    return [index(startRow, startCol),
        index(startRow, startCol+1),
        index(startRow, startCol+2),
        index(startRow+1, startCol),
        index(startRow+1, startCol+1),
        index(startRow+1, startCol+2),
        index(startRow+2, startCol),
        index(startRow+2, startCol+1),
        index(startRow+2, startCol+2),
    ]
}
