# Project setup

[node v 16.13.0](https://nodejs.org/en/blog/release/v16.13.0)
https://github.com/coreybutler/nvm-windows/releases

## Смена версии с nvm

```sh
# установить, если нет версии 16.13.0
nvm install 16.13.0
nvm use 16.13.0
```

## Установка зависимостей

```sh
yarn
```

## Деплой на сервер

1) Открыть нужный сервер в FileZilla
2) Собрать проект с пререндером

Легкий (быстрый) пререндер:

```sh
# для русского сайта
yarn prerender:light --lang=ru

# для английского сайта
yarn prerender:light --lang=eu
```

Пререндер всех прошивок:

```sh
# для русского сайта
yarn prerender --lang=ru

# для английского сайта
yarn prerender --lang=eu
```

3) Перенести все файлы из dist в корневую папку на сервере. Папки img и fonts можно не переносить каждый раз, так как они очень большие.
4) Перенести все файлы и папки из папки prerendered

### Dev mode
```sh
yarn serve
```

### build for production
```sh
yarn build --lang=ru
```

### build for test without prerender
```sh
yarn test
```

### build with prerender (without stock)
```sh
yarn prerender:light --lang=ru
yarn prerender:light --lang=eu
```

### build with prerender for entire project
```sh
yarn prerender --lang=ru
```



Порядок в котором нужно копировать файлы важен
d:\its-education-front\mmc-flash\AutoChip\vue\dist\
d:\its-education-front\mmc-flash\AutoChip\vue\prerendered\

**FileZilla: mmcflash.eu**
```yml
host: 46.36.217.114
login: elizaveta
password: f1T7pnjxonjdS7Eu
```

**FileZilla: mmcflash.ru**

```yml
host: ftp.mmcflash.nichost.ru
login: mmcflash_its
password: dNQcAA7_
```


## Deploy on prod
1) Build via yarn `prerender:light --lang=ru` or `yarn prerender --lang=ru` 
2) Copy /dist and /prerendered to e:\wwroot\AutoChip\vue\ after build via yarn `prerender:light --lang=ru` or `yarn prerender --lang=ru` 
3) Run script `ftpmmc-not-img.cmd` which is in e:\Script\ directory or `ftpmmc.cmd` if you add new images to public

for eu version you need to copy all in /prerender folder to root directory and /dist same way
for ru version all as for eu. But you need to create /ru folder and copy there all from /prerendered folder for back compatibility 

## Deploy on dev
1) Build via `yarn test`
2) Copy /dist to e:\testsite\AutoChip\vue\ after build via `yarn test`

You should awoid use prod build for test site due to it hasn't SEO preventions

If you haven't permition for deloy on dev server, just ask a who has it and indicate a branch

