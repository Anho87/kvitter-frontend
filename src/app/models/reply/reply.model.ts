import { MiniKvitterDto } from "../kvitter/mini-kvitter-dto.model";
import { MiniUserDto } from "../user/mini-user-dto.model";
import { MiniReplyDto } from "./mini-reply-dto.model";

export interface Reply{
    id:string;
    message:string;
    createdDateAndTime:string;
    user:MiniUserDto;
    kvitter:MiniKvitterDto;
    parentReply:MiniReplyDto;
    replies:Reply[];
    isFollowing: Boolean;
}
