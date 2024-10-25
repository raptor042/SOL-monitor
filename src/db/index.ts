import { Group, Token } from "./models";

export const getToken = async (mint: string) => {
    try {
        const token = await Token.findOne({ mint });

        return token;
    } catch (error) {
        console.log(error);
    }
}

export const getGroups = async () => {
    try {
        const groups = await Group.find();

        return groups;
    } catch (error) {
        console.log(error);
    }
}