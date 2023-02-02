import TodayCafeNavigation from "../components/todayCafe/TodayCafeNavigation"

import { Grid, Container } from "semantic-ui-react"

const TodayCafe = (props) => {
  return (
    <Container
      style={{
        backgroundColor: "#f9f9f9",
        borderRadius: "30px 30px 0px 0px",
        padding: "2rem",
        margin: "5px",
      }}
    >
      <Grid>
        <Grid.Column>
          <Grid.Row style={{marginBottom: '2rem'}}>
            <TodayCafeNavigation />
          </Grid.Row>
          <Grid.Row>{props.children}</Grid.Row>
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default TodayCafe
