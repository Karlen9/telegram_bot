const moment = require("moment");
const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");
const pg = require("pg");
const { User } = require("./models/user");
pg.defaults.ssl = true;

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

console.log("User", User);

const start = async () => {
  // let users = await User.findAll({ chatId });
  // console.log("users", users);
  try {
  } catch (error) {
    console.log("Ошибка при подключении к Базе Данных ", error);
  }
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    let user = await User.create({
      chatId,
      first_name: msg.message.first_name,
      last_name: msg.message.last_name,
    });
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

    try {
      if (text === "/start") {
        //   await bot.sendSticker(
        //     chatId,
        //     "https://tlgrm.ru/_/stickers/972/d03/972d03b1-80b4-43ac-8063-80e62b150d91/4.webp"
        //   );
        const user = User.create({ chatId });

        return bot.sendMessage(chatId, `Добро пожаловать, ${user.first_name}!`);
      } else if (text === "/info") {
        await bot.sendMessage(
          chatId,
          `Тебя зовут: ${user.first_name ? msg.from.first_name : ""} ${
            msg.from.last_name ? msg.from.last_name : ""
          }, твой id: ${msg.from.id}, `
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
    } catch (error) {
      bot.sendMessage(chatId, "Произошла ошибка...");
      console.log(error);
    }

    bot.setMyCommands(commands);
    console.log("Сообщение: ", text, ". От ", msg.from.first_name);
  });

  bot.on("callback_query", (callbackQuery) => {
    const action = callbackQuery.data;

    if (action === "current_time") {
      console.log("Current", date);
    }
  });
};

start();
