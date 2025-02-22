import { MiniHashtagDto } from "../hashtag/mini-hashtag-dto.model";
import { MiniUserDto } from "../user/mini-user-dto.model";

export interface Kvitter{
    id: string;
    message: string;
    miniUserDTO: MiniUserDto;
    createdDateAndTime: string;
    hashtags: MiniHashtagDto[];
}