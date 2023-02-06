import TodayCafePage from "../../pages/TodayCafePage"
import CafeInfo from "./CafeInfo"
import CafeTimer from "./CafeTimer"
import CafeTodos from "./CafeTodos"

import { Container, Grid } from "semantic-ui-react"

const TodayCafe = () => {
  return (
    <TodayCafePage>
      <Container>
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column>
              <CafeInfo />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column>
              <CafeTodos />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </TodayCafePage>
  )
}

export default TodayCafe
