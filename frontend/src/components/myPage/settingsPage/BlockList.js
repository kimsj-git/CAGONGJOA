import BlockListItem from "./BlockListItem"

const DUMMY_DATA = [{name:'카공싫어'}, {name:'카공실어'}, {name: '카스싫어'}, {name: '카스시러'}]
const BlockList = () => {
  return (
    <>
      {DUMMY_DATA.map((user,index) => {
        return <BlockListItem userName={user.name} key={index}/>
      })}
    </>
  )
}

export default BlockList