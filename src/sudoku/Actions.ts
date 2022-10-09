export type ActionType = "Select" | "Set" | "Revoke" | "Test" | "Resolve";

export interface ActionPayload {
    index?: number;
    value?: number;
    shiftFocus?: boolean;
}

export interface UserAction {
    type: ActionType;
    payload: ActionPayload;
}

