import { useRef, useState } from "react"
import { useSelector } from "react-redux"
import domtoimage from "dom-to-image"
import { Button } from "semantic-ui-react"

import classes from "./StudyDetail.module.css"

const StudyDetail = () => {
  const studyDetail = useRef()
  const year = useSelector((state) => state.studyHistory.year)
  const month = useSelector((state) => state.studyHistory.month)
  const day = useSelector((state) => state.studyHistory.day)
  const [imageTag, setImageTag] = useState("")

  const onClickHandler = () => {
    domtoimage
      .toPng(document.getElementById("detail"), {
        filter: (node) => {
          return node.tagName !== "IMG"
        },
      })
      .then((res) => console.log(1))
      .catch((err) => console.log(err))
  }
  return (
    <div>
      <div id="detail" ref={studyDetail} className={classes.studyDetailWrapper}>
        {year}년 {month}월 {day}일<p>위치: 스타벅스 강남R점</p>
        <p>1시간 13분 / 2시간</p>
        <p>60% 달성</p>
        <p>커피콩: 2개 획득</p>
      <Button onClick={onClickHandler}>자랑하기</Button>
      </div>
      {imageTag && <img id="image" src={imageTag} alt="#" />}
    </div>
  )
}

export default StudyDetail
