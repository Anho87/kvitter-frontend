import { MiniKvitterDto } from "../kvitter/mini-kvitter-dto.model";
import { MiniUserDto } from "../user/mini-user-dto.model";

export interface Retweet{
    id:string;
    user: MiniUserDto;
    originalKvitter: MiniKvitterDto;
}
