export interface SudokuBoard {
    values: number[];
}

export function index(row: number, col: number): number {
    return row*9+col;
}

export function getByRowCol(row: number, col: number, values: number[]): number {
    return values[index(row, col)];
}

export function getByIndex(index: number, values: number[]): number {
    return values[index];
}

// return invalid indexes 
// 0~8: rows 0~8
// 9~17: cols 0~8
// 18~26: squares 0~8
export function test(values: number[]): boolean[] {
    return allIndexes.map(indexes=>test9Values(getValues(values, indexes)));
}

export function set(value: number, row: number, col: number, values: number[]): void {
    const idx = index(row, col);
    values[idx] = value;
}

export function getUnitIndexes(index: number): number[] {
    const rowIndex = Math.floor(index / 9);
    const colIndex = Math.floor(index % 9);
    const squarRid = Math.floor(rowIndex / 3);
    const squarCid = Math.floor(colIndex / 3);
    const squareId = squarRid * 3 + squarCid;
    return [rowIndex, colIndex+9, squareId+18];
}

function allIndexesFunc(): number[][] {
    const rows = Array(9).fill(0).map((v, i)=>i).map(rId => rowIndexes(rId));
    const cols = Array(9).fill(0).map((v, i)=>i).map(rId => colIndexes(rId));
    const squars = [
        [0, 0], [0, 3] , [0, 6], 
        [3, 0], [3, 3] , [3, 6],
        [6, 0], [6, 3] , [6, 6]
    ].map(squar=>squareIndexes(squar[0], squar[1]));
    return rows.concat(cols).concat(squars);
}

export const allIndexes = allIndexesFunc();

// test if the given array are numbers from 1-9, one per value
// true if tested OK. false if invalid
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
