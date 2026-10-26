# THE DEBTOR — лендінг + трейлер

Статичний сайт без збірки: HTML + CSS + JS, трейлер малюється на `<canvas>`.

## Структура

```
index.html          розмітка сторінки
css/style.css       усі стилі
js/assets.js        маніфест ресурсів (ключ -> шлях до файлу)
js/trailer.js       (тільки для trailer-dev.html) движок трейлера на canvas
js/page.js          дрібні скрипти сторінки (анімація бити, клавіатура)
fonts/G.ttf         шрифт для заголовків
assets/images/      картинки (jpg/png)
assets/audio/       музика та звуки (потрібні лише для рендеру трейлера)
assets/video/       trailer.mp4 — готовий трейлер, його показує сайт
trailer-dev.html    канвасна версія трейлера (джерело для рендеру)
tools/render_trailer.py  рендер trailer-dev.html -> assets/video/trailer.mp4
```

## Локальний запуск

Краще дивитись через локальний сервер (а `trailer-dev.html` — тільки так):

```
python3 -m http.server 8000
```

і відкрий http://localhost:8000

## Публікація на GitHub Pages

1. Залий файли в репозиторій (корінь репозиторію = ця папка).
2. Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`.
3. Через хвилину сайт буде на `https://<user>.github.io/<repo>/`.

## TODO

- У `index.html` в блоці `#preorder` заміни `href="#"` на посилання на сторінку Steam.

## Завантаження гри (GitHub Releases)

Файли гри не кладемо в репозиторій (ліміт 100 МБ на файл). Натомість:

1. Запакуй білд у `THE-DEBTOR.zip`.
2. Репозиторій → Releases → Draft a new release → тег `v1.0` → перетягни zip
   у «Attach binaries» (до 2 ГБ) → Publish release.
3. У `index.html` заміни `YOUR_USER/YOUR_REPO` на свої. Ім'я файлу в посиланні
   має збігатися з ім'ям у релізі. Посилання `releases/latest/download/...`
   завжди веде на останню версію.

## Перерендер трейлера

Змінив `trailer-dev.html` / `js/trailer.js`? Потрібні python, playwright (chromium),
ffmpeg, numpy: `python3 tools/render_trailer.py` перезбере `assets/video/trailer.mp4`.
