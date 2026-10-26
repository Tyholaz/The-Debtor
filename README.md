# THE DEBTOR — лендінг + трейлер

Статичний сайт без збірки: HTML + CSS + JS, трейлер малюється на `<canvas>`.

## Структура

```
index.html          розмітка сторінки
css/style.css       усі стилі
js/assets.js        маніфест ресурсів (ключ -> шлях до файлу)
js/trailer.js       трейлер: симуляція геймплею, таймлайн, звук, ефекти
js/page.js          дрібні скрипти сторінки (анімація бити, клавіатура)
fonts/G.ttf         шрифт для заголовків
assets/images/      картинки (jpg/png)
assets/audio/       музика та звуки (mp3)
```

## Локальний запуск

Звук підвантажується через `fetch`, тому `index.html` не можна просто
відкрити подвійним кліком (`file://`). Запусти локальний сервер:

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
