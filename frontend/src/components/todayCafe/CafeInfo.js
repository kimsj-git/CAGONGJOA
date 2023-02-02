import { Grid, Container, Button } from "semantic-ui-react"

const CafeInfo = () => {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={6} />
          <Grid.Column width={4}>
            <img
              src="https://t1.daumcdn.net/cfile/tistory/99857F4F5E738F472F"
              style={{ width: "100%", margin: "auto" }}
              alt="#"
            />
          </Grid.Column>
          <Grid.Column width={6} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <h2 style={{ textAlign: "center", color: "#1E3932" }}>
              스타벅스 강남논현점
            </h2>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Button
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          backgroundColor: "#00a862",
          color: "#f9f9f9",
        }}
      >
        제보하기
      </Button>
    </Container>
  )
}

export default CafeInfo
