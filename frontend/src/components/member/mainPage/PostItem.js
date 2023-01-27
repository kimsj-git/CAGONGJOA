import { Feed, Card, Icon } from "semantic-ui-react"

const PostItem = (props) => {
  return (
    <Card>
      <Feed.Event>
        <Feed.Content>
          <Feed.Summary>
            <Feed.User>{props.author}</Feed.User>
          </Feed.Summary>
          <Feed.Extra text>{props.content}</Feed.Extra>
          <Feed.Meta>
            <Feed.Like>
              <Icon name="like" />
              {props.post_likes}
            </Feed.Like>
            <Feed.Like>
              <Icon name="sticky note outline" />
              {props.comments_cnt}
            </Feed.Like>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    </Card>
  )
}

export default PostItem
