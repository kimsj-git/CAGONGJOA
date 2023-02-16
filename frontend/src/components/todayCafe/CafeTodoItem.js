import { Card, Checkbox, Button } from "semantic-ui-react"
import { useDispatch } from "react-redux"
import { todoActions } from "../../store/todo"

const CafeTodoItem = (props) => {
  const dispatch = useDispatch()
  
  const onCheckHandler = (selectedTodoId) => {
    props.toggleHandler(selectedTodoId)
  }

  const content = (
    <p style={props.isCompleted ? { textDecoration: "line-through" } : null}>
      {props.content}
    </p>
  )

  const deleteTodoHandler = (deleteTodoId) => {
    props.deleteHandler(deleteTodoId)
    // console.log(deleteTodoId)
    // dispatch(todoActions.deleteTodo(deleteTodoId))
  }

  return (
    <Card fluid>
      <Card.Content>
        <Card.Description style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Checkbox
            label={{ children: content }}
            checked={props.isCompleted}
            onChange={(e) => onCheckHandler(props.id)}
            style={{fontSize: "135%", fontFamily: 'GangwonEdu_OTFBoldA'}}
          />
        <Button floated="right" icon="trash alternate" onClick={(e) => deleteTodoHandler(props.id)}/>
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

export default CafeTodoItem
