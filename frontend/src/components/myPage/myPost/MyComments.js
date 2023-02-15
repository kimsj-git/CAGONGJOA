import { Item } from "semantic-ui-react"
// import MyCommentsItem from "./MyCommentsItem"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

import { ScrollTop } from "primereact/scrolltop"
import MyCommentsItem from "./MyCommentsItem.js"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MyComments = (props) => {
  const [myComments, setMyComments] = useState([])
  const [requestComment, setRequestComment] = useState([])
  const [commentId, setCommentId] = useState(-1)
  const [noComment, setNoComment] = useState(false)

  const [ref, inView] = useInView({
    threshold: 1,
  })
  

  const getMyComments = async () => {
    const response = await fetch(
      `${REST_DEFAULT_URL}/myPage/myComment?commentId=${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    )
  

    const responseData = await response.json()
    console.log(responseData)
    if (responseData.httpStatus === "OK") {
      return { sign: "OK", data: responseData.data }
    } else if (responseData.httpStatus === "NO_CONTENT") {
      return "NO"
    } else if (
      responseData.httpStatus === "BAD_REQUEST" &&
      responseData.data.sign === "JWT"
    ) {
      const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
        method: "GET",
        headers: {
          "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
            "refreshToken"
          )}`,
        },
      })
      const responseData = await response.json()
      if (responseData.httpStatus !== "OK") {
        alert("세션이 만료되었습니다.")
        sessionStorage.clear()
        window.location.href = '/login'
      } else if (responseData.httpStatus === "OK") {
        sessionStorage.setItem("accessToken", responseData.data.accessToken)
        getMyComments()
      }
    } else {
      alert("오류가 발생했습니다.")
    }
  }

  useEffect(() => {
    if (!noComment && inView === true) {
      const loadMyPosts = async () => {
        const result = await getMyComments(commentId)
        if (result === "NO") {
          setNoComment(true)
        } else if (result.sign === "OK") {
          setRequestComment(result.data)
        }
      }
      loadMyPosts()
    }
  }, [inView])

  useEffect(() => {
    setMyComments((prev) => [...prev, ...requestComment])
    if (requestComment.length > 0) {
      setCommentId(requestComment[requestComment.length - 1].commentId)
    }
  }, [requestComment])

  return (
    <>
      <Item.Group
        divided
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContents: "center",
          alignItems: "center",
        }}
      >
        {myComments.map((comment) => {
          return <MyCommentsItem comment={comment} key={comment.commentId}/>
        })}
        <ScrollTop threshold={500}/>
      {noComment &&<p>더 이상 댓글이 없습니다..</p>}
      </Item.Group>
      <div ref={ref}></div>
    </>
  )
}

export default MyComments
