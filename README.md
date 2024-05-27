## Канбан доска с регистрацией/авторизацией ##

для запуска проекта перейдите в папку с проектом на Django через консоль (cmd):
1. python.exe manage.py migrate
2. python.exe manage.py runserver

для обновления функционала доски нужно:
1. перейти в папку с канбан доской
2. сделать билд через npm run build
3. перенести файлы из папки dist в папку static/react в папке с проектом django
4. Изменить пути в файле index.html (добавить точки)


## Внешний вид запущенного проекта ##

![image](https://github.com/sinedfq/kanbandesk/assets/99001435/86a88fb9-c547-40d2-a2b7-6aaf1468e0b3)

<div align = "center"> Внешний вид сайта (не конечный) </div>

## Последние обновления ##

### 
![image](https://github.com/sinedfq/kanbandesk/assets/99001435/e6a25a6b-94a9-4d46-9730-44733458b188)
<div align = "center"> Добавление новый таблиц в базе данных для Board и Card </div>
###

![image](https://github.com/sinedfq/kanbandesk/assets/99001435/58f1085b-6b30-4fad-820c-90df23bf5c4f)

<div align = "center"> Добавление карточек на доску с записью в БД </div>

![image](https://github.com/sinedfq/kanbandesk/assets/99001435/a00a1358-4fac-46ea-8a55-660ed210e142)

<div align = "center"> Внутренний вид карточки из БД </div>



### Последние обновления ###

#1 - В проект Django были добавление статические файлы проекта JS React <br>
#2 - Обновлено создание базы данных <br>
#3 - Добавлена запись и удаление доски в базу данных <br>
#4 - Добавлена новая ветка first <br>
#5 - Добавлено создание, отображение и запись новых карточек <br>
