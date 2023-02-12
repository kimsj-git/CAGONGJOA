import CafeReport from "./CafeReport"
import { Grid, Container } from "semantic-ui-react"
import { BsFillPatchQuestionFill } from "react-icons/bs"

import CafeTimer from "./CafeTimer"

const CafeInfo = () => {
  const cafeAuth = sessionStorage.getItem("cafeAuth")
  const logo_url = "starbucks.png"

  const cafeName = cafeAuth ? '스타벅스 강남논현점' : '카페가 인증되지 않았습니다.'

  return (
    <Container style={{ backgroundColor: "#f9f9f9" }}>
      <Grid>
        {/* 모바일 태블릿 화면 카페 정보 */}
        <Grid.Row only="mobile tablet">
          <Grid.Column mobile={3} tablet={5} computer={1} />
          <Grid.Column mobile={10} tablet={6} computer={5}>
            {cafeAuth === '0' && (
              <BsFillPatchQuestionFill
                style={{ marginInline: "0.5rem 0.8rem" }}
                size="100%"
                color="grey"
              />
            )}
            {cafeAuth === '1' && (
              <img
                src={require(`../../assets/cafe_logos/${logo_url}`)}
                style={{ border: "3vw solid #fbbc05", borderRadius: "70%" }}
                alt="#"
              />
            )}
          </Grid.Column>
          <Grid.Column only="tablet computer" tablet={5} computer={10}>
            <Grid style={{ textAlign: "center" }}>
              <Grid.Row style={{ display: "flex", justifyContent: "right" }}>
                <CafeReport icon={false} size={"large"} content={"제보하기"} />
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column only="mobile" mobile={3}>
            <CafeReport icon={"write square"} size={"mini"} content={null} />
          </Grid.Column>
        </Grid.Row>

        {/* 데스크탑 화면 카페 정보 - 여기에 시간 바 들어감 */}
        <Grid.Row style={{ width: "100%" }} centered>
          <Grid columns={2}>
            <Grid.Column only="computer" computer={5}>
              {cafeAuth === '0' && (
                <BsFillPatchQuestionFill
                  style={{ marginInline: "0.5rem 0.8rem" }}
                  size="100%"
                  color="grey"
                />
              )}
              {cafeAuth === '1' && (
                <img
                  src={require(`../../assets/cafe_logos/${logo_url}`)}
                  style={{
                    width: "100%",
                    border: "1vw solid #fbbc05",
                    borderRadius: "70%",
                  }}
                  alt="#"
                />
              )}
            </Grid.Column>
            <Grid.Column
              mobile={16}
              tablet={16}
              computer={11}
              style={{ height: "100%" }}
            >
              <Grid style={{ display: "flex", alignItems: "center" }}>
                <Grid.Row columns={2}>
                  <Grid.Column
                    mobile={16}
                    tablet={16}
                    computer={11}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "large",
                        textAlign: "center",
                        color: "#1E3932",
                      }}
                    >
                      {cafeName}
                    </p>
                  </Grid.Column>
                  <Grid.Column only="computer" computer={5}>
                    <CafeReport
                      icon={false}
                      size={"large"}
                      content={"제보하기"}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                  <Grid.Column>
                    <CafeTimer />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default CafeInfo
