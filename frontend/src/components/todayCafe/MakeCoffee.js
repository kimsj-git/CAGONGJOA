import { useState, useEffect } from "react"
import TodayCafePage from "../../pages/TodayCafePage"
import { Button, Icon } from "semantic-ui-react"
import useFetch from "../../hooks/useFetch"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MakeCoffee = () => {
  const cafeAuth = sessionStorage.getItem("cafeAuth")
  const [coffeeCnt, setCoffeeCnt] = useState(sessionStorage.getItem("coffeeCnt"))
  const [coffeeBeanCnt, setCoffeeBeanCnt] = useState(sessionStorage.getItem("coffeeBeanCnt"))

  const { data: fetchedData, isLoading, sendRequest: makeCoffee } = useFetch()

  const coffeeMakeHandler = async (coffeeMakeType) => {
    await makeCoffee({
      url: `${DEFAULT_REST_URL}/todaycafe/coffeemaking`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        'Content-Type': 'application/json',
      },
      body: {
        coffeeMakeType: coffeeMakeType,
      },
    })
  }

  useEffect(() => {
    sessionStorage.setItem("coffeeCnt", fetchedData.coffeeCnt)
    sessionStorage.setItem("coffeeBeanCnt", fetchedData.coffeeBeanCnt)
    setCoffeeCnt(fetchedData.coffeeCnt)
    setCoffeeBeanCnt(fetchedData.coffeeBeanCnt)
  }, [fetchedData])

  return (
    <TodayCafePage>
      <h1>커피 내리기</h1>
      <p>커피콩으로 커피를 내려보세요!</p>
      <p>내 커피콩: {coffeeCnt}개</p>
      <p>내 커피: {coffeeBeanCnt}개</p>
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
