import { useEffect, useState } from "react"
import { Grid, Card, Input, Button } from "semantic-ui-react"

import useFetch from "../../hooks/useFetch"
import CafeTodoItem from "./CafeTodoItem"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const CafeTodoList = (props) => {
  const cafeAuth = sessionStorage.getItem("cafeAuth")

  // Todo 리스트 서버에 요청하기
  const [todos, setTodos] = useState([])
  const { data: todosList, sendRequest: getTodos } = useFetch()
  const { data: submitedData, sendRequest: submitTodo } = useFetch()

  const todayDate = new Date()
  const selectedDate = props.selectedDate

  const fullDate = (date) => {
    const yyyy = date.getFullYear()
    const mm = date.getMonth() + 1
    const dd = date.getDate()
    return yyyy * 10000 + mm * 100 + dd
  }

  useEffect(() => {
    // 서버 API 요청 보내기
    getTodos({
      url: `${DEFAULT_REST_URL}/todaycafe/main/todo/feed?visitedAt=${fullDate(
        selectedDate
      )}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
  }, [selectedDate])

  useEffect(() => {
    if (todosList !== null) {
      setTodos(todosList.reverse())
    } else if (todosList === null) {
      setTodos([])
    }
  }, [todosList, submitedData])

  // 할일 추가 input 태그에 입력된 내용
  const [enteredTodo, setEnteredTodo] = useState("")

  // 할일 추가 input 태그 변경내용 반영
  const inputChangeHandler = (event) => {
    setEnteredTodo(event.target.value)
  }

  // 할일 추가 버튼
  const submitHandler = async () => {
    if (enteredTodo === "") {
      alert("내용을 입력하셔야 합니다...")
    } else {
      await submitTodo({
        url: `${DEFAULT_REST_URL}/todaycafe/main/todo`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: {
          eventType: 1,
          content: enteredTodo,
          visitedAt: fullDate(todayDate),
          isComplete: false,
        },
      })
      setEnteredTodo("")
      await getTodos({
        url: `${DEFAULT_REST_URL}/todaycafe/main/todo/feed?visitedAt=${fullDate(
          selectedDate
        )}`,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      submitHandler(event)
    }
  }

  // 할일 체크 토글
  const toggleHandler = async (toggledTodoId) => {
    await submitTodo({
      url: `${DEFAULT_REST_URL}/todaycafe/main/todo`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        eventType: 3,
        todoId: toggledTodoId,
        content: todos.find((todo) => todo.id === toggledTodoId).content,
        visitedAt: fullDate(todayDate),
        isComplete: todos.find((todo) => todo.id === toggledTodoId).complete,
      },
    })
    await getTodos({
      url: `${DEFAULT_REST_URL}/todaycafe/main/todo/feed?visitedAt=${fullDate(
        selectedDate
      )}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
  }

  const deleteHandler = async (deletedTodoId) => {
    await submitTodo({
      url: `${DEFAULT_REST_URL}/todaycafe/main/todo`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        eventType: 4,
        todoId: deletedTodoId,
        visitedAt: fullDate(todayDate),
      },
    })
    await getTodos({
      url: `${DEFAULT_REST_URL}/todaycafe/main/todo/feed?visitedAt=${fullDate(
        selectedDate
      )}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
  }

  return (
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Card.Group>
            {fullDate(todayDate) === fullDate(selectedDate) && (
              <Card fluid>
                <Card.Content extra>
                  <Input
                    placeholder="할일 추가..."
                    value={enteredTodo}
                    onChange={inputChangeHandler}
                    style={{ width: "calc(100% - 50px)" }}
                    disabled={cafeAuth === "0" || cafeAuth === null}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    icon="add"
                    floated="right"
                    onClick={submitHandler}
                    disabled={cafeAuth === "0" || cafeAuth === null}
                    color="brown"
                  />
                </Card.Content>
              </Card>
            )}
            {todos &&
              todos.map((todo) => (
                <CafeTodoItem
                  key={todo.id}
                  id={todo.id}
                  content={todo.content}
                  isCompleted={todo.complete}
                  toggleHandler={toggleHandler}
                  deleteHandler={deleteHandler}
                />
              ))}
          </Card.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default CafeTodoList
