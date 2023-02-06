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
            only="computer"
            largeScreen={3}
            widescreen={3}
          >
            <SideNavigation />
          </Grid.Column>

          <Grid.Column
            only="computer largeScreen wideScreen"
            computer={3}
            largeScreen={2}
            widescreen={2}
          />
          <Grid.Column
            mobile={16}
            tablet={16}
            computer={8}
            largeScreen={6}
            widescreen={6}
          >
            <main style={{ paddingBottom: "5rem" }}>{props.children}</main>
          </Grid.Column>
        </Grid>
      </Container>
      <MainNavigation />
    </Fragment>
  )
}

export default Layout
