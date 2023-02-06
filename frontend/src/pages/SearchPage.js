import { useState } from "react"
import { Segment, Tab, Input, Icon } from "semantic-ui-react"

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("")
  const panes = [
    {
      menuItem: "Tab 1",
      render: () => <Tab.Pane attached={false}>Tab 1 Content</Tab.Pane>,
    },
    {
      menuItem: "Tab 2",
      render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
    },
    {
      menuItem: "Tab 3",
      render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
    },
  ]

  const currentLocation = sessionStorage.getItem("cafeAuth")
    ? "현재 카페 상호명"
    : "강남구 역삼동"

  return (
    // <Segment>
    <>
      <Input
        fluid
        icon={<Icon name="search" color="orange" />}
        iconPosition="left"
        placeholder={`${currentLocation} 근처에서 검색`}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ borderRadius: "30px" }}
        size="large"
      />
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </>
    // </Segment>
  )
}

export default SearchPage
