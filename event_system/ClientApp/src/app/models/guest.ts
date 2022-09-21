import { Allergy } from "./allergy";

export class Guest {
    id?:number;
    firstName?:string;
    lastName?: string;
    email?:string;
    dob?:string;
    allergies?: Allergy[]
    
}
