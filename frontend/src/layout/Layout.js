import { Fragment } from "react"
import { Container, Grid } from "semantic-ui-react"

import MainNavigation from "./MainNavigation"
import SideNavigation from "./SideNavigation"

const Layout = (props) => {
  return (
    <Fragment>
      <Container>
        <Grid divided>
          <Grid.Column only="computer" computer={3}>
            <SideNavigation />
          </Grid.Column>

          <Grid.Column mobile={16} computer={10}>
            <main style={{ paddingBottom: "5rem" }}>{props.children}</main>
          </Grid.Column>
        </Grid>
      </Container>
      <MainNavigation />
    </Fragment>
  )
}

export default Layout
