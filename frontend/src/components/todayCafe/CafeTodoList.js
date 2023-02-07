import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { todoActions } from "../../store/todo"
import { Grid, Card, Input, Button } from "semantic-ui-react"

import useFetch from "../../hooks/useFetch"
import CafeAuthFetch from "../certificate/cafeAuth/CafeAuthFetch"

import CafeTodoItem from "./CafeTodoItem"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const CafeTodoList = () => {
  const isAuthenticated = sessionStorage.getItem("cafeAuth")
  
  // Todos 리덕스에 저장하는 경우
  const dispatch = useDispatch()
  // const todos = useSelector((state) => state.todo.todoList)

  // Todo 리스트 서버에 요청하기
  const [todos, setTodos] = useState([])
  const { data: todosList, isLoading, sendRequest: getTodos } = useFetch()

  useEffect(() => {
    CafeAuthFetch() // 로그인 여부 확인, (위치 인증 미완료시) Todo 리스트는 보여주되, 생성/수정/삭제 비활성화
    // 서버 API 요청 보내기 추가해야함
    getTodos({
      url: `${DEFAULT_REST_URL}/url주소`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      // body: {
      //   // GET method 사용 시 body에 정보 전달 못함..
      // },
    })
    console.log(isAuthenticated)
  }, [])

  // 할일 추가 input 태그에 입력된 내용
  const [enteredTodo, setEnteredTodo] = useState("")

  // 할일 추가 input 태그 변경내용 반영
  const inputChangeHandler = (event) => {
    setEnteredTodo(event.target.value)
  }

  // 할일 추가 버튼 -> 입력된 todoData 리덕스에 저장 (서버 API 요청 보내기 추가 예정)
  const submitHandler = () => {
    const todoData = {
      id: Math.random(),
      content: enteredTodo,
      isCompleted: false,
    }
    setEnteredTodo("")
    dispatch(todoActions.addTodo(todoData))
  }

  // 할일 체크 토글 (서버 API 요청 보내기 추가 예정)
  const toggleHandler = (toggledTodoId) => {
    dispatch(todoActions.update(toggledTodoId))
  }

  return (
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Card.Group>
            {todos.map((todo) => (
              <CafeTodoItem
                key={todo.id}
                id={todo.id}
                content={todo.content}
                isCompleted={todo.isCompleted}
                toggleHandler={toggleHandler}
              />
            ))}
            <Card fluid>
              <Card.Content extra>
                <Input
                  placeholder="할일 추가..."
                  value={enteredTodo}
                  onChange={inputChangeHandler}
                  style={{ width: "calc(100% - 50px)" }}
                  disabled={!isAuthenticated}
                />
                <Button
                  icon="add"
                  positive
                  floated="right"
                  onClick={submitHandler}
                  disabled={!isAuthenticated}
                />
              </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default CafeTodoList
