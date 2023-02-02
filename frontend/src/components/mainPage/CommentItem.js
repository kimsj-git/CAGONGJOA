import { useState } from "react";
import { Comment, Icon, Button, Form } from "semantic-ui-react";

const CommentItem = () => {
  const [replyMode, setReplyMode] = useState(false);

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
            <div>
              상남자준모
              <Icon name="chess queen" color="orange" />
              <Comment.Metadata content="할리스 강남역점" />
            </div>
            <Comment.Metadata content="2분 전" />
          </Comment.Author>
          <Comment.Text>
            이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던 봅니다. 이름과,
            사랑과 무엇인지 이름을 그러나 내일 버리었습니다. 피어나듯이 보고,
            어머니, 별 이름을 마리아 내일 별 봅니다.
          </Comment.Text>
          {/* <Comment.Metadata>
          <Icon name="thumbs up outline" color="red" />5
        </Comment.Metadata> */}
          <Comment.Actions>
            <Comment.Action>
              <Button
                size="mini"
                compact
                // basic
                // inverted
                color="red"
                icon="thumbs up"
                content="12"
              ></Button>
              <Button
                size="mini"
                compact
                // basic
                // inverted
                color="grey"
                icon="reply"
                content="대댓글"
                onClick={() => {
                  setReplyMode(!replyMode);
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
  );
};

export default CommentItem;
