import { Container, Grid } from "semantic-ui-react"

import MainNavigation from "./MainNavigation"
import SideNavigation from "./SideNavigation"

const Layout = (props) => {
  return (
    <Container>
      <Grid>
        <Grid.Column only="computer" width={4}>
          <SideNavigation/>
        </Grid.Column>
        <Grid.Column width={10}>
          <Grid.Row>
            <main>{props.children}</main>
          </Grid.Row>
          <Grid.Row>
            <MainNavigation />
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default Layout
