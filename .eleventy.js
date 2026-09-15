// Конфигурация Eleventy (11ty).
// Здесь настраиваем:
//  - passthrough copy для статических ассетов (изображения, шрифты, css, js) —
//    они копируются в билд как есть, без обработки шаблонизатором;
//  - директории входа/выхода сборки.
module.exports = function (eleventyConfig) {
  // Копируем папку с ассетами (логотип, шрифты, css, js) в выходную папку без изменений.
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
