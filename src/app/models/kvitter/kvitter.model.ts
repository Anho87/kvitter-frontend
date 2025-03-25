import { MiniHashtagDto } from "../hashtag/mini-hashtag-dto.model";
import { MiniLikeDto } from "../like/mini-like-dto.model";
import { MiniReplyDto } from "../reply/mini-reply-dto.model";
import { Reply } from "../reply/reply.model";
import { MiniRetweetDto } from "../retweet/mini-retweet-dto.models";
import { MiniUserDto } from "../user/mini-user-dto.model";

export interface Kvitter{
    id: string;
    message: string;
    user: MiniUserDto;
    createdDateAndTime: string;
    hashtags: MiniHashtagDto[];
    private: Boolean;
    likes: MiniLikeDto[];
    replies: Reply[];
    retweets: MiniRetweetDto[];
}
