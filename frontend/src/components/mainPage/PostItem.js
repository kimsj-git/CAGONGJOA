import { Card, Button, Image, Label } from "semantic-ui-react"
import { Skeleton } from "primereact/skeleton"
import "./PostItem.css"
import PostDetail from "./PostDetail"

const PostItem = (props) => {
  if (props.isLoading) {
    return (
      // <div className="field col-12 md:col-6 md:pr-6 pr-0">
      <Card fluid raised>
        <div className="custom-skeleton">
          <div className="skeleton-header">
            <div className="user-info">
              <Skeleton shape="circle" size="4rem" className="logo"></Skeleton>
              <div className="user-description">
                <Skeleton width="10rem"></Skeleton>
                <Skeleton width="8rem"></Skeleton>
              </div>
            </div>

            <Skeleton width="4rem" height="2rem"></Skeleton>
          </div>
          <Skeleton width="100%" height="150px"></Skeleton>
          <div className="skeleton-content">
            <Skeleton width="100%"></Skeleton>
            <Skeleton width="100%"></Skeleton>
          </div>
          <div className="skeleton-footer">
            <Skeleton width="49%" height="2rem"></Skeleton>
            <Skeleton width="49%" height="2rem"></Skeleton>
          </div>
        </div>
      </Card>
      // </div>
    )
  } else {
    return (
      <Card raised fluid>
        <Label corner="right" icon={{ name: "lightbulb", color: "orange" }} />
        <Card.Content>
          <Image
            avatar
            floated="left"
            size="huge"
            src="https://www.freepnglogos.com/uploads/starbucks-logo-png-transparent-0.png"
          />
          <Card.Header>{props.author}</Card.Header>
          <Card.Meta>스타벅스 강남R점</Card.Meta>
          <Card.Meta textAlign="right">13분</Card.Meta>
          <Image
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80"
            // src={props.images[0]}
            wrapped
            ui={true}
            style={{ marginBlock: "0.5rem" }}
          />
          <Card.Description>{props.content}</Card.Description>
          <Card.Meta textAlign="right">더보기</Card.Meta>
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
            <PostDetail post={props} />
          </div>
        </Card.Content>
      </Card>
    )
  }
}

            <Skeleton width="4rem" height="2rem"></Skeleton>
          </div>
          <Skeleton width="100%" height="150px"></Skeleton>
          <div className="skeleton-content">
            <Skeleton width="100%"></Skeleton>
            <Skeleton width="100%"></Skeleton>
          </div>
          <div className="skeleton-footer">
            <Skeleton width="49%" height="2rem"></Skeleton>
            <Skeleton width="49%" height="2rem"></Skeleton>
          </div>
        </div>
      </Card>
      // </div>
    );
  } else {
    return (
      <Card raised fluid>
        <Label corner="right" icon={{ name: "lightbulb", color: "orange" }} />
        <Card.Content>
          <Image
            avatar
            floated="left"
            size="huge"
            src="https://www.freepnglogos.com/uploads/starbucks-logo-png-transparent-0.png"
          />
          <Card.Header>{props.author}</Card.Header>
          <Card.Meta>스타벅스 강남R점</Card.Meta>
          <Card.Meta textAlign="right">13분</Card.Meta>
          <Image
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80"
            // src={props.images[0]}
            wrapped
            ui={true}
            style={{ marginBlock: "0.5rem" }}
          />
          <Card.Description>{props.content}</Card.Description>
          <Card.Meta textAlign="right">더보기</Card.Meta>
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
            <PostDetail post={props} />
          </div>
        </Card.Content>
      </Card>
    );
  }
};

export default PostItem;
