import { Kvitter } from "../kvitter/kvitter.model";
import { MiniUserDto } from "../user/mini-user-dto.model";

export interface Rekvitt{
    id:string;
    user: MiniUserDto;
    originalKvitter: Kvitter;
    createdDateAndTime: string;
}