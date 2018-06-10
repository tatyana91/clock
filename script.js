'use strict';

//Таймзоны
let timezone = {
  'ST': ["-11", "(UTC -11) ST Самоаское время"],
  'HAST': ["-10", "(UTC -10) HAST Гавайско-Алеутское время"],
  'AKT': ["-9", "(UTC -9) AKT Аляскинское время"],
  'MT': ["-7", "(UTC -7) MT Горное время"],
  'СST': ["-6", "(UTC -6) СST Центральноамериканское время"],
  'PET': ["-5", "(UTC -5) PET Перуанское время, EST Североамериканское восточное время"],
  'AST': ["-4", "(UTC -4) AST Атлантическое время, ChT Чаморсское время (Гуам)"],
  'NST': ["-3.5", "(UTC -3:30) NST Ньюфаундлендское время"],
  'ART': ["-3", "(UTC -3) ART Аргентинское время, PMST Сен-Пьер-и-Микелонское время"],
  'GMT': ["0", "(UTC +0) GMT Среднее время по Гринвичу, UTC Всемирное координированное время, WET Западноевропейское время"],
  'CET': ["1", "(UTC +1) CET Центральноевропейское время, WAT Западноафриканское время"],
  'CAT': ["2", "(UTC +2) CAT Центральноафриканское время, EET Восточноевропейское время, IST Израильское время"],
  'MSK': ["3", "(UTC +3) MSK Московское время, EAT Восточноафриканское время, FET Восточное время"],
  'IRST': ["3.5", "(UTC +3:30) IRST Иранское время"],
  'PKT': ["5", "(UTC +5) PKT Пакистанское время"],
  'IST': ["5.5", "(UTC +5:30) IST Индийское время, SLT Шри-Ланкийское время"],
  'BDT': ["6", "(UTC +6) BDT Бангладешское время, BTT Бутанское время, GALT Галапагосское время"],
  'MST': ["6.5", "(UTC +6:30) MST Мьянмское время"],
  'CXT': ["7", "(UTC +7) CXT Рождественское островное время, THA Таиландское время"],
  'AWST': ["8", "(UTC +8) AWST Западноавстралийское время, HKT Гонконгское время, PHT Филиппинское время, PST Тихоокеанское время, SST Сингапурское время"],
  'JST': ["9", "(UTC +9) JST Японское время"],
  'ACST': ["9.5", "(UTC +9:30) ACST Центральноавстралийское время"],
  'AEST': ["10", "(UTC +10) AEST Восточноавстралийское время"],
  'NFT': ["11", "(UTC +11) NFT Норфолкское островное время"]
};

//Заполняем селект таймзоны
let timezoneSelect = document.querySelector('#timezone');
let selectOptions = "";
for (let zone in timezone) {
  selectOptions += `<option value="${timezone[zone][0]}">${timezone[zone][1]}</option>`;
}
timezoneSelect.innerHTML = selectOptions;

//Обрабатываем изменение таймзоны
timezoneSelect.onchange = function() {
  let diff = this.value;
  clock.stopClock();
  clock.startClock(diff);
};

//Стрелки часов, верстка
let clockDials = "";
for (let i = 1; i <= 12; i++) {
  clockDials += `<div class="dial dial-${i}"></div>`;
}
for (let j = 1; j <= 59; j++) {
  clockDials += `<div class="subdial subdial-${j}"></div>`;
}
clockDials += `<div class="hands">
                  <div id="hour-hand" class="hand"></div>
                  <div id="min-hand" class="hand"></div>
                  <div id="sec-hand" class="hand"></div>
              </div>`;
let clockCircle = document.querySelector('#clock-dial-circle');
clockCircle.innerHTML = clockDials;

//Объект Часы
let clock;
clock = {
  timer: '',
  dateNow: new Date(),
  tzOffset: '',
  startClock: function(tzOffset = 0) {
    this.getTZOffset(tzOffset);
    this.timer = setInterval(this.render.bind(this), 1000);
  },
  getTZOffset: function(tzOffset) {
    if (tzOffset === 0) {
      this.tzOffset = -this.dateNow.getTimezoneOffset() / 60;
      document.querySelector("option[value='" + this.tzOffset + "']").selected = true;
    } else {
      this.tzOffset = tzOffset;
    }
  },
  getNewDateTz: function() {
    let offsetMinutes = this.tzOffset * 60;
    let dateNow = new Date();
    dateNow.setUTCMinutes(dateNow.getUTCMinutes() + offsetMinutes);
    dateNow = dateNow.toISOString().split('T')[1].split('.')[0].split(':');
    return dateNow;
  },
  render: function() {
    let [handHour, handMinute, handSecond] = document.querySelectorAll('.hand');
    let [dateTzHour, dateTzMin, dateTzSec] = this.getNewDateTz();

    handHour.style.transform = `rotate(${dateTzHour * 30 + dateTzMin / 2}deg`;
    handMinute.style.transform = `rotate(${dateTzMin * 6 + dateTzSec / 10}deg)`;
    handSecond.style.transform = `rotate(${dateTzSec * 6}deg)`;
  },
  stopClock: function() {
    clearInterval(this.timer);
  }
};

//Запускаем часы
clock.startClock();

//Остановить часы
let clockStopBtn = document.querySelector('#stop');
clockStopBtn.onclick = function() {
  clock.stopClock();
  document.querySelector('#stop').remove();
  document.querySelector('#timezone').disabled = true;
  document.querySelector('#start').style.display = 'block';
}

//Обновить страницу
let clockStartBtn = document.querySelector('#start');
clockStartBtn.onclick = function() {
  location.reload();
}