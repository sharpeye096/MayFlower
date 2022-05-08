import { UserAction } from "./Actions";
import { Chessboard, initChessBoard, Position, StickState } from "./Stick";

export const initState = initChessBoard();

// the reducer function (Chessboard, MoveAction) => Chessboard
const reducerFunc = (state = initState, action: UserAction): Chessboard => {
    if(action.type === "select") {
        return {
            ...state,
            selectedStick: action.payload
        }
    }
    if(action.type === "move" && state.selectedStick) {
        const chessboard = state.sticks;
        const pos = action.payload;
        chessboard[pos.x][pos.y] = state.current;
        chessboard[state.selectedStick.x][state.selectedStick.y] = "";
        updateSticksOnChange(chessboard, pos);
        return {
            ...state,
            selectedStick: undefined,
            current: state.current === "r" ? "w" : "r"
        }
    }

    return state;
}

export default reducerFunc;

function updateSticksOnChange(chessboard: StickState[][], pos1: Position): Position[] {
    let allChangedSticks = checkBAB2AAA(chessboard, pos1);
    let changedSticks = allChangedSticks;
    while(changedSticks.length > 0) {
        let newChangedSticks: Position[] = [];
        for(let i=0;i<changedSticks.length;i++) {
            newChangedSticks = newChangedSticks.concat(updateSticksOnChange(chessboard, changedSticks[i]));
        }
        changedSticks = newChangedSticks;
        allChangedSticks = allChangedSticks.concat(newChangedSticks);
    }

    changedSticks = checkABAAAA(chessboard, pos1);
    allChangedSticks = allChangedSticks.concat(changedSticks);
    while(changedSticks.length > 0) {
        let newChangedSticks: Position[] = [];
        for(let i=0;i<changedSticks.length;i++) {
            newChangedSticks = newChangedSticks.concat(updateSticksOnChange(chessboard, changedSticks[i]));
        }
        changedSticks = newChangedSticks;
        allChangedSticks = allChangedSticks.concat(newChangedSticks);
    }

    return allChangedSticks;
}

function checkBAB2AAA(chessboard: StickState[][], pos1: Position): Position[] {
    const state = getState(chessboard, pos1);
    const checks: Position[][] = [
        [{x: pos1.x+1, y: pos1.y}, {x: pos1.x+2, y: pos1.y}],
        [{x: pos1.x-1, y: pos1.y}, {x: pos1.x-2, y: pos1.y}],
        [{x: pos1.x, y: pos1.y+1}, {x: pos1.x, y: pos1.y+2}],
        [{x: pos1.x, y: pos1.y-1}, {x: pos1.x, y: pos1.y-2}],
        [{x: pos1.x+1, y: pos1.y+1}, {x: pos1.x+2, y: pos1.y+2}],
        [{x: pos1.x-1, y: pos1.y-1}, {x: pos1.x-2, y: pos1.y-2}],
        [{x: pos1.x+1, y: pos1.y-1}, {x: pos1.x+2, y: pos1.y-2}],
        [{x: pos1.x-1, y: pos1.y+1}, {x: pos1.x-2, y: pos1.y+2}]
    ]; 
    const steps = ((pos1.x+pos1.y) % 2 === 0) ? 8 : 4;
    const changed: Position[] = [];
    for(let i=0;i<steps;i++) {
        const check = checks[i];
        const c0 = getState(chessboard, check[0]);
        const c1 = getState(chessboard, check[1]);
        if(c0 && c1 && c0 !== c1 && c0 !== state) {
            flip(chessboard, check[0]);
            changed.push(check[0]);
        }
    }
    return changed;
}

function checkABAAAA(chessboard: StickState[][], pos1: Position): Position[] {
    const state = getState(chessboard, pos1);
    const checks: Position[][] = [
        [{x: pos1.x+1, y: pos1.y}, {x: pos1.x-1, y: pos1.y}],
        [{x: pos1.x, y: pos1.y+1}, {x: pos1.x, y: pos1.y-1}],
        [{x: pos1.x+1, y: pos1.y+1}, {x: pos1.x-1, y: pos1.y-1}],
        [{x: pos1.x+1, y: pos1.y-1}, {x: pos1.x-1, y: pos1.y+1}]
    ]; 
    const steps = ((pos1.x+pos1.y) % 2 === 0) ? 4 : 2;
    const changed: Position[] = [];
    for(let i=0;i<steps;i++) {
        const check = checks[i];
        const c0 = getState(chessboard, check[0]);
        const c1 = getState(chessboard, check[1]);
        if(c0 && c1 && c0 === c1 && c0 !== state) {
            flip(chessboard, check[0]);
            flip(chessboard, check[1]);
            changed.push(check[0]);
            changed.push(check[1]);
        }
    }
    return changed;
}

function flip(chessboard: StickState[][], pos1: Position) {
    const currentState = getState(chessboard, pos1);
    if(currentState) {
        chessboard[pos1.x][pos1.y] = currentState === "r" ? "w" : "r";
    }
}

function getState(chessboard: StickState[][], pos1: Position) {
    return chessboard[pos1.x] && chessboard[pos1.x][pos1.y];
}

