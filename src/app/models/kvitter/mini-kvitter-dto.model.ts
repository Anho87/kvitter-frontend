import { MiniHashtagDto } from "../hashtag/mini-hashtag-dto.model";

export interface MiniKvitterDto{
    id: string;
    message: string;
    createdDateAndTime: string;
    hashtags: MiniHashtagDto[];
    private: Boolean;
    isActive: Boolean;
    isFollowing: Boolean;
    isLiked: Boolean;
}