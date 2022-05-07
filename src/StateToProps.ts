import { IProps } from "./Chess";
import { Chessboard, Position, samePosition, selectStick, selectTarget, StickState } from "./Stick";

export function toProps(chessboard: Chessboard): IProps {
    return {
        sticks: chessboard.sticks,
        selectedStick: chessboard.selectedStick,
        current: chessboard.current
    };
}


export function onStickClick(chessboard: IProps, pos: Position) {
    if(chessboard.selectedStick) {
        if(samePosition(chessboard.selectedStick, pos)) {
            chessboard.selectStick && chessboard.selectStick(undefined);
            return;
        }

        const target = selectTarget(chessboard, pos);
        console.log("stick selected, try to match target");
        if(target && isValidMove(chessboard.sticks, chessboard.selectedStick, target)) {
            chessboard.moveTo && chessboard.moveTo(target);
            console.log("matched");
            return;
        }
    }
    const stick = selectStick(chessboard, pos) 
    console.log("try to match target");
    if(stick) {
        chessboard.selectStick && chessboard.selectStick(stick);
        console.log("matched");
        return stick;
    }

    console.log("invalid move");
}

function isValidMove(chessboard: StickState[][], from: Position, to: Position): boolean {
    return sameLineCheck(chessboard, from, to) || crossLineCheck(chessboard, from, to);
}

function sameLineCheck(chessboard: StickState[][], from: Position, to: Position): boolean {
    if(from.x !== to.x && from.y !== to.y) {
        return false;
    }
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const dx1 = dx / Math.abs(dx+dy);
    const dy1 = dy / Math.abs(dx+dy);
    const nextPos = {
        x: from.x - dx1,
        y: from.y - dy1
    };
    while(!samePosition(nextPos, to)) {
        if(chessboard[nextPos.x][nextPos.y] !== "") {
            return false;
        }
        nextPos.x -= dx1;
        nextPos.y -= dy1;
    }
    if((from.y <= 4 && to.y <= 4) || (from.y > 4 && to.y > 4))    // in the same side
        return true;
    return from.x === 2 && to.x === 2;
}

function crossLineCheck(chessboard: StickState[][], from: Position, to: Position) {
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    if(Math.abs(dx) !== Math.abs(dy)) {
        return false;
    }
    if((from.x+from.y) % 2 !== 0) {
        return false;
    }
    const dx1 = dx / Math.abs(dx);
    const dy1 = dy / Math.abs(dx);
    const nextPos = {
        x: from.x - dx1,
        y: from.y - dy1
    };
    while(!samePosition(nextPos, to)) {
        if(chessboard[nextPos.x][nextPos.y] !== "") {
            return false;
        }
        nextPos.x -= dx1;
        nextPos.y -= dy1;
    }

    if((from.y <= 4 && to.y <= 4) || (from.y > 4 && to.y > 4))    // in the same side
        return true;
    const smallerY = from.y < to.y ? from : to;
    return smallerY.y !== 4 || (smallerY.x !== 4 && smallerY.x !== 0);
}