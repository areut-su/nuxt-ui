# Vue & Nuxt Admin Dashboard Showcase

[![License: MIT](https://img.shields.io/badge/License-MIT-16a34a.svg?style=flat-square)](./LICENSE)
[![Templates](https://img.shields.io/badge/Templates-5%20Styles-0f172a.svg?style=flat-square)](#сравнительная-матрица-дизайн-систем)
[![Color Schemes](https://img.shields.io/badge/Color%20Schemes-14%20Global%20Themes-2563eb.svg?style=flat-square)](#возможности-витрины)
[![Nuxt Compatible](https://img.shields.io/badge/Target-Nuxt%203%20%2F%204%20%26%20Vue%203-00dc82.svg?style=flat-square)](#сравнительная-матрица-дизайн-систем)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6.svg?style=flat-square)](./tsconfig.json)

Интерактивная витрина пяти открытых MIT-дизайн-систем административных панелей экосистемы **Vue / Nuxt** с отдельными полноэкранными страницами, единым переключателем из **14 цветовых схем**, многоуровневым боковым меню с подпунктами и таблицами **Data Grid** (поиск в селектах, чекбоксы, CRUD, сортировка и пагинация).

---

## Сравнительная матрица дизайн-систем

Оценки размера бандла (JS + CSS в `gzip`) и потребления памяти (JS Heap в браузере) приведены для типового production-экрана дашборда (сайдбар + KPI + график + таблица с пагинацией).

| # | Шаблон | Лицензия | Библиотеки (зависимости) | Размер бандла (gzip) | Память (RAM / Heap) | Архитектура и плотность | Итог для Nuxt |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **Nuxt Shadcn Admin Dashboard**<br>`arhamkhnz/nuxt-shadcn-admin-dashboard` | ![MIT](https://img.shields.io/badge/MIT-16a34a.svg?style=flat-square) | **18–25 пакетов**<br>`reka-ui`, `@tanstack/vue-table`, `unovis`, `vee-validate`, `zod`, `@vueuse/core` | **~145–190 КБ** | **~45–65 МБ** | `SidebarInset`, средняя плотность, радиусы `10–12px` | Тяжёлый старт (много демо) |
| **02** | **Shadcn Dashboard Nuxt**<br>`Miguel-Domingos/shadcn-dashboard` | ![MIT](https://img.shields.io/badge/MIT-16a34a.svg?style=flat-square) | **10–14 пакетов**<br>`radix-vue`, `tailwindcss`, `cva`, `clsx`, `hugeicons` | **~85–115 КБ** | **~30–45 МБ** | `Flush Sidebar`, компактная плотность, радиусы `8px` | Средний вес |
| **03** | **Shadcn-Vue Official Blocks**<br>`shadcn-vue.com/blocks` (`dashboard-01`) | ![MIT](https://img.shields.io/badge/MIT-16a34a.svg?style=flat-square) | **6–9 пакетов**<br>`reka-ui`, `lucide-vue-next`, `@tanstack/vue-table` | **~55–80 КБ** | **~22–35 МБ** | `Grouped AppSidebar`, сбалансированная, радиусы `8–10px` | Минимальный вес (ручная сборка) |
| **04** | **AdminLTE 4 Vue / Nuxt**<br>`ColorlibHQ/adminlte-vue` | ![MIT](https://img.shields.io/badge/MIT-16a34a.svg?style=flat-square) | **8–12 пакетов**<br>`bootstrap 5.3`, `@popperjs/core`, `admin-lte`, `overlayscrollbars` | **~130–175 КБ** | **~40–60 МБ** | `Classic Enterprise` + `Control Sidebar`, высокая плотность, радиусы `4–6px` | Тяжеловесный (Bootstrap) |
| **05** | **Nuxt UI v3 Dashboard**<br>`nuxt-ui-templates/dashboard` | ![MIT](https://img.shields.io/badge/MIT-16a34a.svg?style=flat-square) | **1 модуль (`@nuxt/ui`)**<br>внутри `reka-ui`, `tailwindcss v4`, `@iconify`, `@tanstack/vue-table` с tree-shaking | **~65–95 КБ** | **~25–38 МБ** | `UDashboardGroup`, воздушная плотность, радиусы `8–10px` | **Оптимально для Nuxt** |

---

## Возможности витрины

- **5 отдельных полноэкранных страниц** (`#/nuxt-shadcn`, `#/miguel-shadcn`, `#/shadcn-blocks`, `#/adminlte-vue`, `#/nuxt-ui`) с быстрым переключением в верхней панели и по `⌘K` / `Ctrl+K`.
- **14 общих цветовых схем** (8 светлых и 6 тёмных) с синхронным применением ко всем пяти стилям, светлыми сайдбарами и светлой шапкой в светлых темах.
- **Боковое меню с раскрывающимися подпунктами** во всех пяти шаблонах.
- **Полноценный Accounts & Subscriptions Grid** в каждом стиле:
  - Режимы **Table** и **Card Grid**;
  - Мультиселекты с **поиском внутри списка** и **чекбоксами** (`Plan`, `Region`, `Country`);
  - Чекбоксы статусов (`Active`, `Pending`, `Past Due`) и фильтра `MRR ≥ $1,000`;
  - Создание (`New Account`), редактирование, удаление с отменой (`Undo`) и массовое удаление;
  - Сортировка по колонкам и пагинация (`5 / 8 / 12` строк на странице).

---

## Локальный запуск

```bash
npm install
npm run dev
```

Сборка production-бандла:

```bash
npm run build
```

---

## Лицензия

Проект и все представленные в витрине дизайн-системы распространяются под свободной лицензией **[MIT](./LICENSE)** — разрешено коммерческое использование, модификация и распространение.
