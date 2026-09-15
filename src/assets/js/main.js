// Основной JS-файл лендинга.
// Два независимых блока: маска+валидация формы заявки на карту, и
// аккордеон FAQ. Оба работают полностью на клиенте, без обращения
// к серверу.
(function () {
  "use strict";

  /* --- Маска телефона: +998 90 123-45-67 -------------------------------
     Курсор всегда в конце (посимвольный ввод), поэтому простой пересчёт
     всей строки при каждом input достаточен и не требует отслеживания
     позиции курсора. */
  var phone = document.getElementById("fPhone");

  function maskPhone(value) {
    var digits = value.replace(/\D/g, "");
    if (digits.indexOf("998") !== 0) {
      digits = "998" + digits.replace(/^998/, "");
    }
    digits = digits.slice(0, 12);
    var rest = digits.slice(3);
    var out = "+998";
    if (rest.length) out += " " + rest.slice(0, 2);
    if (rest.length > 2) out += " " + rest.slice(2, 5);
    if (rest.length > 5) out += "-" + rest.slice(5, 7);
    if (rest.length > 7) out += "-" + rest.slice(7, 9);
    return out;
  }

  if (phone) {
    phone.addEventListener("input", function () {
      phone.value = maskPhone(phone.value);
    });
    phone.addEventListener("focus", function () {
      if (!phone.value.trim()) phone.value = "+998 ";
    });
  }

  /* --- Форма заявки на карту ---------------------------------------------
     ВАЖНО: бэкенда нет. Валидация — только на клиенте. При успехе форма
     просто скрывается и показывается статичный блок "успешно отправлено" —
     никакие данные никуда не уходят и нигде не сохраняются. */
  var form = document.getElementById("cardForm");
  var done = document.getElementById("formDone");

  function setFieldError(input, errorId, show) {
    var err = document.getElementById(errorId);
    if (err) err.classList.toggle("is-visible", show);
    input.setAttribute("aria-invalid", show ? "true" : "false");
  }

  if (form && done && phone) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("fName");
      var region = document.getElementById("fRegion");
      var district = document.getElementById("fDistrict");
      var phoneDigits = phone.value.replace(/\D/g, "");

      var invalid = {
        name: name.value.trim().length < 2,
        phone: phoneDigits.length !== 12,
        region: region.value === "",
        district: district.value.trim().length < 2,
      };

      setFieldError(name, "eName", invalid.name);
      setFieldError(phone, "ePhone", invalid.phone);
      setFieldError(region, "eRegion", invalid.region);
      setFieldError(district, "eDistrict", invalid.district);

      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // TODO: здесь будет реальная отправка на бэкенд (fetch на API),
      // когда он появится. Сейчас бэкенда нет — просто переключаем UI.
      form.style.display = "none";
      done.classList.add("is-visible");
      done.focus();
    });
  }

  /* --- Аккордеон FAQ -------------------------------------------------------
     Несколько панелей могут быть открыты одновременно (не закрываем
     остальные при открытии новой) — так проще и надёжнее: не нужно
     хранить/искать "текущую открытую" панель, каждая кнопка обрабатывает
     только свою панель независимо. */
  var faqButtons = document.querySelectorAll(".faq-item__q");
  faqButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.classList.toggle("is-open", !isOpen);
    });
  });
})();
