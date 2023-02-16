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
        backgroundColor: "#faf6ee",
        borderRadius: "40px 0px 40px 40px",
        padding: "10px",
        paddingBottom: "60%",
        margin: "5px",
        // height: "100%",
        boxShadow: '0 0px 30px 2px #e9c4bf',
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
