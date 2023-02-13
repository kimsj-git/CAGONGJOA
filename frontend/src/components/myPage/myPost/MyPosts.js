import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Item } from "semantic-ui-react"

import Logout from "../../member/logout/Logout"
import MyPostsItem from "./MyPostsItem"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MyPosts = () => {
  const [postId, setPostId] = useState(-1)
  const [myPosts, setMyPosts] = useState([])
  const [requestPost, setRequestPost] = useState([])
  const [noPost, setNoPost] = useState(false)

  const getMyPosts = async () => {
    const response = await fetch(`${REST_DEFAULT_URL}/myPage/myFeed?postId=${postId}`,{
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      }
    })
    const responseData = await response.json()
    console.log(responseData)
    if (responseData.httpStatus === "OK"){
      return {sign: "OK", data: responseData.data}
    } else if (responseData.httpStatus === "NO_CONTENT"){
      return "NO"
    } else if (responseData.httpStatus === "BAD_REQUEST" && responseData.data.sign === "JWT"){
      const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`,{
        method: "GET",
        headers: {
          "Authorization-RefreshToken" : `Bearer ${sessionStorage.getItem('refreshToken')}`
        }
      })
      const responseData = await response.json()
      if (responseData.httpStatus!=="OK"){
        Logout()
      }else if(responseData.httpStatus === "OK"){
        sessionStorage.setItem('accessToken', responseData.data.accessToken)
        getMyPosts()
      }
    } else{
      alert("오류가 발생했습니다.")
    }
    
  }
  const [ref, inView] = useInView({
    threshold: 1,
  })
  useEffect(()=>{
    if (!noPost && inView === true) {
      const loadMyPosts = async() => {
        const result = await getMyPosts()
        if (result === "NO"){
          setNoPost(true)
        } else if(result.sign==="OK"){
          setRequestPost(result.data)
        }
      }
      loadMyPosts()
    }
  }, [inView])

  useEffect(()=>{
    setMyPosts((prev) => [ ...prev,...requestPost])
    if(requestPost.length>0){
      setPostId(requestPost[requestPost.length-1].postId)
    }
  }, [requestPost])
  return (
    <>
      <Item.Group divided style={{ width: "100%" }}>
        {myPosts.map((post) => {
          return <MyPostsItem post={post} key={post.postId} />
        })}
      </Item.Group>
      <div ref={ref}></div>
    </>
  )
}

export default MyPosts
