import { Fragment } from "react"
import { Container, Grid } from "semantic-ui-react"

import MainNavigation from "./MainNavigation"
import SideNavigation from "./SideNavigation"

const Layout = (props) => {
  return (
    <Fragment>
      <Container>
        <Grid>
          <Grid.Column only="computer" width={2}>
            <SideNavigation />
          </Grid.Column>
          <Grid.Column only="mobile tablet" width={1} />
          <Grid.Column width={14}>
            <Grid.Row>
              <main style={{ paddingBottom: "5rem" }}>{props.children}</main>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column only="mobile tablet" width={1} />
        </Grid>
      </Container>
      <MainNavigation />
    </Fragment>
  )
}

export default Layout
