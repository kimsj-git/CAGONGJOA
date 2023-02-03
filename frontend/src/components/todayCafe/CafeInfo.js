import CafeReport from "./CafeReport"
import { Grid, Container, Button } from "semantic-ui-react"

import CafeTimer from "./CafeTimer"

const CafeInfo = () => {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={3} tablet={5} computer={1} />
          <Grid.Column mobile={10} tablet={6} computer={5}>
            <img
              src="https://t1.daumcdn.net/cfile/tistory/99857F4F5E738F472F"
              style={{ margin: "auto" }}
              alt="#"
            />
          </Grid.Column>
          <Grid.Column only="tablet computer" tablet={5} computer={10}>
            <Grid style={{textAlign: 'center'}}>
              <Grid.Row style={{ display: "flex", justifyContent: "right" }}>
                <CafeReport icon={false} size={"large"} content={"제보하기"} />
              </Grid.Row>
              <Grid.Row only="computer" columns={1}>
                <Grid.Column>
                  <CafeTimer />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column only="mobile" mobile={3}>
            <CafeReport icon={"write square"} size={"mini"} content={null} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column only="mobile tablet">
            <p style={{ textAlign: "center", color: "#1E3932" }}>
              스타벅스 강남논현점
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {/* <Button
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          backgroundColor: "#00a862",
          color: "#f9f9f9",
        }}
      >
        제보하기
      </Button> */}
    </Container>
  )
}

export default CafeInfo
