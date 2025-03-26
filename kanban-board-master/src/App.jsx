import { useEffect, useState } from "react";
import axios from 'axios';
import "./App.css";
import Navbar from "../components/Navbar/Navbar";
import Board from "../components/Board/Board";
import { DragDropContext } from "react-beautiful-dnd";
import Editable from "../components/Editable/Editable";
import useLocalStorage from "use-local-storage";
import "../bootstrap.css";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function App() {
  const [data, setData] = useState([]);
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', role: '' });

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/check/', {
        withCredentials: true // Для передачи куки
      });

      if (response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUserInfo({
          username: response.data.name,
          role: response.data.role
        });
      } else {
        setIsAuthenticated(false);
        setUserInfo({ username: '', role: '' });
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      setIsAuthenticated(false);
      setUserInfo({ username: '', role: '' });
    }
  };

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
              color: card.color || "#ffffff",
            })),
        }));

        setData(formattedData);
      }))
      .catch(error => {
        console.error('Ошибка загрузки данных!', error);
      });
  }, []);

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const setName = (title, bid) => {
    if (!isAuthenticated) {
      toast.error("Для изменения названия доски необходимо авторизоваться");
      return;
    }

    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
    axios.put(`http://localhost:8000/api/boards/${bid}/`, { board_name: title })
      .catch(error => console.error('There was an error!', error));
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].cards.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].cards[source.index]
    );
    tempData[sourceBoardIdx].cards.splice(source.index, 1);

    return tempData;
  };

const addCard = (title, bid) => {
  if (!isAuthenticated) {
    toast.error("Для добавления карточек необходимо авторизоваться");
    return;
  }
  
  const index = data.findIndex((item) => item.id === bid);
  if (index < 0) return;

  const currentDate = new Date();
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);

  const newCard = {
    title: title,
    description: "No description",
    board: bid,
    start_date: currentDate.toISOString(),
    end_date: nextDay.toISOString(),
    color: "#ffffff"
  };
  console.log(userInfo.username);
  axios.post('http://localhost:8000/api/cards/', newCard)
    .then(response => {
      // После успешного создания добавляем карточку с обновленными данными
      const createdCard = {
        ...response.data,
        color: response.data.color || "#ffffff"
      };
      
      const tempData = [...data];
      tempData[index].cards.push(createdCard);
      setData(tempData);
      
      toast.success("Карточка успешно создана и отправлена на модерацию!");
    })
    .catch(error => {
      toast.error("Ошибка при создании карточки");
      console.error('There was an error!', error);
    });
};

  const removeCard = (boardId, cardId) => {
    if (!isAuthenticated) {
      toast.error("Для удаления карточек необходимо авторизоваться");
      return;
    }

    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].cards.findIndex((item) => item.id === cardId);

    tempData[index].cards.splice(cardIndex, 1);
    setData(tempData);
    axios.delete(`http://localhost:8000/api/cards/${cardId}/`)
      .catch(error => console.error('There was an error!', error));
  };

  const addBoard = (title) => {
    if (!isAuthenticated) {
      toast.error("Для добавления досок необходимо авторизоваться");
      return;
    }

    axios.post('http://localhost:8000/api/boards/', { board_name: title })
      .then(response => {
        const newBoard = {
          id: response.data.id,
          boardName: response.data.board_name,
          cards: []
        };
        setData(prevData => [...prevData, newBoard]);
      })
      .catch(error => {
        console.error('There was an error!', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      });
  };

  const removeBoard = (bid) => {
    if (!isAuthenticated) {
      toast.error("Для удаления досок необходимо авторизоваться");
      return;
    }

    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
    axios.delete(`http://localhost:8000/api/boards/${bid}/`)
      .catch(error => console.error('There was an error!', error));
  };

  const onDragEnd = (result) => {
    if (!isAuthenticated) {
      toast.error("Для перемещения карточек необходимо авторизоваться");
      return;
    }

    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    const sourceBoardIdx = data.findIndex(board => board.id.toString() === source.droppableId);
    const destBoardIdx = data.findIndex(board => board.id.toString() === destination.droppableId);

    if (sourceBoardIdx === -1 || destBoardIdx === -1) return;

    const sourceBoard = data[sourceBoardIdx];
    const destBoard = data[destBoardIdx];

    const [movedCard] = sourceBoard.cards.splice(source.index, 1);
    destBoard.cards.splice(destination.index, 0, movedCard);
    movedCard.board = destBoard.id;

    setData([...data]);

    // Получаем CSRF токен из куки
    const csrfToken = document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    axios.put(`http://localhost:8000/api/cards/${movedCard.id}/`, movedCard, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
      .catch(error => {
        console.error('There was an error!', error);
        // Откатываем изменения, если запрос не удался
        const updatedData = [...data];
        updatedData[sourceBoardIdx].cards.splice(source.index, 0, movedCard);
        updatedData[destBoardIdx].cards.splice(destination.index, 1);
        setData(updatedData);
      });
  };

  const updateCard = (bid, cid, updatedCardData) => {
    if (!isAuthenticated) {
      toast.error("Для изменения карточек необходимо авторизоваться");
      return;
    }

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

  const updateCardDate = (bid, cid, startDate) => {
    if (!isAuthenticated) {
      toast.error("Для изменения дат карточек необходимо авторизоваться");
      return;
    }

    const boardIndex = data.findIndex((item) => item.id === bid);
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
      start_date: startDate,
      board: bid,
    };
    setData(updatedBoards);

    axios.put(`http://localhost:8000/api/cards/${cid}/`, {
      ...updatedBoards[boardIndex].cards[cardIndex],
      start_date: startDate,
    })
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

  const updateCardEndDate = (bid, cid, endDate) => {
    if (!isAuthenticated) {
      toast.error("Для изменения дат карточек необходимо авторизоваться");
      return;
    }

    const boardIndex = data.findIndex((item) => item.id === bid);
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
      end_date: endDate,
      board: bid,
    };
    setData(updatedBoards);

    axios.put(`http://localhost:8000/api/cards/${cid}/`, {
      ...updatedBoards[boardIndex].cards[cardIndex],
      end_date: endDate,
    })
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

  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(data));
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={"light"}>
        <Navbar
          switchTheme={switchTheme}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          checkAuthStatus={checkAuthStatus}
        />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === "dark" ? "dark" : "light"}
        />
        <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.cards.map(card => ({
                  ...card,
                  start_date: card.start_date || null,
                  end_date: card.end_date || null,
                  participants: card.participants || []
                }))}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                updateCard={(bid, cid, updatedCardData) => updateCard(bid, cid, updatedCardData)}
                updateCardDate={updateCardDate}
                updateCardEndDate={updateCardEndDate}
                removeBoard={removeBoard}
                isAuthenticated={isAuthenticated}
                currentUser={userInfo.username}
              />
            ))}
            {isAuthenticated && (
              <Editable
                class={"add__board"}
                name={"Добавить столбец"}
                btnName={"Добавить"}
                onSubmit={addBoard}
                placeholder={"Введите заголовок столбца"}
              />
            )}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;