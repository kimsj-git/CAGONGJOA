import { Fragment } from "react"
import { Container, Segment, Grid } from "semantic-ui-react"

import MainNavigation from "./MainNavigation"
import SideNavigation from "./SideNavigation"

const Layout = (props) => {
  return (
    <Fragment>
      <Container>
        <Grid>
          <Grid.Column
            id="side-col"
            className="main-column"
            only="computer"
            largeScreen={3}
            widescreen={3}
          >
            <SideNavigation
              setIsCafeAuth={props.setIsCafeAuth}
              setIsJamSurvey={props.setIsJamSurvey}
              isCafeAuth={props.isCafeAuth}
            />
          </Grid.Column>

          <Grid.Column
            className="main-column"
            only="computer"
            computer={3}
            largeScreen={3}
            widescreen={2}
          />
          <Grid.Column
            className="main-column"
            mobile={16}
            tablet={16}
            computer={8}
            largeScreen={6}
            widescreen={6}
          >
            <main>{props.children}</main>
          </Grid.Column>
        </Grid>
      </Container>
      <MainNavigation />
    </Fragment>
  )
}

export default Layout
