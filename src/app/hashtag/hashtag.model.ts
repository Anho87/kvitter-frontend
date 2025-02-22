import { MiniKvitterDto } from "../kvitter/mini-kvitter-dto.model";

export interface Hashtag{
    id: string;
    hashtag: string;
    kvitters: MiniKvitterDto[];
}