import { useEffect } from "react"
import CafeAuthFetch from "../components/certificate/cafeAuth/CafeAuthFetch"
import TodayCafeNavigation from "../components/todayCafe/TodayCafeNavigation"

import { Grid, Container } from "semantic-ui-react"

const TodayCafe = (props) => {
  useEffect(() => {
    CafeAuthFetch()
  }, [])
  
  return (
    <Container
      style={{
        backgroundColor: "#f9f9f9",
        borderRadius: "30px 30px 0px 0px",
        padding: "5px",
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
