import { Kvitter } from "../kvitter/kvitter.model";

export interface Hashtag{
    id: string;
    hashtag: string;
    kvitters: Kvitter[];
}