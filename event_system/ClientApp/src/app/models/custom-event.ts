import { Guest } from "./guest"

export class CustomEvent {
    id?: number;
    name?: string;
    date?: string;
    guests?: Guest[] | number[];
}

