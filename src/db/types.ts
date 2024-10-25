import { Model } from "mongoose";

export interface IToken {
    mint: string,
    mutable: boolean,
    mint_autority: string,
    update_authority: string,
    tax: number,
    holders: {
        address: number,
        balance: number
    }
}

export interface IGroup {
    name: string,
    id: number
}

export type TokenModel = Model<IToken>;
export type GroupModel = Model<IGroup>;