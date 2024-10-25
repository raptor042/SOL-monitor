import { connection } from "./web3/constants";
import { monitorNewTokens } from "./web3/index";
import { Telegraf, session, type Context } from "telegraf";
import type { Update } from "telegraf/types";
import { config } from "dotenv";
import { connectDB } from "./db/utils";
import { getGroups } from "./db";

interface BotContext <U extends Update = Update> extends Context<U> {
	session: {
		token: string,
        buy_amount: number,
        sell_amount: number,
	},
}

config();
connectDB();

function defaultSession (): BotContext["session"] {
    return { token: "", buy_amount: 0, sell_amount: 0 };
}

const bot = new Telegraf<BotContext>(process.env.TELEGRAM_API_TOKEN as string, { handlerTimeout: 9_000_000 });

bot.use(session({ defaultSession }));
bot.use(Telegraf.log());

bot.command("start", async (ctx: BotContext) => {
    console.log(ctx.session);

    if(ctx.message?.chat.type == "private") {
        await ctx.replyWithHTML("SOL Monitor Bot is active. Add the bot to your group or channel to get live updates as new tokens are being launched on Raydium.");
    } else {
        await ctx.replyWithHTML("SOL Monitor Bot is active. Live updates will be sent here as new tokens are being launched on Raydium.");
    }
})

bot.launch(() => console.log("SOL Monitor Bot is active and running."));

(async function() {
    const data = await monitorNewTokens(connection);

    const groups = await getGroups();

    const text = `<b>${data}</b>`;

    if(groups?.length! > 0) {
        groups?.forEach(group => {
            bot.telegram.sendMessage(group.id, text, {
                parse_mode: "HTML"
            });
        });
    }
})()