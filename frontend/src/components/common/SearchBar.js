import { useState } from "react"
import { Input, Icon, Segment } from "semantic-ui-react"
import { IoSearch } from "react-icons/io5"
import "./SearchBar.css"

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("")
  const currentLocation = sessionStorage.getItem("cafeAuth")
    ? "현재 카페 상호명"
    : "강남구 역삼동"

  const enterHandler = (event) => {
    if (event.key == "Enter") {
      // API 요청
    }
  }

  return (
    // <Segment style={{ backgroundColor: "rgb(0 0 0 / 2%)" }}>
    <Input
      fluid
      icon={<Icon name="search" color="orange" />}
      iconPosition="left"
      placeholder={`${currentLocation} 근처에서 검색`}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyPress={enterHandler}
      size="large"
      className="search-bar"
    />
    // </Segment>
  )
}

export default SearchBar
