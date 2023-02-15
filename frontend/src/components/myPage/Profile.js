import { useDispatch } from "react-redux"
import { Item, Grid, Button } from "semantic-ui-react"
import { modalActions } from "../../store/modal"

import { BsFillPatchQuestionFill } from "react-icons/bs"

const BRAND_LOGOS = {
  할리스: "hollys",
  폴바셋: "paulbasset",
  파스쿠찌: "pascucci",
  투썸플레이스: "twosome",
  토프레소: "topresso",
  텐퍼센트커피: "tenpercent",
  탐앤탐스: "tomntoms",
  컴포즈커피: "compose",
  커피에반하다: "coffeebanada",
  커피스미스: "coffeesmith",
  커피빈: "coffeebean",
  커피베이: "coffeebay",
  커피나무: "coffeenamu",
  카페베네: "caffeebene",
  카페띠아모: "caffetiamo",
  전광수:"jungwang",
  이디야커피:"edia",
  요거프레소:"yogerpresso",
  엔제리너스:"angelinus",
  스타벅스: "starbucks",
  스무디킹:"smoothy",
  셀렉토커피:"selecto",
  빽다방: "paiksdabang",
  베스킨라빈스:"baskin",
  메가커피:"megacoffee",
  매머드:"mammoth",
  드롭탑:'droptop',
  더벤티:'theventi',
  달콤커피:"dalkomm",
  나우커피:"nowcoffee",
  공차:'gongcha',
  개인카페:"selfcafe",
  바나프레소:"banapresso",
}
const Profile = () => {
  const dispatch = useDispatch()
  const nickname = sessionStorage.getItem("nickname")
  const nowCafe = JSON.parse(sessionStorage.getItem("myCafe"))
  const todayCafe = JSON.parse(sessionStorage.getItem("todayCafe"))
  const tierColor = todayCafe && 
    parseInt(todayCafe.exp / 1000) < 4
      ? ["#8B6331", "#C0C0C0", "#FF9614", "#3DFF92"][
          parseInt(todayCafe.exp / 1000)
        ]
      : "#65B1EF"

  return (
    <Grid.Row columns={2}>
      <Grid.Column width={3} verticalAlign="middle">
        {todayCafe ? 
        <Item.Image
          size="tiny"
          src={require(`../../assets/cafe_logos/${BRAND_LOGOS[todayCafe.brandType]}.png`)}
          style={{ border: `0.5rem solid ${tierColor}`, borderRadius: "70%", marginBottom:"1rem"}}

        /> : 
        <BsFillPatchQuestionFill
              style={{ marginInline: "0.5rem 0.8rem" }}
              size="36"
              color="grey"
            />
        }
      </Grid.Column>
      <Grid.Column width={5} verticalAlign="middle">
        <Item.Content>
          <Item.Header>
            <h2>{nickname}</h2>
          </Item.Header>
        </Item.Content>
        {nowCafe ? (
          <Item.Extra style={{opacity:"50%", fontSize:"8px"}}>{nowCafe.cafeName}</Item.Extra>
        ):<Button onClick={()=>{dispatch(modalActions.openCafeAuthModal())}}>위치 인증</Button>}
      </Grid.Column>
    </Grid.Row>
  )
}

export default Profile
