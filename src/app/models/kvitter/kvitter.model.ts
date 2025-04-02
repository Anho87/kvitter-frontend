import { MiniHashtagDto } from "../hashtag/mini-hashtag-dto.model";
import { MiniLikeDto } from "../like/mini-like-dto.model";
import { MiniRekvittDto } from "../rekvitt/mini-rekvitt-dto.model";
import { Reply } from "../reply/reply.model";
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
    retweets: MiniRekvittDto[];
}
