import { Kvitter } from "../kvitter/kvitter.model";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    kvitterList: Kvitter[];
}