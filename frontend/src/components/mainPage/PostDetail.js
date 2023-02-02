import { useState } from "react"
import {
  Button,
  Modal,
  Header,
  Card,
  Image,
  Grid,
  Comment,
  Form,
  Divider,
  Label,
} from "semantic-ui-react"
import { ScrollPanel } from "primereact/scrollpanel"
import CommentItem from "./CommentItem"
import ToggleButton from "../common/ToggleButton"

const PostDetail = (props) => {
  const [open, setOpen] = useState(false)
=======
} from "semantic-ui-react";
import { ScrollPanel } from "primereact/scrollpanel";
import CommentItem from "./CommentItem";

const PostDetail = (props) => {
  const [open, setOpen] = useState(false);
>>>>>>> c32e4344c2aa14d34ad3c131487dd12280a8cd22

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="large"
      trigger={
        <Button
          fluid
          inverted
          color="green"
          icon="comment"
          content="5"
        ></Button>
      }
    >
<<<<<<< HEAD
      <Label
        color="orange"
        floating
        icon={{ name: "comment", size: "large", style: { margin: "0px" } }}
      />

=======
>>>>>>> c32e4344c2aa14d34ad3c131487dd12280a8cd22
      <Modal.Content>
        <div>
          <Grid>
            <Grid.Column mobile={16} tablet={8} computer={8}>
<<<<<<< HEAD
              <ScrollPanel style={{ width: "100%", height: "77.5vh" }}>
=======
              <ScrollPanel style={{ width: "100%", height: "630px" }}>
>>>>>>> c32e4344c2aa14d34ad3c131487dd12280a8cd22
                <Card fluid style={{ boxShadow: "none" }}>
                  <Card.Content>
                    <Image
                      avatar
                      floated="left"
                      size="huge"
                      src="https://www.freepnglogos.com/uploads/starbucks-logo-png-transparent-0.png"
                    />
                    <Card.Header>서정</Card.Header>
                    <Card.Meta>스타벅스 강남R점</Card.Meta>
                    <Card.Meta textAlign="right">13분</Card.Meta>
                    <Image
                      src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80"
                      // src={props.images[0]}
                      wrapped
                      ui={true}
                      style={{ marginBlock: "0.5rem" }}
                    />
                    <Card.Description>
                      이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던
                      봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일
                      버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아
                      내일 별 봅니다. 비둘기, 피어나듯이 나는 이네들은 걱정도
                      가득 까닭입니다. 별 이제 같이 있습니다. 프랑시스 다하지
                      남은 이름과, 있습니다. 이름을 하나에 별빛이 아직 동경과
                      아이들의 시와 했던 봅니다. 이름과, 사랑과 무엇인지 이름을
                      그러나 내일 버리었습니다. 피어나듯이 보고, 어머니, 별
                      이름을 마리아 내일 별 봅니다. 비둘기, 피어나듯이 나는
                      이네들은 걱정도 가득 까닭입니다. 별 이제 같이 있습니다.
<<<<<<< HEAD
                      프랑시스 다하지 남은 이름과, 있습니다. 남은 이름과,
                      있습니다. 이름을 하나에 별빛이 아직 동경과 아이들의 시와
                      했던 봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일
                      버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아
                      내일 별 봅니다. 비둘기, 피어나듯이 나는 이네들은 걱정도
                      가득 까닭입니다. 별 이제 같이 있습니다. 프랑시스 다하지
                      남은 이름과, 있습니다. 남은 이름과, 있습니다. 이름을
                      하나에 별빛이 아직 동경과 아이들의 시와 했던 봅니다.
                      이름과, 사랑과 무엇인지 이름을 그러나 내일 버리었습니다.
                      피어나듯이 보고, 어머니, 별 이름을 마리아 내일 별 봅니다.
                      비둘기, 피어나듯이 나는 이네들은 걱정도 가득 까닭입니다.
                      별 이제 같이 있습니다. 프랑시스 다하지 남은 이름과,
                      있습니다. 남은 이름과, 있습니다. 이름을 하나에 별빛이 아직
                      동경과 아이들의 시와 했던 봅니다. 이름과, 사랑과 무엇인지
                      이름을 그러나 내일 버리었습니다. 피어나듯이 보고, 어머니,
                      별 이름을 마리아 내일 별 봅니다. 비둘기, 피어나듯이 나는
                      이네들은 걱정도 가득 까닭입니다. 별 이제 같이 있습니다.
                      프랑시스 다하지 남은 이름과, 있습니다.
                    </Card.Description>
                  </Card.Content>
                </Card>
              </ScrollPanel>
              <div style={{ display: "flex", marginTop: "1rem" }}>
                <Button
                  fluid
                  // inverted
                  color="orange"
                  icon="edit"
                  content="12"
                ></Button>
                <Button
                  fluid
                  toggle
                  // inverted
                  color="grey"
                  icon="delete"
                  content="12"
                ></Button>
                <Button
                  fluid
                  inverted
                  color="red"
                  icon="thumbs up"
                  content="12"
                ></Button>
                <ToggleButton
                  color="red"
                  content="12"
                  fluid
                  inverted
                  icon="thumbs up"
                />
              </div>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Header>댓글 5</Header>
              <Divider />
              <ScrollPanel style={{ width: "100%", height: "70vh" }}>
=======
                      프랑시스 다하지 남은 이름과, 있습니다.
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div style={{ display: "flex" }}>
                      <Button
                        fluid
                        inverted
                        color="red"
                        icon="thumbs up"
                        content="12"
                      ></Button>
                    </div>
                  </Card.Content>
                </Card>
              </ScrollPanel>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              {/* <Modal.Description style={{ width: "100%", height: "100%" }}> */}
              <Header>댓글 5</Header>
              <Divider />
              <ScrollPanel style={{ width: "100%", height: "500px" }}>
>>>>>>> c32e4344c2aa14d34ad3c131487dd12280a8cd22
                <Comment.Group>
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                </Comment.Group>
              </ScrollPanel>
              <Divider />
              <Form reply>
                <Form.Input
                  fluid
                  placeholder="댓글을 입력하세요."
                  action={{
                    color: "brown",
                    icon: "paper plane",
                  }}
                  size="tiny"
                />
              </Form>
<<<<<<< HEAD
=======
              {/* </Modal.Description> */}
>>>>>>> c32e4344c2aa14d34ad3c131487dd12280a8cd22
            </Grid.Column>
          </Grid>
        </div>
      </Modal.Content>
    </Modal>
<<<<<<< HEAD
  )
}

export default PostDetail
=======
  );
};

export default PostDetail;
>>>>>>> c32e4344c2aa14d34ad3c131487dd12280a8cd22
