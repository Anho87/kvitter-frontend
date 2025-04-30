import { MiniHashtagDto } from "../hashtag/mini-hashtag-dto.model";
import { MiniRekvittDto } from "../rekvitt/mini-rekvitt-dto.model";
import { MiniUserDto } from "../user/mini-user-dto.model";

export interface MiniKvitterDto{
    id: string;
    message: string;
    user: MiniUserDto;
    createdDateAndTime: string;
    hashtags: MiniHashtagDto[];
    isPrivate: Boolean;
    isActive: Boolean;
    likes: MiniUserDto[];
    isFollowing: Boolean;
    isLiked: Boolean;
}