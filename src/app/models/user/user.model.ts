import { MiniKvitterDto } from "../kvitter/mini-kvitter-dto.model";
import { MiniLikeDto } from "../like/mini-like-dto.model";
import { MiniReplyDto } from "../reply/mini-reply-dto.model";


export interface User {
    id: string;
    email: string;
    userName: string;
    kvitterList: MiniKvitterDto[];
    likes: MiniLikeDto[];
    replies: MiniReplyDto[];
    token: string;
}

