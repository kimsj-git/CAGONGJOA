import { Fragment } from "react"
import { Container, Grid } from "semantic-ui-react"

import MainNavigation from "./MainNavigation"
import SideNavigation from "./SideNavigation"

const Layout = (props) => {
  return (
    <Fragment>
      <Container>
        <Grid>
          <Grid.Column only="computer" computer={2}>
            <SideNavigation />
          </Grid.Column>
          <Grid.Column mobile={16} computer={14}>
            <Grid.Row>
              <main style={{ paddingBottom: "5rem" }}>{props.children}</main>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Container>
      <MainNavigation />
    </Fragment>
  )
}

export default Layout
