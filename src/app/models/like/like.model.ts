import { MiniKvitterDto } from "../kvitter/mini-kvitter-dto.model";
import { MiniUserDto } from "../user/mini-user-dto.model";

export interface Like{
    id:string;
    user: MiniUserDto;
    kvitter: MiniKvitterDto;
}
