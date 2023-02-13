import { useEffect, useState, useRef } from "react"
import { Tab } from "semantic-ui-react"
import SearchBar from "../components/common/SearchBar"
import PostSearchResult from "../components/searchPage/PostSearchResult"
import UserSearchResult from "../components/searchPage/UserSearchResult"
import { useDispatch, useSelector } from "react-redux"
import { searchActions } from "../store/search.js"
import { useInView } from "react-intersection-observer"
import "./SearchPage.css"
import useFetch from "../hooks/useFetch.js"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("")
  const [activeDomain, setActiveDomain] = useState(1)
  const hasSearched = useSelector((state) => state.search.hasSearched)
  const searchedByPost = useSelector((state) => state.search.searchedByPost)
  const searchedByUser = useSelector((state) => state.search.searchedByUser)
  const { data: searchedResults, isLoading, sendRequest: search } = useFetch()
  const dispatch = useDispatch()
  const isMounted = useRef(false)
  const [ref, inView] = useInView({
    threshold: 0.5,
  })

  const loadMore = async (keyword, type) => {
    await search(`${DEFAULT_REST_URL}/main/post/search`, {
      method: "POST",
      headers: {
        "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
          "refreshToken"
        )}`,
        "Content-Type": "application/json",
      },
      body: {
        postId:
          type === 1
            ? searchedByPost.at(-1).postId
            : searchedByUser.at(-1).postId,
        searchType: type,
        searchKey: keyword,
        latitude: JSON.parse(sessionStorage.getItem("location")).lat,
        longitude: JSON.parse(sessionStorage.getItem("location")).lng,
        dist: 0.5,
      },
    })
  }
  const searchSth = async (keyword, type) => {
    await search(`${DEFAULT_REST_URL}/main/post/search`, {
      method: "POST",
      headers: {
        "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
          "refreshToken"
        )}`,
        "Content-Type": "application/json",
      },
      body: {
        postId: -1,
        searchType: type,
        searchKey: keyword,
        latitude: JSON.parse(sessionStorage.getItem("location")).lat,
        longitude: JSON.parse(sessionStorage.getItem("location")).lng,
        dist: 0.5,
      },
    })
  }

  // 검색어 입력 후 enter 누르면 실행
  useEffect(() => {
    console.log(searchValue)
    if (isMounted.current) {
      if (!searchValue) {
        alert("검색어를 입력해주세요.")
      } else {
        searchSth(searchValue, 1)
      }
    }
  }, [searchValue])

  // 탭 변경 시 실행
  useEffect(() => {
    if (isMounted.current) {
      console.log(activeDomain)
      if (!searchValue) {
        alert("검색어를 입력해주세요.")
      } else {
        if (!hasSearched[activeDomain]) {
          searchSth(searchValue, activeDomain)
        }
      }
    }
  }, [activeDomain])

  // 스크롤 내리면 실행
  useEffect(() => {
    if (inView) {
      if (
        (activeDomain === 1 && searchedByPost.length > 0) ||
        (activeDomain === 2 && searchedByUser.length > 0)
      ) {
        if (
          (activeDomain === 1 && searchedByPost.length % 10 === 0) ||
          (activeDomain === 2 && searchedByUser.length % 10 === 0)
        ) {
          loadMore(searchValue, activeDomain)
        }
      }
    }
  }, [inView])

  // 새로운 검색 결과가 나오면 실행
  useEffect(() => {
    if (isMounted.current) {
      hasSearched[activeDomain]
        ? dispatch(
            searchActions.loadMoreResults({
              result: searchedResults,
              type: activeDomain,
            })
          )
        : activeDomain === 1
        ? dispatch(searchActions.searchByPost(searchedResults))
        : dispatch(searchActions.searchByUser(searchedResults))
    } else {
      isMounted.current = true
    }
  }, [searchedResults])

  const panes = [
    {
      menuItem: {
        key: "posts",
        icon: "newspaper outline",
        content: "게시물",
      },
      render: () => (
        // <Tab.Pane>
        <>
          <PostSearchResult style={{ marginTop: "1rem" }} />
          <div ref={ref} />
        </>
        // </Tab.Pane>
      ),
    },
    {
      menuItem: { key: "users", icon: "users", content: "유저" },
      render: () => (
        // <Tab.Pane>
        <>
          <UserSearchResult style={{ marginTop: "1rem" }} />
          <div ref={ref} />
        </>
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
          setActiveDomain(data.activeIndex + 1)
        }}
      />
    </div>
    // </Segment>
  )
}

export default SearchPage
