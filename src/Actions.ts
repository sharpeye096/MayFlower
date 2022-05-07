import { Position } from "./Stick";

export type ActionType = "select" | "move";

export interface UserAction {
    type: ActionType;

    payload: Position;
}

