import { Container, Grid } from "semantic-ui-react"

import MainNavigation from "./MainNavigation"
import SideNavigation from "./SideNavigation"

import classes from "./MainNavigation.module.css"

const Layout = (props) => {
  return (
    <Container>
      <Grid>
        <Grid.Column only="computer" width={2}>
          <SideNavigation />
        </Grid.Column>
        <Grid.Column width={14}>
          <Grid.Row>
            <main style={{ paddingBottom: "5rem" }}>{props.children}</main>
          </Grid.Row>
          <Grid.Row only="mobile tablet">
            <MainNavigation />
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default Layout
