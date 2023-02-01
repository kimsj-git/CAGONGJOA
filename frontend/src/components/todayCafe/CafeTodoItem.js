import { Card, Checkbox } from "semantic-ui-react"

const CafeTodoItem = (props) => {
  const onCheckHandler = () => {
    props.toggleHandler(props.id)
  }

  const content = (
    <p style={props.isCompleted ? { textDecoration: "line-through" } : null}>
      {props.content}
    </p>
  )

  return (
    <Card fluid>
      <Card.Content>
        <Card.Description>
          <Checkbox
            label={{ children: content }}
            checked={props.isCompleted}
            onChange={onCheckHandler}
          />
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

export default CafeTodoItem
