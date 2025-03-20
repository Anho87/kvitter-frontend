import { MiniHashtagDto } from "../hashtag/mini-hashtag-dto.model";
import { MiniLikeDto } from "../like/mini-like-dto.model";
import { MiniReplyDto } from "../reply/mini-reply-dto.model";
import { MiniUserDto } from "../user/mini-user-dto.model";

export interface Kvitter{
    id: string;
    message: string;
    user: MiniUserDto;
    createdDateAndTime: string;
    hashtags: MiniHashtagDto[];
    isPrivate: boolean;
    likes: MiniLikeDto[];
    replies: MiniReplyDto[];
}
