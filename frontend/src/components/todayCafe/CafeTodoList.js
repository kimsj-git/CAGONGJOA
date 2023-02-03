import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { todoActions } from "../../store/todo"
import { Grid, Card, Input, Button } from "semantic-ui-react"

import CafeTodoItem from "./CafeTodoItem"

const CafeTodoList = () => {
  const dispatch = useDispatch()
  const todos = useSelector((state) => state.todo.todoList)

  // 할일 추가 input 태그에 입력된 내용
  const [enteredTodo, setEnteredTodo] = useState('')

  // 할일 추가 input 태그 변경내용 반영
  const inputChangeHandler = (event) => {
    setEnteredTodo(event.target.value)
  }

  // 할일 추가 버튼 -> 입력된 todoData 리덕스에 저장
  const submitHandler = () => {
    const todoData = {
      id: Math.random(),
      content: enteredTodo,
      isCompleted: false,
    }
    setEnteredTodo('')
    dispatch(todoActions.addTodo(todoData))
  }

  // 할일 체크 토글
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
                <Input placeholder="할일 추가..." value={enteredTodo} onChange={inputChangeHandler} />
                <Button icon="add" positive floated="right" onClick={submitHandler}/>
              </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default CafeTodoList
