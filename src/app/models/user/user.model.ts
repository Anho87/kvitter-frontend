import { MiniKvitterDto } from "../models/kvitter/mini-kvitter-dto.model";

export interface User {
    id: string;
    email: string;
    userName: string;
    kvitterList: MiniKvitterDto[];
    token: string;
}