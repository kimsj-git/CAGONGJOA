import { useState } from "react"
import { Route, useHistory, useLocation } from "react-router-dom"
import { Menu } from "semantic-ui-react"

import MyPosts from "./MyPosts"
import MyComments from "./MyComments"
import MyLikes from "./MyLikes"

const URLS = {
  "/mypage/feed/myposts": "myposts",
  "/mypage/feed/mycomments": "mycomments",
  "/mypage/feed/mylikes": "mylikes",
}

const MyFeedPage = () => {
  const history = useHistory()
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(URLS[location.pathname])
  
  const handleItemClick = (e,{dir}) => {
    setActiveItem(dir)
    history.replace(`/mypage/feed/${dir}`)
  }

  return (
    <>
    <Menu color="blue" widths={3}>
        <Menu.Item
          name='내 게시글'
          dir="myposts"
          active={activeItem === 'myposts'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='내 댓글'
          dir="mycomments"
          active={activeItem === 'mycomments'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='좋아요'
          dir="mylikes"
          active={activeItem === 'mylikes'}
          onClick={handleItemClick}
        />
      </Menu>

      <Route path="/mypage/feed/myposts">
        <MyPosts />
      </Route>
      <Route path="/mypage/feed/mycomments">
        <MyComments />
      </Route>
      <Route path="/mypage/feed/mylikes">
        <MyLikes />
      </Route>
    </>
  )
}

export default MyFeedPage
