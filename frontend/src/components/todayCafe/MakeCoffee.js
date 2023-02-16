import { useState, useEffect } from "react"
import TodayCafePage from "../../pages/TodayCafePage"
import { Button, Icon } from "semantic-ui-react"
import useFetch from "../../hooks/useFetch"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MakeCoffee = () => {
  const cafeAuth = sessionStorage.getItem("cafeAuth")
  const { data: fetchedCoffee, sendRequest: fetchCoffee } = useFetch()
  const [coffeeBeanCnt, setCoffeeBeanCnt] = useState(0)
  const [coffeeCnt, setCoffeeCnt] = useState(0)

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
      // console.log(responseData)
      setCoffeeCnt(responseData.data.coffeeCnt)
      setCoffeeBeanCnt(responseData.data.coffeeBeanCnt)
      let todayCafe = JSON.parse(sessionStorage.getItem("todayCafe"))
      todayCafe = {
        ...todayCafe,
        coffeeCnt: responseData.data.coffeeCnt,
        coffeeBeanCnt: responseData.data.coffeeBeanCnt,
      }
      sessionStorage.setItem("todayCafe", JSON.stringify(todayCafe))
    }
  }

  return (
    <TodayCafePage>
      <h1>커피 내리기</h1>
      <p>커피콩으로 커피를 내려보세요!</p>
      <p>내 커피콩: {coffeeBeanCnt}개</p>
      <p>내 커피: {coffeeCnt}개</p>
      <Button onClick={(e) => coffeeMakeHandler(1)} color="black">
        커피콩 10개 <Icon name="arrow right" /> 커피 1잔
      </Button>
      <Button onClick={(e) => coffeeMakeHandler(2)} color="black">
        커피콩 27개 <Icon name="arrow right" /> 커피 3잔
      </Button>
    </TodayCafePage>
  )
}

export default MakeCoffee
