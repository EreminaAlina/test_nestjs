
## Описание

Сервис для бронирования автомобилей, рассчёта стоимости и получения статистики бронирования.


### Доступные методы:
><b>Проверить доступен ли автомобиль: <br>
> <b>GET
>http://localhost:3000/rent/available/{:id}
<br>где id - id машины (String)
> 
><b>Произвести расчёт стоимости аренды автомобиля за период: <br>
><b>GET
> http://localhost:3000/rent/calculate?{startDate}&{endDate}
> <br>где startDate - начало периода (Date), endDate - конец периода (Date)
>
><b>Произвести расчёт стоимости аренды автомобиля за период: <br>
><b>POST
> http://localhost:3000/rent
> <br> <b> BODY: <br>
> {carId - id машины (String), startDate - начало аренды (Date), endDate - конец аренды (Date)}
> 
><b>Скачать файл(xlsx) с отчётом средней загрузки автомобилей за месяц, по каждому авто и
итогом по всем автомобилям. (автомобиль(госномер), % дней в аренде за месяц <br>
><b>GET
> http://localhost:3000/rent/report?{month}&{year}
> <br> где month - номер месяца (Number), year - год (Number)
## Установка

Для работы с проектом необходимо установить [Postgres](https://www.postgresql.org/download/) и [Node.js](https://nodejs.org/en) (>= 8.9.0)
После установки Postgres зайти в SQL Shell и прописать следующие данные для взаимодействия с бд:
- Server: localhost (default)
- Database: postgres (default)
- Port: 5432 (default)
- Username: postgres (default)
- Password: password

### Скопировать репозиторий
```bash
$ git clone https://github.com/EreminaAlina/test_nestjs.git
```

## Запуск приложения

```bash
npm run install
npm run start:dev
```
### Docker
```bash
docker compose up
```

По умолчанию сервер запускается на порту 3000

### Примечание
Т.к. в задании не требовалось создать роут для создания машин, 
для корректной работы сервиса, при запуске приложения автоматически 
создаётся 5 машин в БД в таблице cars