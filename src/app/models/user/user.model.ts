import { MiniKvitterDto } from "../kvitter/mini-kvitter-dto.model";
import { MiniRekvittDto } from "../rekvitt/mini-rekvitt-dto.model";
import { MiniReplyDto } from "../reply/mini-reply-dto.model";
import { MiniUserDto } from "./mini-user-dto.model";


export interface User {
    id: string;
    email: string;
    userName: string;
    kvitterList: MiniKvitterDto[];
    replies: MiniReplyDto[];
    following: MiniUserDto[];
    followers: MiniUserDto[]
    rekvitts: MiniRekvittDto[]
    token: string;
}
