import { useSelector, useDispatch } from "react-redux"
import domtoimage from "dom-to-image"

import "./StudyDetail.css"
import PostForm from "../../mainPage/PostForm"
import { imageActions } from "../../../store/image"
import { Grid, Icon } from "semantic-ui-react"

const StudyDetail = () => {
  const dispatch = useDispatch()
  const year = useSelector((state) => state.studyHistory.year)
  const month = useSelector((state) => state.studyHistory.month)
  const day = useSelector((state) => state.studyHistory.day)
  const monthStudyHistory = useSelector(
    (state) => state.studyHistory.monthStudyHistory
  )
  const isLoading = useSelector((state) => state.studyHistory.isLoading)
    const studyDetailList = monthStudyHistory ? monthStudyHistory.filter(
      (detail) => `${detail.visitedAt}` === `${year}${month}${day}`
    ) : []

  const onCaptureHandler = () => {
    const node = document.getElementById("detail")
    domtoimage
      .toPng(node)
      .then((dataUrl) => dispatch(imageActions.uploadImage(dataUrl)))
      .catch((error) => console.error(error))
  }
  const logo_url = "coffee_location_red.png"
  const fortune_url = "kagongjoa_logo.png"
  return (
    <>
      <div id="detail" class="detail-wrapper">
        <div class="detail">
          <p style={{ textAlign: "center" }}>
            <b>
              {year}년 {month}월 {day}일
            </b>
          </p>
          {isLoading ? (
            <Icon name="spinner" size="large" loading />
          ) : studyDetailList.length > 0 ? (
            <>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <img
                      src={require(`../../../assets/icons/${logo_url}`)}
                      alt="#"
                    />
                  </Grid.Column>
                  <Grid.Column width={12} verticalAlign="middle">
                    <span>{studyDetailList[0].cafeInfo.name}</span>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <Icon.Group>
                      <Icon name="computer" size="large" />
                      <Icon name="clock" corner color="grey" />
                    </Icon.Group>
                  </Grid.Column>
                  <Grid.Column width={12} verticalAlign="middle">
                    <span>
                      {studyDetailList[0].accTime / 60 !== 0
                        ? `${parseInt(studyDetailList[0].accTime / 60)}시간 `
                        : " "}
                      {studyDetailList[0].accTime % 60}분
                    </span>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <Icon.Group>
                      <Icon name="certificate" color="blue" size="big" fitted />
                      <Icon name="check" inverted />
                    </Icon.Group>
                  </Grid.Column>
                  <Grid.Column width={12} verticalAlign="middle">
                    <span>{studyDetailList[0].todoAchievementRate}% 달성</span>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <img
                      src={require(`../../../assets/icons/${fortune_url}`)}
                      style={{ width: "25px", height: "25px" }}
                      alt="#"
                    />
                  </Grid.Column>
                  <Grid.Column width={12} verticalAlign="middle">
                    <span>{studyDetailList[0].fortuneMsg}</span>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </>
          ) : (
            <p>기록이 없습니다.</p>
          )}
        </div>
      </div>
      {studyDetailList && studyDetailList.length > 0 && (
        <PostForm isStudyHistory={true} onCaptureHandler={onCaptureHandler} />
      )}
    </>
  )
}

export default StudyDetail
