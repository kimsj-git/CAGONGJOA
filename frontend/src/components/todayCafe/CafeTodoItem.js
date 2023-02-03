import { Card, Checkbox, Button } from "semantic-ui-react"
import { useDispatch } from "react-redux"
import { todoActions } from "../../store/todo"

const CafeTodoItem = (props) => {
  const dispatch = useDispatch()
  
  const onCheckHandler = () => {
    props.toggleHandler(props.id)
  }

  const content = (
    <p style={props.isCompleted ? { textDecoration: "line-through" } : null}>
      {props.content}
    </p>
  )

  const deleteTodoHandler = (deleteTodoId) => {
    console.log(deleteTodoId)
    dispatch(todoActions.deleteTodo(deleteTodoId))
  }

  return (
    <Card fluid>
      <Card.Content>
        <Card.Description>
          <Checkbox
            label={{ children: content }}
            checked={props.isCompleted}
            onChange={onCheckHandler}
          />
        <Button floated="right" icon="trash alternate" onClick={(e) => deleteTodoHandler(props.id)}/>
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

export default CafeTodoItem
