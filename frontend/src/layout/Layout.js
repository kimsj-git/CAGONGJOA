import { Fragment } from "react"
import { Container, Grid, Segment } from "semantic-ui-react"

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

          <Grid.Column computer={10}>
            <Grid>
              <Grid.Row only="mobile">이것은 상단바입니다.</Grid.Row>
              <Grid.Row mobile={16}>
                <main style={{ paddingBottom: "5rem" }}>{props.children}</main>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </Container>
      <MainNavigation />
    </Fragment>
  )
}

export default Layout
