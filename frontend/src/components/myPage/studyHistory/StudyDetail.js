import { useSelector, useDispatch } from "react-redux"
import domtoimage from "dom-to-image"

import "./StudyDetail.css"
import PostForm from "../../mainPage/PostForm"
import { postActions } from "../../../store/post"

const StudyDetail = () => {
  const dispatch = useDispatch()
  const year = useSelector((state) => state.studyHistory.year)
  const month = useSelector((state) => state.studyHistory.month)
  const day = useSelector((state) => state.studyHistory.day)
  const onCaptureHandler = () => {
    const node = document.getElementById("detail")
    domtoimage
      .toPng(node)
      .then((dataUrl) => dispatch(postActions.uploadImage(dataUrl)))
      .catch((error) => console.error(error))
  }

  return (
    <>
      <div id="detail" class="detail-wrapper">
        <div class="detail">
          <p>
            {year}년 {month}월 {day}일
          </p>
          <p>위치: 스타벅스</p>
          <p>1시간 13분 / 2시간</p>
          <p>60% 달성</p>
          <p>커피콩: 2개 획득</p>
        </div>
      </div>
      <PostForm isStudyHistory={true} onCaptureHandler={onCaptureHandler} />
    </>
  )
}

export default StudyDetail
