import moment from "moment";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const date = moment().format("MMMM Do, h:mm");

const setEnterTimeOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Записать время входа", callback_data: "Время входа в офис" }],
    ],
  }),
};

const setExitTimeOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: "Записать время выхода",
          callback_data: "Время выхода из офиса",
        },
      ],
    ],
  }),
};

const currentTimeOption = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Указать текущее время", callback_data: "current_time" }],
    ],
  }),
};

const addStartTime = () => {
  console.log(date);
};

const start = () => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const commands = [
      {
        command: "/start",
        description: "Начальное приветствие",
      },
      { command: "/enter", description: "Указать время входа" },
      { command: "/exit", description: "Указать время выхода" },
      { command: "/info", description: "Получить информацию о себе" },
      { command: "/date", description: "Дата сегодня" },
    ];

    bot.setMyCommands(commands);
    console.log("Сообщение: ", text, ". От ", msg.from.first_name);

    if (text === "/start") {
      //   await bot.sendSticker(
      //     chatId,
      //     "https://tlgrm.ru/_/stickers/972/d03/972d03b1-80b4-43ac-8063-80e62b150d91/4.webp"
      //   );

      return bot.sendMessage(chatId, `Добро пожаловать!`);
    } else if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут: ${msg.from.first_name ? msg.from.first_name : ""} ${
          msg.from.last_name ? msg.from.last_name : ""
        }, твой id: ${msg.from.id}`
      );
    } else if (text === "/date") {
      return await bot.sendMessage(chatId, `Сегодня: ${date} `);
    } else if (text === "/enter") {
      bot.sendMessage(
        chatId,
        "Напишите время входа в офис: ",
        currentTimeOption
      );
    } else if (text === "/exit") {
      bot.sendMessage(
        chatId,
        "Напишите время выхода из офиса: ",
        currentTimeOption
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Привет, ты написал мне: "${text}", напиши какую-нибудь команду...`
      );
    }
  });

  bot.on("callback_query", (callbackQuery) => {
    const action = callbackQuery.data;

    if (action === "current_time") {
      console.log("Current", date);
    }
  });
};

start();
