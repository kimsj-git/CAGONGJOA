import { useState } from "react"
import { Input, Icon, Segment } from "semantic-ui-react"
import { IoSearch } from "react-icons/io5"
import "./SearchBar.css"

const SearchBar = (props) => {
  const currentLocation = Number(sessionStorage.getItem("cafeAuth"))
    ? JSON.parse(sessionStorage.getItem("myCafe"))?.cafeName
    : sessionStorage.getItem("address")?.split(" ").at(-1)

  const enterHandler = (event) => {
    if (event.key == "Enter") {
      props.setSearchValue(event.target.value)
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
      // value={props.searchValue}
      // onChange={(e) => props.setSearchValue(e.target.value)}
      onKeyPress={enterHandler}
      size="large"
      className="search-bar"
    />
    // </Segment>
  )
}

export default SearchBar
