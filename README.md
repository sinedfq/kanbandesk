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


# Последние обновления #

#1 - В проект Django были добавление статические файлы проекта JS React
#2 - Обновлено создание базы данных
#3 - Добавлена запись и удаление доски в базу данных
