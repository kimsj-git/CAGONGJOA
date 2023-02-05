import { Modal } from "semantic-ui-react"
import { IoIosSearch } from "react-icons/io"
import { useEffect, useState } from "react"
import { Tab, Input, List, Icon } from "semantic-ui-react"

const SearchModal = () => {
  const [searchValue, setSearchValue] = useState("")
  const data = [
    { content: "apple" },
    { content: "apple juice" },
    { content: "banana" },
    { content: "monkey banana" },
    { content: "itaewon" },
    { content: "aewon" },
    { content: "아메리카노" },
    { content: "바나리카노" },
    { content: "카페라떼" },
    { content: "고구마라떼" },
    { content: "바나나프라페" },
    { content: "바나나푸딩" },
    { content: "갱꼰라떼" },
  ]
  const [filteredData, setFilteredData] = useState([])
  const handleSearch = () => {
    setFilteredData(
      data.filter((item) =>
        item.content
          .toLowerCase()
          .replaceAll(" ", "")
          .includes(searchValue.toLowerCase().replaceAll(" ", ""))
      )
    )
    console.log(data)
  }
  useEffect(() => {
    console.log(filteredData)
  }, [filteredData])
  const panes = [
    {
      menuItem: "게시물",
      render: () => (
        <Tab.Pane attached={false}>
          <List>
            {filteredData.map((item) => (
              <List.Item key={item.id}>
                <List.Content>{item.content}</List.Content>
              </List.Item>
            ))}
          </List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "유저",
      render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
    },
  ]
  return (
    <Modal
      closeIcon
      fullscreen
      trigger={<IoIosSearch size="30" color="black" />}
    >
      {/* <Modal.Header>검색</Modal.Header> */}
      <Modal.Content>
        <Input
          fluid
          icon={
            <Icon name="search" inverted circular link onClick={handleSearch} />
          }
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Modal.Content>
    </Modal>
  )
}
export default SearchModal
