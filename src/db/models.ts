import { Schema, model } from "mongoose";
import { GroupModel, IGroup, IToken, TokenModel } from "./types";

const TokenSchema = new Schema<IToken, TokenModel>({
    mint: String,
    mutable: Boolean,
    mint_autority: String,
    update_authority: String,
    tax: Number,
    holders: {
        address: Number,
        balance: Number
    }
});

const GroupSchema = new Schema<IGroup, GroupModel>({
    name: String,
    id: Number
});

export const Token = model<IToken, TokenModel>("Token", TokenSchema);
export const Group = model<IGroup, GroupModel>("Group", GroupSchema);