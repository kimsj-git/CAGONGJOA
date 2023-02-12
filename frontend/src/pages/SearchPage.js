import { useEffect, useState, useRef } from "react"
import { Segment, Tab, Input, Icon } from "semantic-ui-react"
import SearchBar from "../components/common/SearchBar"
import PostList from "../components/mainPage/PostList"
import PostSearchResult from "../components/searchPage/PostSearchResult"
import UserSearchResult from "../components/searchPage/UserSearchResult"
import { useDispatch, useSelector } from "react-redux"
import { searchActions } from "../store/search.js"
import "./SearchPage.css"
import useFetch from "../hooks/useFetch.js"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("")
  const [activeDomain, setActiveDomain] = useState(0)
  const hasSearched = useSelector((state) => state.search.hasSearched)
  const { data: searchedResults, isLoading, sendRequest: search } = useFetch()
  const dispatch = useDispatch()

  const onKeywordChange = async (keyword) => {
    await search(`${DEFAULT_REST_URL}/search`, {
      method: "POST",
      headers: {
        "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
          "refreshToken"
        )}`,
        "Content-Type": "application/json",
      },
      body: {
        keyword: keyword,
        searchType: 0,
      },
    })
    dispatch(searchActions.keywordChange(searchedResults))
  }
  const onDomainChange = async (keyword, type) => {
    await search(`${DEFAULT_REST_URL}/search`, {
      method: "POST",
      headers: {
        "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
          "refreshToken"
        )}`,
        "Content-Type": "application/json",
      },
      body: {
        keyword: keyword,
        searchType: type,
      },
    })
    dispatch(
      searchActions.domainChange({ result: searchedResults, searchType: type })
    )
  }

  useEffect(() => {
    console.log(searchValue)
    if (!searchValue) {
      alert("검색어를 입력해주세요.")
    } else {
      onKeywordChange(searchValue)
    }
  }, [searchValue])
  useEffect(() => {
    console.log(activeDomain)
    if (!searchValue) {
      alert("검색어를 입력해주세요.")
    } else {
      if (!hasSearched[activeDomain]) {
        onDomainChange(searchValue, activeDomain)
      }
    }
  }, [activeDomain])

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
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <Tab
        id="search-result"
        menu={{ secondary: true, pointing: true }}
        panes={panes}
        style={{ marginTop: "2rem" }}
        renderActiveOnly
        onTabChange={(e, data) => {
          setActiveDomain(data.activeIndex)
        }}
      />
    </div>
    // </Segment>
  )
}

export default SearchPage
