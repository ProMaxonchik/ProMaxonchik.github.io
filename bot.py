from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackContext

def start(update: Update, context: CallbackContext) -> None:
    keyboard = [
        [InlineKeyboardButton("Play Pac-Man", url="https://github.com/ProMaxonchik/klicker.git")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    update.message.reply_text('Welcome to the Pac-Man game!', reply_markup=reply_markup)

def main() -> None:
    # Создание Updater с вашим токеном бота
    updater = Updater("7462922263:AAE6Q00qSpsxLh3-njSFiw6JBW0Gus48vfo", use_context=True)

    dispatcher = updater.dispatcher

    # Добавление обработчика для команды /start
    dispatcher.add_handler(CommandHandler("start", start))

    # Запуск бота
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
