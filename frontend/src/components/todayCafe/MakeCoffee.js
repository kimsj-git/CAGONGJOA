import { useState, useEffect } from "react"
import TodayCafePage from "../../pages/TodayCafePage"
import { Button, Icon, Step, Image } from "semantic-ui-react"
import useFetch from "../../hooks/useFetch"
import "./MakeCoffee.css"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MakeCoffee = () => {
  const cafeAuth = sessionStorage.getItem("cafeAuth")
  const { data: fetchedCoffee, sendRequest: fetchCoffee } = useFetch()
  const [coffeeBeanCnt, setCoffeeBeanCnt] = useState(0)
  const [coffeeCnt, setCoffeeCnt] = useState(0)
  const [stepOpen, setStepOpen] = useState(false)

  useEffect(() => {
    fetchCoffee({
      url: `${DEFAULT_REST_URL}/member/coin`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
  }, [])

  useEffect(() => {
    setCoffeeBeanCnt(fetchedCoffee.coffeeBeanCnt)
    setCoffeeCnt(fetchedCoffee.coffeeCnt)
  }, [fetchedCoffee])

  // const todayCafe = JSON.parse(sessionStorage.getItem("todayCafe"))
  // let initialCoffeeCnt = 0
  // let initialCoffeeBeanCnt = 0

  // if (todayCafe !== null) {
  //   initialCoffeeCnt = todayCafe.coffeeCnt
  //   initialCoffeeBeanCnt = todayCafe.coffeeBeanCnt
  // }
  // const [coffeeCnt, setCoffeeCnt] = useState(initialCoffeeCnt)
  // const [coffeeBeanCnt, setCoffeeBeanCnt] = useState(initialCoffeeBeanCnt)

  const [activeStep, setActiveStep] = useState(0)
  const rotateSteps = () => {
    console.log(activeStep)
    setActiveStep((prev) => (prev + 1) % 7)
  }

  const coffeeMakeHandler = async (coffeeMakeType) => {
    const response = await fetch(
      `${DEFAULT_REST_URL}/todaycafe/coffeemaking/?coffeeMakeType=${coffeeMakeType}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    )
    const responseData = await response.json()
    if (cafeAuth !== "1") {
      alert("카페 인증 후 커피를 내릴 수 있어요.\uD83D\uDE4F")
    } else if (responseData.httpStatus === "NOT_ACCEPTABLE") {
      // console.log(responseData)
      alert("커피콩이 부족합니다.")
    } else {
      setStepOpen(true)
      const makingCoffee = setInterval(() => {
        rotateSteps(activeStep)
      }, 500)

      setTimeout(() => {
        clearInterval(makingCoffee)
        // console.log(responseData)
        setStepOpen(false)
        setActiveStep(0)
        setCoffeeCnt(responseData.data.coffeeCnt)
        setCoffeeBeanCnt(responseData.data.coffeeBeanCnt)
        let todayCafe = JSON.parse(sessionStorage.getItem("todayCafe"))
        todayCafe = {
          ...todayCafe,
          coffeeCnt: responseData.data.coffeeCnt,
          coffeeBeanCnt: responseData.data.coffeeBeanCnt,
        }
        sessionStorage.setItem("todayCafe", JSON.stringify(todayCafe))
      }, 10000)
    }
  }

  return (
    <TodayCafePage>
      <div
        style={{
          // backgroundColor: "#dfc49d",
          // borderRadius: "10px",
          padding: "3rem",
        }}
      >
        <p
          style={{
            textAlign: "center",
            color: "#1E3932",
            fontSize: "220%",
            fontFamily: "GangwonEdu_OTFBoldA",
            wordBreak: "keep-all",
          }}
        >
          커피콩으로 커피를 내려보세요.
        </p>
        <div
          style={{
            textAlign: "center",
            color: "#1E3932",
            fontSize: "150%",
            fontFamily: "GangwonEdu_OTFBoldA",
            wordBreak: "keep-all",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <p style={{ margin: "1rem" }}>내 커피콩: {coffeeBeanCnt}개</p>
          <p style={{ margin: "1rem" }}>내 커피: {coffeeCnt}개</p>
        </div>
      </div>
      {stepOpen && (
        <Step.Group size="mini" fluid>
          <Step className={activeStep === 1 ? "active" : null}>
            <Image
              src={require("../../assets/icons/give_beans.png")}
              size="mini"
            />
          </Step>

          <Step className={activeStep === 2 ? "active" : null}>
            <Image src={require("../../assets/icons/wash.png")} size="mini" />
          </Step>

          <Step className={activeStep === 3 ? "active" : null}>
            <Image src={require("../../assets/icons/drying.png")} size="mini" />
          </Step>
          <Step className={activeStep === 4 ? "active" : null}>
            <Image
              src={require("../../assets/icons/roasting.png")}
              size="mini"
            />
          </Step>
          <Step className={activeStep === 5 ? "active" : null}>
            <Image
              src={require("../../assets/icons/grinding.png")}
              size="mini"
            />
          </Step>
          <Step className={activeStep === 6 ? "active" : null}>
            <Image
              src={require("../../assets/icons/coffee_pot.png")}
              size="mini"
            />
          </Step>
          {/* <Step className={activeStep === 7 ? "active" : null}>
        <Image
          src={require("../../assets/icons/coffee_cup.png")}
          size="mini"
        />
      </Step> */}
        </Step.Group>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          marginTop: "3rem",
        }}
      >
        <Button
          onClick={(e) => {
            coffeeMakeHandler(1)
          }}
          color="orange"
          style={{ marginBottom: "20px" }}
        >
          커피콩 10개 <Icon name="arrow right" /> 커피 1잔
        </Button>
        <Button onClick={(e) => coffeeMakeHandler(2)} color="brown">
          커피콩 27개 <Icon name="arrow right" /> 커피 3잔
        </Button>
      </div>
    </TodayCafePage>
  )
}

export default MakeCoffee
