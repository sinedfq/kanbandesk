## Канбан доска с регистрацией/авторизацией ##

<h3>Задание:</h3>

Разработать электронную версию канбан-доски с сохранением изменений в базу данных. Добавить возможность регистрации и редактрования профиля.

-----

<h3>Используемые технологии: </h3>

1. Django.
2. ReactJS.
3. HTML/CSS.
4. SQLite.
5. Node.js

------

<h3>Инстуркция по запуску: </h3>

1. Переходим в папку django-app.
```bash
cd django-app/
```
2. Делаем миграцию для корректной работы веб-приложения.
```bash
python manage.py migrate
```
3. Запускаем наш проект.
```bash
python manage.py runserver
```

*успешный запуск проекта

<div align = "center">
  
  ![image](https://github.com/user-attachments/assets/c3c0bcf9-a028-4cd0-9fe4-4b9dbfb3ee2d)
  
</div>

-----

<h3>Внешний вид запущенного проекта: </h3>

Главная страница:
![image](https://github.com/user-attachments/assets/e180accf-f791-4045-a295-d3ddf3543770)

Меню просмотра карточки: 

![image](https://github.com/user-attachments/assets/195c4c50-3f88-4053-bb8b-ece976ea7530)

Меню редактирования карточки:

![image](https://github.com/user-attachments/assets/e549be81-b8b8-46e9-bb02-ea23c684d52b)

Страница профиля:

![image](https://github.com/user-attachments/assets/d29d2eaa-aac1-484e-a817-84ea2a0ec10b)
![image](https://github.com/user-attachments/assets/d4ee3e44-02c2-4048-b119-7c3790036170)
![image](https://github.com/user-attachments/assets/474287b4-3210-42ba-a527-053d29f19fe7)

Уведомления, что пользователь не авторизован:
![image](https://github.com/user-attachments/assets/d2c577f6-96b6-4898-bc29-bbfd78fba30e)

![image](https://github.com/user-attachments/assets/91bd4f36-8cf6-4d67-8eb6-c48752b19dc4)


-----

<h3>Техническое описание:</h3>

models.py
```python
class Card(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    start_date = models.DateTimeField(null=True, blank=True)  # Новое поле
    end_date = models.DateTimeField(null=True, blank=True)    # Новое поле
    participants = models.ManyToManyField(User, related_name='cards')
    color = models.CharField(max_length=50, default="#fff")

    def __str__(self):
        return self.title

```
Class Card служит для объявления таблицы в базе данных с именем Card и с необходимым по заданию полями. <br><br>
На подобии данного учатска кода сделаны и остальные таблицы базы данных

----

views.py

```python 
@login_required
def profile(request):
    if request.method == 'POST':
        user_form = UpdateUserForm(request.POST, instance=request.user)
        profile_form = UpdateProfileForm(request.POST, request.FILES, instance=request.user.profile)
        
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Your profile is updated successfully')
            return redirect(to='users-profile')
    else:
        user_form = UpdateUserForm(instance=request.user)
        profile_form = UpdateProfileForm(instance=request.user.profile)

    # Получаем карточки, в которых участвует пользователь
    user_cards = Card.objects.filter(participants=request.user)

    # Получаем комментарии пользователя
    user_comments = Comment.objects.filter(user=request.user)

    return render(request, 'users/profile.html', {
        'user_form': user_form,
        'profile_form': profile_form,
        'user_cards': user_cards,
        'user_comments': user_comments,
    })
```
Views.py служит для сохранения изменений в базу данных с помощью ```GET``` и ```POST``` запросов. <br><br>
На данном учатске кода сохраняются изменения в профиле пользователя (аватар, био и т.д) <br>
По аналогии с этим кодом сделаны и остальные обработчики изменений

----

serializers.py

```python
class CardSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'board', 'participants', 'color']
        extra_kwargs = {
            'board': {'required': True},  # Убедитесь, что поле `board` является обязательным
        }
```
Сериализаторы в Django — это инструмент для преобразования сложных типов данных, таких как экземпляры модели Django, в типы данных Python, которые могут быть легко переведены в JSON, XML или другие типы контента<br><br>

В данном участке кода продемонстрирован сериализатор для класса Card, по аналогии с ним сделаны и остальные сериализаторы.

-----

urls.py

```python
router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'cards', CardViewSet)
router.register(r'users', UserViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', home, name='users-home'),
    path('api/', include(router.urls)),
    path('register/', RegisterView.as_view(), name='users-register'),
    path('profile/', profile, name='users-profile'),
    path('api/auth/check/', check_auth, name='check_auth'),
    path('api/get-username/<int:user_id>/', get_username, name='get_username'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```
Не мало важным объектом нашего проекта является ursl. В данном коде реализованы /api/ запросы к нашему проекту, из которых мы получаем всю необходимую информацию из БД

----

Также у нас имеются JSX файлы и компоненты<br><br>
CardDetails.jsx 
```javascript

export default function CardDetails(props) {
  const {
    card = { id: null, title: "", description: "", participants: [], start_date: null, end_date: null },
    bid,
    updateCard,
    removeCard,
    onClose,
  } = props;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null);  // Состояние для роли пользователя
  const [username, setUsername] = useState(null);  // Состояние для имени пользователя
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Загружаем авторизацию и проверяем статус
  useEffect(() => {
    fetch("/api/auth/check")
      .then(response => response.json())
      .then(data => {
        setIsAuthorized(data.isAuthenticated);
        setUserRole(data.role);  // Сохраняем роль пользователя
        setUsername(data.username);  // Сохраняем имя пользователя
        setShowCardDetailsModal(data.isAuthenticated);
      })
      .catch(error => console.error("Error fetching auth status:", error));
  }, []);

  // Загружаем комментарии для текущей карточки по её ID
  useEffect(() => {
    setComments([]);
    if (card.id) {
      fetch(`/api/comments/?card=${card.id}`)
        .then(response => response.json())
        .then(data => {
          setComments(data);
        })
        .catch(error => console.error("Error fetching comments:", error));
    }
  }, [card.id]);

  const handleClose = () => {
    setComments([]);
    onClose();
  };

  const handleDelete = () => {
    if (typeof removeCard === "function") {
      removeCard(bid, card.id);
    } else {
      console.error("removeCard is not a function");
    }

    setShowCardDetailsModal(false);
    setShowAuthModal(false);
    handleClose();
  };

  // Отправка нового комментария
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('authToken');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch("/api/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        card: card.id,
        comment: newComment,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setComments(prevComments => [...prevComments, data]);
        setNewComment("");
      })
      .catch(error => console.error("Error posting comment:", error));
  };

  // Проверка, является ли пользователь участником карточки
  const isParticipant = card.participants.includes(username);
  return (
    <>
      {isAuthorized && showCardDetailsModal && (
        <Modal onClose={handleClose} zIndex={1000}>
          <div className="modal-content">
            <div className="card-details-wrapper">
              <div className="cardDetails">
                <h2 className="card__view">Просмотр карточки</h2>
                <p><strong>Заголовок:</strong> {card.title}</p>
                <p><strong>Описание:</strong> {card.description}</p>
                <p><strong>Участники:</strong> {card.participants.join(", ")}</p>
                <p><strong>Дата начала:</strong> {card.start_date}</p>
                <p><strong>Дата окончания:</strong> {card.end_date}</p>

                {/* Показываем кнопку редактирования для админов, модераторов и участников карточки */}
                {(userRole === 'admin' || userRole === 'moderator' || isParticipant) && (
                  <button className="navigate__button" onClick={() => setShowEditModal(true)}>
                    Редактировать
                  </button>
                )}

                {/* Показываем кнопку удаления только для админов и модераторов */}
                {(userRole === 'admin' || userRole === 'moderator') && (
                  <button className="delete__button" onClick={handleDelete}>Удалить</button>
                )}  
              </div>

              <div className="comments-section">
                <h3>Комментарии</h3>
                <div className="comments-list">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="comment">
                        <strong>{comment.user || "Загрузка..."}:</strong> {comment.comment}
                        <br />
                        <small>{formatDate(comment.created_at)}</small>
                      </div>
                    ))
                  ) : (
                    <p>Нет комментариев</p>
                  )}
                </div>
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Добавить комментарий..."
                  />
                  <button type="submit">Отправить</button>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Второе модальное окно (CardEdit) */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)} zIndex={1100} closeOnClick={false}>
          <CardEdit 
            card={card} 
            onClose={() => setShowEditModal(false)} 
            updateCard={updateCard}
            bid={bid}
          />
        </Modal>
      )}

      {showAuthModal && (
        <Modal onClose={() => setShowAuthModal(false)} zIndex={1200}>
          <div className="auth-modal">
            <h2>Пожалуйста, авторизуйтесь</h2>
            <p>Вы должны быть авторизованы, чтобы просматривать карточки.</p>
            <button onClick={() => setShowAuthModal(false)}>Закрыть</button>
          </div>
        </Modal>
      )}
    </>
  );
}
```
Данный участок кода реализует компонент CardDetail, он служит за обратоку информации содержащейся в карточке. <br><br>
Комнонет вызвается только тогда, когда пользователь кликает на компонент Card, который находиться на доске. <br>
Все компоненты реализованы +- одинакого:
1. Сначала идут функции обработчики.
2. Далее идёт ```return``` который отображает всю необхоидую информацию.

-----

App.jsx 

В файле App.jsx реализованы обработчики всех событий канбан-доски (добавление новой доски/карточки, удаление или редактирование карточки и т.д.) <br>

```javascript
useEffect(() => {
  axios.all([
    axios.get('http://localhost:8000/api/boards/'),
    axios.get('http://localhost:8000/api/cards/')
  ])
  .then(axios.spread((boardsResponse, cardsResponse) => {
    const boardsData = boardsResponse.data;
    const cardsData = cardsResponse.data;

    const formattedData = boardsData.map(board => ({
      id: board.id,
      boardName: board.board_name,
      cards: cardsData
        .filter(card => card.board === board.id)
        .map(card => ({
          id: card.id,
          title: card.title,
          description: card.description,
          start_date: card.start_date || null,
          end_date: card.end_date || null,
          participants: card.participants.map(participant => participant.username),
          color: card.color || "#ffffff", // Загружаем цвет карточки
        })),
    }));

    setData(formattedData);
  }))
  .catch(error => {
    console.error('Ошибка загрузки данных!', error);
  });
}, []);
```

Данный же участок кода отрисосывает всю информацию при заходе пользователя на сайт.

```javascript
  const updateCard = (bid, cid, updatedCardData) => {
    console.log(`Updating card with ID: ${cid} in board with ID: ${bid}`);
    console.log('Updated Card Data:', updatedCardData);
  
    const boardIndex = data.findIndex((board) => board.id === bid);
    if (boardIndex === -1) {
      console.error(`Board with ID ${bid} not found.`);
      return;
    }
  
    const cardIndex = data[boardIndex].cards.findIndex((item) => item.id === cid);
    if (cardIndex === -1) {
      console.error(`Card with ID ${cid} not found in board ${bid}.`);
      return;
    }
  
    const updatedBoards = [...data];
    updatedBoards[boardIndex].cards[cardIndex] = {
      ...updatedBoards[boardIndex].cards[cardIndex],
      ...updatedCardData,
    };
    setData(updatedBoards);
  
    axios.put(`http://localhost:8000/api/cards/${cid}/`, updatedCardData)
      .then(() => {
        console.log(`Card with ID ${cid} successfully updated.`);
      })
      .catch(error => {
        console.error(`Failed to update card with ID ${cid}.`, error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      });
  };
```

Функция обновления инфомарции в карточке и запись в нашу БД<br>
Остальные функцию работают по той же схеме
