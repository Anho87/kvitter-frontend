import { Hashtag } from "../hashtag/hashtag.model";
import { MiniUserDto } from "../user/mini-user-dto.model";

export interface Kvitter{
    id: string;
    message: string;
    miniUserDTO: MiniUserDto;
    createdDateAndTime: string;
    hashtags: Hashtag[];
}