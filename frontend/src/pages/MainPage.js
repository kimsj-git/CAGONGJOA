import { Fragment } from "react"
import { Grid } from "semantic-ui-react"

import MainPageTopBar from "../components/mainPage/MainPageTopBar"
import PostList from "../components/mainPage/PostList"
import JamSurvey from "../components/mainPage/JamSurvey"

const MainPage = () => {
  const isAuthenticated = sessionStorage.getItem("cafeAuth")

  let isJamSurvey = sessionStorage.getItem("jamSurvey")
  console.log(1)
  return (
    <Fragment>
      <Grid>
        <Grid.Column width={16}>
          <MainPageTopBar isAuthenticated={isAuthenticated} />
        </Grid.Column>
        <Grid.Column width={16}>
          {isJamSurvey !== 1 && isAuthenticated !==undefined && <JamSurvey />}
        </Grid.Column>
        {/* <Grid.Column width={16}>
          <PostTypeCarousel />
        </Grid.Column> */}
        <Grid.Column width={16}>
          <div>
            <PostList />
          </div>
        </Grid.Column>
      </Grid>
    </Fragment>
  )
}

export default MainPage
