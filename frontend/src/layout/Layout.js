import { Fragment } from "react"
import { Container, Segment, Grid } from "semantic-ui-react"
import { useLocation } from "react-router-dom"

import MainNavigation from "./MainNavigation"
import SideNavigation from "./SideNavigation"

const Layout = (props) => {
  const location = useLocation()
  const path = location.pathname
  return (
    <Fragment>
      <Container>
        <Grid>
          <Grid.Column
            id="side-col"
            className="main-column"
            only="computer"
            largeScreen={path === "/login" ? 2 : 3}
            widescreen={path === "/login" ? 2 : 3}
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
            computer={path === "/login" || path === "/oauth/kakao" ? 16 : 8}
            largeScreen={path === "/login" || path === "/oauth/kakao" ? 16 : 6}
            widescreen={path === "/login" || path === "/oauth/kakao" ? 16 : 6}
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
