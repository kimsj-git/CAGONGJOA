import { useState } from "react"
import { Comment, Icon, Button, Form } from "semantic-ui-react"
import ToggleButton from "../common/ToggleButton"

const CommentItem = () => {
  const [replyMode, setReplyMode] = useState(false)

  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar
          style={{ width: "3.5rem" }}
          as="a"
          src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F223BA433586D069517"
        />
        <Comment.Content>
          <Comment.Author
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div style={{ fontSize: "1.1rem", lineHeight: "1.2" }}>
              상남자준모
              <Icon name="chess queen" color="orange" />
              <Comment.Metadata content="할리스 강남역점" />
            </div>
            <Comment.Metadata content="2분 전" />
          </Comment.Author>
          <Comment.Text style={{ fontSize: "1.1rem", lineHeight: "1.5" }}>
            이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던 봅니다. 이름과,
            사랑과 무엇인지 이름을 그러나 내일 버리었습니다. 피어나듯이 보고,
          </Comment.Text>
          {/* <Comment.Metadata>
          <Icon name="thumbs up outline" color="red" />5
        </Comment.Metadata> */}
          <Comment.Actions>
            <Comment.Action>
              <ToggleButton btnType="like" content="3" compact size="mini" />
              <Button
                size="mini"
                compact
                // basic
                // inverted
                color="grey"
                icon="reply"
                content="대댓글"
                onClick={() => {
                  setReplyMode(!replyMode)
                }}
              ></Button>
            </Comment.Action>
          </Comment.Actions>
          {replyMode && (
            <Form reply>
              <Form.Input
                fluid
                placeholder="대댓글을 입력하세요."
                action={{
                  icon: "paper plane",
                }}
                size="mini"
              />
            </Form>
          )}
        </Comment.Content>
      </Comment>
    </Comment.Group>
  )
}

export default CommentItem
