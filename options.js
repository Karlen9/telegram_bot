module.exports = {
  setEnterExitTimeOptions: {
    reply_makup: JSON.stringify({
      inline_keyboard: [
        [{ text: "Записать время входа", callback_data: "set_enter_time" }],
        [{ text: "Записать время выхода", callback_data: "set_exit_time" }],
      ],
    }),
  },
};
