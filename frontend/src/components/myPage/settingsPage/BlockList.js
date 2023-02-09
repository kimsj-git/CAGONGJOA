import { List } from "semantic-ui-react"
import BlockListItem from "./BlockListItem"

const DUMMY_DATA = [
  { name: "카공싫어" },
  { name: "카공실어" },
  { name: "카스싫어" },
  { name: "카스시러" },
]
const BlockList = () => {
  return (
    <>
    <h1>차단 목록</h1>
      <List verticalAlign="middle" style={{ width: "100%" }}>
        {DUMMY_DATA.map((user, index) => {
          return <BlockListItem userName={user.name} key={index} />
        })}
      </List>
    </>
  )
}

export default BlockList
