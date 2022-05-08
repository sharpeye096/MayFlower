import { IProps } from "./Chess";

export type StickState = "r" | "w" | "" | undefined;

export interface Position {
    x: number;
    y: number;
}

export interface Move {
    from: Position;
    to: Position;
}

export function samePosition(pos1: Position, pos2: Position) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

export interface Chessboard {
    current: "r" | "w";
    sticks: StickState[][];
    history: Move[];
    selectedStick?: Position;
}

export function initChessBoard(): Chessboard {
    return {
        current: "r",
        sticks: [
            ["r", "r", "r", "r", "r"],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["w", "w", "w", "w", "w"]
        ],
        history: []
    }
}

export function toSticks(chess: Chessboard) {
    return chess.sticks;
}


export function selectStick(chessboard: IProps, pos: Position): Position | undefined {
    const targetStickState = chessboard.sticks[pos.x] && chessboard.sticks[pos.x][pos.y];
    if(targetStickState !== chessboard.current) {
        return undefined;
    }
    return pos;
}

export function selectTarget(chessboard: IProps, pos: Position): Position | undefined {
    const targetStickState = chessboard.sticks[pos.x] && chessboard.sticks[pos.x][pos.y];
    if(targetStickState !== "") {
        // more validations to come
        return undefined;
    }
    return pos;
}