import { Fragment } from "react"
import { Container, Grid, GridColumn } from "semantic-ui-react"

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
          <Grid.Column mobile={16} computer={13}>
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
