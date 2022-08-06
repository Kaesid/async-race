export interface ICar {
  start(id: number): Promise<IValues>;
  stop(id: number): Promise<number>;
  go(id: number): Promise<number>;
  toggleCommand(id: number): Promise<IValues>;
  request(id?: number | string): Promise<IValues | Array<IValues>>;
}

export interface IValues {
  [key: string]: number | string;
}

export interface IText {
  [key: string]: string;
}

export interface IAnimations {
  [key: number]: Animation;
}

export interface IFlags {
  [key: number]: boolean;
}

export interface IButton {
  [key: number]: HTMLButtonElement;
}

export interface IButtonsGroup {
  [key: string]: HTMLButtonElement;
}

export interface IInputs {
  [key: number]: HTMLInputElement;
}

export interface IPagesNumber {
  [key: number]: HTMLElement;
}

export interface ICarsButtons {
  race: IButton;
  reset: IButton;
  select: IInputs;
}

export interface ICarsData {
  cars: HTMLElement[];
  msgBox: IPagesNumber;
  ids: number[];
}

export interface IHTML {
  [key: string]: HTMLElement;
}

export interface INumber {
  [key: number]: number;
}

export interface ICarGeneration {
  input: HTMLInputElement;
  colorInput: HTMLInputElement;
  button: HTMLButtonElement;
}

export interface INavButtons {
  prev: HTMLButtonElement;
  next: HTMLButtonElement;
  currPage: number;
  maxElemsOnPage: number;
}

export interface IDOM {
  tag: string;
  classes?: string;
  parent: Element;
  innerText?: string;
  attributes?: IAttributes[];
}

export interface IAttributes {
  attribute: string;
  value: string;
}
