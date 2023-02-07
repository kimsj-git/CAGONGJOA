import TodayCafePage from "../../pages/TodayCafePage"

import { Button, Icon } from "semantic-ui-react"

const MakeCoffee = () => {
  return <TodayCafePage>
    <h1>커피 내리기</h1>
    <p>커피콩으로 커피를 내려보세요!</p>
    <Button color="black">커피콩 10개 <Icon name="arrow right"/> 커피 1잔</Button>
    <Button color="black">커피콩 27개 <Icon name="arrow right"/> 커피 3잔</Button>
  </TodayCafePage>
}

export default MakeCoffee