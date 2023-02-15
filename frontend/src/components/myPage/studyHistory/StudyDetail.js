import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import domtoimage from "dom-to-image"

import "./StudyDetail.css"
import PostForm from "../../mainPage/PostForm"
import { imageActions } from "../../../store/image"
import { Grid, Icon } from "semantic-ui-react"
import { Carousel } from "primereact/carousel"

const StudyDetail = () => {
  const dispatch = useDispatch()
  const year = useSelector((state) => state.studyHistory.year)
  const month = useSelector((state) => state.studyHistory.month)
  const day = useSelector((state) => state.studyHistory.day)
  const [captureId, setCaptureId] = useState(0)
  const monthStudyHistory = useSelector(
    (state) => state.studyHistory.monthStudyHistory
  )
  const isLoading = useSelector((state) => state.studyHistory.isLoading)

  let studyDetailList = monthStudyHistory
    ? monthStudyHistory
        .filter((detail) => `${detail.visitedAt}` === `${year}${month}${day}`)
        .sort((a, b) => {
          return b.accTime - a.accTime
        })
    : []

  const onCaptureHandler = () => {
    const node = document.getElementsByClassName('p-carousel-item-active')[0].childNodes[0]
    domtoimage
      .toPng(node)
      .then((dataUrl) => dispatch(imageActions.uploadImage(dataUrl)))
      .catch((error) => console.error(error))
  }
  const logo_url = "coffee_location_red.png"
  const fortune_url = "kagongjoa_logo.png"

  const carouselTemplate = (page) => {
    return (
      <>
        <div id={`detail`} class="detail-wrapper">
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
                      <span>{page.cafeInfo.name}</span>
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
                        {page.accTime / 60 !== 0
                          ? `${parseInt(page.accTime / 60)}시간 `
                          : " "}
                        {page.accTime % 60}분
                      </span>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={4}>
                      <Icon.Group>
                        <Icon
                          name="certificate"
                          color="blue"
                          size="big"
                          fitted
                        />
                        <Icon name="check" inverted />
                      </Icon.Group>
                    </Grid.Column>
                    <Grid.Column width={12} verticalAlign="middle">
                      <span>{page.todoAchievementRate}% 달성</span>
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
                      <span>{page.fortuneMsg}</span>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </>
            ) : (
              <p>기록이 없습니다.</p>
            )}
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <div style={{display:"flex"}}>
        {studyDetailList.length > 0 && (
          <Carousel
            value={studyDetailList}
            numVisible={1}
            numScroll={1}
            itemTemplate={(page)=>carouselTemplate(page)}
            style={{ position: "inherit" }}
            orientation="vertical"
          />
        )}
      </div>
      {studyDetailList && studyDetailList.length > 0 && (
        <PostForm isStudyHistory={true} onCaptureHandler={onCaptureHandler} />
      )}
    </>
  )
}

export default StudyDetail
