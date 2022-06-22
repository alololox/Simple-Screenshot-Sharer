export interface ControlsState {
  color: string | null;
  insetColor?: string;
  background: string | null;
  border: number;
  size: number;
  inset: number;
  shadow: number;
  aspectRatio: string;
}

export interface ControlsAction {
  type: string;
  value: any;
}

export const initialControlsState: ControlsState = {
  color: null,
  insetColor: "#ffffff",
  background: null,
  border: 0,
  size: 50,
  inset: 0,
  shadow: 0,
  aspectRatio: "1/1",
};

export function controlsReducer(state: ControlsState, action: ControlsAction) {
  switch (action.type) {
    case "COLOR":
      return { ...state, color: action.value, background: null };
    case "INSETCOLOR":
      return { ...state, insetColor: action.value };
    case "BACKGROUND":
      return { ...state, background: action.value, color: null };
    case "BORDER":
      return { ...state, border: action.value };
    case "SIZE":
      return { ...state, size: action.value };
    case "INSET":
      return { ...state, inset: action.value };
    case "SHADOW":
      return { ...state, shadow: action.value };
    case "ASPECTRATIO":
      return { ...state, aspectRatio: action.value };
    default:
      throw new Error();
  }
}
