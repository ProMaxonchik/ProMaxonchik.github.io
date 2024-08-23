(function($){
    jQuery(document).ready(function() {   
        
        // Check if there's a Pacman score stored
        const pacmanScore = parseInt(localStorage.getItem('pacmanScore'));
        if (pacmanScore) {

            let totalMoney = parseInt(localStorage.getItem('totalMoney')) || 0;
            totalMoney += pacmanScore;
            localStorage.setItem('totalMoney', totalMoney);
            document.getElementById('spirinman-profit').innerHTML = `<img src="images/profit-01.svg" alt=""> ${pacmanScore} +`;


            // Clear the Pacman score from localStorage
            localStorage.removeItem('pacmanScore');
        }

        let totalMoney = parseInt(localStorage.getItem('totalMoney')) || 0;
        let progressMoney = parseInt(localStorage.getItem('progressMoney')) || 0; // Деньги для прогресса
        const maxMoney = 5000;  // Максимальное значение для шкалы
        let clickValue = parseInt(localStorage.getItem('clickValue')) || 1;  // Изначальная прибыль за клик
        let upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 1000; // Изначальная стоимость улучшения
        let incomePerMinute = parseInt(localStorage.getItem('incomePerMinute')) || 0; // Изначальная прибыль в минуту
        let upgradeIncomeCost = parseInt(localStorage.getItem('upgradeIncomeCost')) || 1000; // Изначальная стоимость улучшения прибыли в минуту
        let cityCleaningIncomeCost = parseInt(localStorage.getItem('cityCleaningIncomeCost')) || 2000; // Изначальная стоимость улучшения прибыли на 8 в минуту
        let upgradeIncomeLevel = parseInt(localStorage.getItem('upgradeIncomeLevel')) || 0; // Изначальный уровень улучшения команды
        let cleaningIncomeLevel = parseInt(localStorage.getItem('cleaningIncomeLevel')) || 0; // Изначальный уровень улучшения уборки мусора
        let cityCleansingLevel = parseInt(localStorage.getItem('cityCleansingLevel')) || 0; // Изначальный уровень очищения города
        let incomeInterval;

        // Функция для сброса игры
        function resetGame() {
            localStorage.clear(); // Очищаем LocalStorage
            totalMoney = 0;
            progressMoney = 0;
            clickValue = 1;
            upgradeCost = 1000;
            incomePerMinute = 0;
            upgradeIncomeCost = 1000;
            cityCleaningIncomeCost = 2000;
            upgradeIncomeLevel = 0; // Сбрасываем уровень до 0
            cleaningIncomeLevel = 0; // Сбрасываем уровень уборки мусора до 0
            cityCleansingLevel = 0; // Сбрасываем уровень очищения города до 0

            // Обновляем все отображения после сброса
            updateTotalMoneyDisplay();
            updateProgress();
            updateClickValueDisplay();
            updateIncomePerMinuteDisplay();
            updateUpgradeButtons();
            updateIncomeLevelDisplay(); // Обновляем уровень команды
            updateCleaningIncomeLevelDisplay(); // Обновляем уровень уборки мусора
            updateCityCleansingLevelDisplay(); // Обновляем уровень очищения города
        }

        // resetGame()

        // Функция для открытия модального окна, если оно не открывалось сегодня
        function openModalOncePerDay() {
            const lastOpenedDate = localStorage.getItem('lastModalOpenedDate');
            const today = new Date().toLocaleDateString(); // Получаем текущую дату в формате "dd.mm.yyyy"

            if (lastOpenedDate !== today) {
                jQuery('#modal-01').addClass('modal-active');
                localStorage.setItem('lastModalOpenedDate', today); // Сохраняем текущую дату
            }
        }

        // Прочие существующие обработчики для закрытия модальных окон
        jQuery('.modal-close').on('click', function () {
            jQuery(this).closest('.modal-area').removeClass('modal-active');
        });

        // Функция для обновления уровня улучшения команды
        function updateIncomeLevelDisplay() {
            jQuery('#income-upgrade-level, #income-upgrade-level-clone').text(`Уровень: ${upgradeIncomeLevel}`);
        }

        // Функция для обновления уровня улучшения уборки мусора
        function updateCleaningIncomeLevelDisplay() {
            jQuery('#cleaning-income-level, #cleaning-income-level-clone').text(`Уровень: ${cleaningIncomeLevel}`);
        }

        // Функция для обновления уровня очищения города
        function updateCityCleansingLevelDisplay() {
            jQuery('#cleansing-city-income-level, #cleansing-city-income-level-clone').text(`Уровень: ${cityCleansingLevel}`);
        }

        // Функция для обновления отображения прибыли за клик
        function updateClickValueDisplay() {
            jQuery('#click-value-display').text(clickValue).append('<img src="images/profit-01.svg" alt="">');
            jQuery('#click-value-boosters').text(clickValue).append('<img src="images/profit-01.svg" alt="">');
        }

        // Функция для обновления суммы денег на всех страницах
        function updateTotalMoneyDisplay() {
            const totalMoney = parseInt(localStorage.getItem('totalMoney')) || 0;
            jQuery('#total-money').text(totalMoney);
            jQuery('#total-money-boosters').text(totalMoney).append('<img src="images/boosters-01.svg" alt="">');
        }
        
        window.addEventListener('storage', function(event) {
            if (event.key === 'totalMoney') {
                updateTotalMoneyDisplay();
            }
        });

        // Эта функция будет вызываться в конце мини-игры, чтобы обновить баланс
        function updateTotalMoneyDisplayFromGame(coinsEarned) {
            let totalMoney = parseInt(localStorage.getItem('totalMoney')) || 0;
            totalMoney += coinsEarned;
            localStorage.setItem('totalMoney', totalMoney);

            // Обновляем отображение
            updateTotalMoneyDisplay();
        }

        // Функция для обновления прибыли в минуту
        function updateIncomePerMinuteDisplay() {
            jQuery('#income-per-minute-display').text(incomePerMinute);
            jQuery('#income-per-minute-boosters').text(incomePerMinute).append('<img src="images/profit-01.svg" alt="">');
            jQuery('#income-per-minute-index').text(incomePerMinute).append('<img src="images/profit-01.svg" alt="">');
            jQuery('#income-per-minute-boosters-page').text(incomePerMinute).append('<img src="images/profit-01.svg" alt="">');
        }

        // Функция для обновления дней до выборов на обеих страницах
        function updateDaysToElection() {
            const electionDate = new Date('2024-09-08');
            const today = new Date();
            const timeDifference = electionDate.getTime() - today.getTime();
            const daysToElection = Math.ceil(timeDifference / (1000 * 3600 * 24));
            jQuery('#days-to-election').text(daysToElection);
            jQuery('#days-to-election-boosters').text(daysToElection);
        }

        // Функция для обновления шкалы прогресса
        function updateProgress() {
            const progressPercentage = (progressMoney / maxMoney) * 100;
            jQuery('.profit-item2-inner span').css('width', `${progressPercentage}%`);
            jQuery('.profit-item2 h3 span').text(`${progressMoney - 1}/${maxMoney}`);
        }

        // Сохранение данных в LocalStorage
        function saveToLocalStorage() {
            localStorage.setItem('totalMoney', totalMoney);
            localStorage.setItem('progressMoney', progressMoney);
            localStorage.setItem('clickValue', clickValue);
            localStorage.setItem('incomePerMinute', incomePerMinute);
            localStorage.setItem('upgradeCost', upgradeCost);
            localStorage.setItem('upgradeIncomeCost', upgradeIncomeCost);
            localStorage.setItem('cityCleaningIncomeCost', cityCleaningIncomeCost);
            localStorage.setItem('upgradeIncomeLevel', upgradeIncomeLevel);
            localStorage.setItem('cleaningIncomeLevel', cleaningIncomeLevel); // Сохраняем уровень уборки мусора
            localStorage.setItem('cityCleansingLevel', cityCleansingLevel); // Сохраняем уровень очищения города
            localStorage.setItem('currentDay', currentDay); // Сохраняем текущий день наград
            localStorage.setItem('lastLoginDate', today); // Сохраняем дату последнего входа
        }

        // Обновление отображения стоимости улучшения на кнопках и в блоке .boosters-item-inner3
        function updateUpgradeButtons() {
            jQuery('#upgrade-button').text(`${upgradeCost} `).append('<img src="images/modal-04.svg" alt=""> Улучшить');
            jQuery('#upgrade-button').attr('data-cost', upgradeCost);
            jQuery('#upgrade-income-button').text(`${upgradeIncomeCost} `).append('<img src="images/modal-04.svg" alt=""> Улучшить');
            jQuery('#upgrade-income-button').attr('data-cost', upgradeIncomeCost);
            jQuery('#city-cleaning-upgrade-button').text(`${cityCleaningIncomeCost} `).append('<img src="images/modal-04.svg" alt=""> Улучшить');
            jQuery('#city-cleaning-upgrade-button').attr('data-cost', cityCleaningIncomeCost);

            jQuery('.boosters-item-inner3 h3').each(function() {
                if ($(this).closest('.boosters-item-inner').find('p span').text().includes('8+')) {
                    $(this).text(`${cityCleaningIncomeCost} `).append('<img src="images/boosters-03.svg" alt="">');
                } else if ($(this).closest('.boosters-item-inner').find('p span').text().includes('2+')) {
                    $(this).text(`${upgradeIncomeCost} `).append('<img src="images/boosters-03.svg" alt="">');
                } else {
                    $(this).text(`${upgradeCost} `).append('<img src="images/boosters-03.svg" alt="">');
                }
            });
        }

        // Обработчик кликов по кнопке улучшения прибыли за тап
        jQuery('#upgrade-button').on('click', function (e) {
            e.preventDefault();
            let cost = parseInt(jQuery(this).attr('data-cost'));

            if (totalMoney >= cost) {
                totalMoney -= cost; // Списываем деньги
                clickValue += 1; // Увеличиваем прибыль за клик
                upgradeCost *= 2; // Увеличиваем стоимость улучшения
                upgradeIncomeLevel += 1; // Увеличиваем уровень на 1

                // Обновляем отображение
                updateTotalMoneyDisplay();
                updateClickValueDisplay();
                updateUpgradeButtons();
                updateIncomeLevelDisplay(); // Обновляем уровень
                saveToLocalStorage(); // Сохраняем изменения в LocalStorage
            } else {
                alert('Недостаточно денег для улучшения!');
            }
        });

        // Обработчик кликов по кнопке улучшения прибыли в минуту (+2)
        jQuery('#upgrade-income-button').on('click', function (e) {
            e.preventDefault();
            let cost = parseInt(jQuery(this).attr('data-cost'));

            if (totalMoney >= cost) {
                totalMoney -= cost; // Списываем деньги
                incomePerMinute += 2; // Увеличиваем прибыль в минуту на 2
                cleaningIncomeLevel += 1; // Увеличиваем уровень уборки мусора
                upgradeIncomeCost *= 2; // Увеличиваем стоимость улучшения

                // Обновляем отображение
                updateTotalMoneyDisplay();
                updateIncomePerMinuteDisplay();
                updateUpgradeButtons();
                updateCleaningIncomeLevelDisplay(); // Обновляем уровень уборки мусора
                saveToLocalStorage(); // Сохраняем изменения в LocalStorage
            } else {
                alert('Недостаточно денег для улучшения!');
            }
        });

        // Обработчик кликов по кнопке улучшения прибыли в минуту (+8) для очищения города
        jQuery('#city-cleaning-upgrade-button').on('click', function (e) {
            e.preventDefault();
            let cost = parseInt(jQuery(this).attr('data-cost'));

            if (totalMoney >= cost) {
                totalMoney -= cost; // Списываем деньги
                incomePerMinute += 8; // Увеличиваем прибыль в минуту на 8
                cityCleansingLevel += 1; // Увеличиваем уровень очищения города
                cityCleaningIncomeCost *= 2; // Увеличиваем стоимость улучшения

                // Обновляем отображение
                updateTotalMoneyDisplay();
                updateIncomePerMinuteDisplay();
                updateUpgradeButtons();
                updateCityCleansingLevelDisplay(); // Обновляем уровень очищения города
                saveToLocalStorage(); // Сохраняем изменения в LocalStorage
            } else {
                alert('Недостаточно денег для улучшения!');
            }
        });

        // Функция для равномерного добавления прибыли в минуту к общей сумме и увеличения прогресса
        // Функция для запуска начисления прибыли
        function startDistributingIncome() {
            incomeInterval = setInterval(function() {
                if (incomePerMinute > 0) {
                    const incomePerSecond = Math.floor(incomePerMinute / 60); // Основной доход за секунду
                    const additionalIncome = incomePerMinute % 60; // Остаток для распределения
                    totalMoney += incomePerSecond; // Добавляем основной доход
                    progressMoney += incomePerSecond; // Добавляем к прогрессу

                    // Распределяем остаток (один раз в минуту добавляется дополнительный доход)
                    if (Math.floor(Date.now() / 1000) % 60 < additionalIncome) {
                        totalMoney += 1;
                        progressMoney += 1;
                    }

                    updateTotalMoneyDisplay();
                    saveToLocalStorage();
                }
            }, 1000); // Обновляем каждую секунду
        }

        function stopDistributingIncome() {
            clearInterval(incomeInterval);
        }

        // Запуск начисления прибыли, когда страница загружена
        startDistributingIncome();

        // Останавливаем начисление при закрытии страницы
        $(window).on('beforeunload', function() {
            stopDistributingIncome();
        });

        // Останавливаем начисление, если пользователь переключается на другую вкладку
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopDistributingIncome();
            } else {
                startDistributingIncome();
            }
        });

        function handleTap() {
            if (progressMoney < maxMoney) {
                totalMoney += clickValue;
                progressMoney += clickValue;
                updateTotalMoneyDisplay();
                updateProgress();
                saveToLocalStorage();
            }

            if (progressMoney >= maxMoney) {
                clickValue += 1;
                progressMoney = 0; // Сбрасываем прогресс шкалы
                updateProgress();
                updateClickValueDisplay();
                saveToLocalStorage();
            }

            jQuery('#click-button').addClass('active');
            setTimeout(function() {
                jQuery('#click-button').removeClass('active');
            }, 200);
        }

        // Обработчик кликов по кнопке
        jQuery('#click-button').on('click', function () {
            handleTap();
        });

        // Добавляем поддержку касания двумя пальцами
        jQuery('#click-button').on('touchstart', function (e) {
            if (e.touches.length === 2) {
                handleTap();
            }
        });

        // Инициализация отображений и запуск распределения дохода
        updateClickValueDisplay();
        updateTotalMoneyDisplay();
        updateIncomePerMinuteDisplay();
        updateUpgradeButtons();
        updateDaysToElection(); // Обновляем дни до выборов
        updateIncomeLevelDisplay(); // Обновляем уровень команды при загрузке
        updateCleaningIncomeLevelDisplay(); // Обновляем уровень уборки мусора при загрузке
        updateCityCleansingLevelDisplay(); // Обновляем уровень очищения города при загрузке

        // Проверка и открытие модального окна один раз в день
        openModalOncePerDay();

        // Прочие существующие функции и обработчики
        jQuery('.modal-trigger').on('click', function () {
            const targetModal = jQuery(this).data('target');
            jQuery(`#${targetModal}`).addClass('modal-active');
        });

        jQuery('.modal-close').on('click', function () {
            jQuery(this).closest('.modal-area').removeClass('modal-active');
        });

        jQuery(".modal-01").click(function() {
            jQuery("#modal-01").addClass("modal-active");
        });

        jQuery(".modal-close").click(function() {
            jQuery("#modal-01").removeClass("modal-active");
        });

        jQuery(".modal-02").click(function() {
            jQuery("#modal-02").addClass("modal-active");
        });

        jQuery(".modal-close").click(function() {
            jQuery("#modal-02").removeClass("modal-active");
        });

        jQuery(".modal-item-inner ul li").on("click", function() {
            jQuery(".modal-item-inner ul li").children().removeClass("active");
            jQuery(this).children().addClass("active");
        });

        jQuery(function(){
            jQuery('.profit-item2-inner3').on("click", function () {
                jQuery('.profit-item2-inner3').addClass("active");
                setTimeout(RemoveClass, 200);
            });
            function RemoveClass() {
                jQuery('.profit-item2-inner3').removeClass("active");
            }
        });

        // Ежедневные награды
        let currentDay = parseInt(localStorage.getItem('currentDay')) || 1;
        const lastLoginDate = localStorage.getItem('lastLoginDate');
        const today = new Date().toLocaleDateString();

        // Проверяем, если игрок заходил вчера и текущий день не следующий по порядку, сбрасываем прогресс
        if (lastLoginDate && lastLoginDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (new Date(lastLoginDate).toLocaleDateString() !== yesterday.toLocaleDateString()) {
                resetDailyRewards();
            }
        }

        // Обновление интерфейса в зависимости от текущего дня
        updateRewardDisplay();

        // Обработчик нажатия на кнопку "Забрать"
        $('#claim-reward').on('click', function(e) {
            e.preventDefault();

            const currentReward = $(`.modal-item-inner2[data-day=${currentDay}]`).find('p').text();
            if (currentReward && currentDay <= 8) {
                totalMoney += parseInt(currentReward);
                updateTotalMoneyDisplay();
                saveToLocalStorage();

                // Переход к следующему дню
                currentDay++;
                localStorage.setItem('currentDay', currentDay);
                localStorage.setItem('lastLoginDate', today);

                // Обновляем отображение
                updateRewardDisplay();
            }

            // Проверка на максимальный день
            if (currentDay > 8) {
                resetDailyRewards();
            }
        });

        // Функция для сброса прогресса наград
        function resetDailyRewards() {
            currentDay = 1;
            localStorage.setItem('currentDay', currentDay);
            updateRewardDisplay();
        }

        // Функция для обновления интерфейса наград
        function updateRewardDisplay() {
            $('.modal-item-inner2').removeClass('active');
            $(`.modal-item-inner2[data-day=${currentDay}]`).addClass('active');
        }
    });
})(jQuery);
