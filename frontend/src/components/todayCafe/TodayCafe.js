import TodayCafePage from "../../pages/TodayCafePage"
import CafeInfo from "./CafeInfo"
import CafeTimer from "./CafeTimer"

import { Container, Grid } from "semantic-ui-react"

const TodayCafe = () => {
  return (
    <TodayCafePage>
      <Container>
        <Grid>
          <h1>오늘의 카페</h1>
          <Grid.Row columns={1}>
            <Grid.Column>
              <CafeInfo />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <CafeTimer />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </TodayCafePage>
  )
}

export default TodayCafe
