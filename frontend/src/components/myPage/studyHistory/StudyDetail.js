import { useSelector, useDispatch } from "react-redux"
import domtoimage from "dom-to-image"

import "./StudyDetail.css"
import PostForm from "../../mainPage/PostForm"
import { postActions } from "../../../store/post"
import { Grid, Icon } from "semantic-ui-react"

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
  const logo_url = "coffee_location_red.png"
  const coffee_url = "bean.png"
  return (
    <>
      <div id="detail" class="detail-wrapper">
        <div class="detail">
          <p style={{ textAlign: "center" }}>
            <b>
              {year}년 {month}월 {day}일
            </b>
          </p>
          <Grid padded>
            <Grid.Row>
              <Grid.Column width={5}>
                <img
                  src={require(`../../../assets/icons/${logo_url}`)}
                  alt="#"
                />
              </Grid.Column>
              <Grid.Column width={11} verticalAlign="middle">
                <span>스타벅스</span>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <Icon.Group>
                  <Icon name="computer" size="large" />
                  <Icon name="clock" corner color="grey" />
                </Icon.Group>
              </Grid.Column>
              <Grid.Column width={11} verticalAlign="middle">
                <span>1시간 30분</span>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <Icon.Group>
                  <Icon name="certificate" color="blue" size="big" fitted />
                  <Icon name="check" inverted />
                </Icon.Group>
              </Grid.Column>
              <Grid.Column width={11} verticalAlign="middle">
                <span>60% 달성</span>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <img
                  src={require(`../../../assets/icons/${coffee_url}`)}
                  style={{ width: "25px", height: "25px" }}
                  alt="#"
                />
              </Grid.Column>
              <Grid.Column width={11} verticalAlign="middle">
                <span>2개 획득!</span>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
      <PostForm isStudyHistory={true} onCaptureHandler={onCaptureHandler} />
    </>
  )
}

export default StudyDetail
