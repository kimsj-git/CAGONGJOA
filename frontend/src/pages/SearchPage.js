import { useState } from "react"
import { Segment, Tab, Input, Icon } from "semantic-ui-react"
import SearchBar from "../components/common/SearchBar"
import PostList from "../components/mainPage/PostList"
import PostSearchResult from "../components/searchPage/PostSearchResult"
import UserSearchResult from "../components/searchPage/UserSearchResult"
import "./SearchPage.css"

const SearchPage = () => {
  const panes = [
    {
      menuItem: {
        key: "posts",
        icon: "newspaper outline",
        content: "게시물",
      },
      render: () => (
        // <Tab.Pane>
        <PostSearchResult style={{ marginTop: "1rem" }} />
        // </Tab.Pane>
      ),
    },
    {
      menuItem: { key: "users", icon: "users", content: "유저" },
      render: () => (
        // <Tab.Pane>
        <UserSearchResult style={{ marginTop: "1rem" }} />
        // </Tab.Pane>
      ),
    },
  ]

  return (
    // <Segment>
    <div style={{ padding: "2rem 1rem" }}>
      <SearchBar />
      <Tab
        id="search-result"
        menu={{ secondary: true, pointing: true }}
        panes={panes}
        style={{ marginTop: "2rem" }}
        renderActiveOnly
      />
    </div>
    // </Segment>
  )
}

export default SearchPage
