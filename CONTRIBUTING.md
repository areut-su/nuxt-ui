# Руководство по участию (Contributing)

Мы приветствуем любые улучшения, новые цветовые схемы и правки в документации.

## Как внести вклад

1. Сделайте **Fork** репозитория [`areut-su/nuxt-ui`](https://github.com/areut-su/nuxt-ui).
2. Создайте ветку для вашей задачи:
   ```bash
   git checkout -b feat/new-color-scheme
   ```
3. Установите зависимости и запустите проект локально:
   ```bash
   npm install
   npm run dev
   ```
4. Проверьте типы и сборку перед отправкой Pull Request:
   ```bash
   npm run lint
   npm run build
   ```
5. Отправьте **Pull Request** с кратким описанием изменений и, по возможности, скриншотом.

## Стандарты кода

- Строгая типизация TypeScript (`tsc --noEmit` без ошибок).
- Все новые цветовые палитры добавляются в `src/data/stylesRegistry.ts` с соблюдением контраста WCAG AA и светлыми сайдбарами для светлых тем (`isDark: false`).
- Используйте понятные сообщения коммитов в стиле Conventional Commits (`feat:`, `fix:`, `docs:`).
