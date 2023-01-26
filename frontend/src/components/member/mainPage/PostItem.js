import { Feed, Card, Icon } from "semantic-ui-react"

const PostItem = () => {
  return (
    <Card>
      <Card.Content>
        <Card.Description>게시물!</Card.Description>
      </Card.Content>
      <Feed.Meta>
        <Feed.Like>
          <Icon name="like" />4
        </Feed.Like>
        <Feed.Like>
          <Icon name="sticky note outline" />
          10
        </Feed.Like>
      </Feed.Meta>
    </Card>
    // <Feed.Event>
    //   <Feed.Content>
    //     <Feed.Extra text>게시물!</Feed.Extra>
    //     <Feed.Meta>
    //       <Feed.Like>
    //         <Icon name="like" />4
    //       </Feed.Like>
    //       <Feed.Like>
    //         <Icon name="sticky note outline"/>10
    //       </Feed.Like>
    //     </Feed.Meta>
    //   </Feed.Content>
    // </Feed.Event>
  )
}

export default PostItem
