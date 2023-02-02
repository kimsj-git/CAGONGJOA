import { useSelector, useDispatch } from "react-redux"
import { todoActions } from "../../store/todo"
import { Grid, Card, Input, Button } from "semantic-ui-react"

import CafeTodoItem from "./CafeTodoItem"

const CafeTodoList = () => {
  const dispatch = useDispatch()
  const todos = useSelector((state) => state.todo.todoList)

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
                {/* <Card.Description> */}
                <Input placeholder="할일 추가..." />
                {/* </Card.Description> */}
                <Button icon="add" positive floated="right" />
              </Card.Content>
            </Card>
          </Card.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default CafeTodoList
