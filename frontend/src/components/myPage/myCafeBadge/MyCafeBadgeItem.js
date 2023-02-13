import { Grid, Image, Popup } from "semantic-ui-react"
import GetCafeDetail from "../../map/GetCafeDetail"

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
  전광수: "jungwang",
  이디야커피: "edia",
  요거프레소: "yogerpresso",
  엔제리너스: "angelinus",
  스타벅스: "starbucks",
  스무디킹: "smoothy",
  셀렉토커피: "selecto",
  빽다방: "paiksdabang",
  베스킨라빈스: "baskin",
  메가커피: "megacoffee",
  매머드: "mammoth",
  드롭탑: "droptop",
  더벤티: "theventi",
  달콤커피: "dalkomm",
  나우커피: "nowcoffee",
  공차: "gongcha",
  개인카페: "selfcafe",
  바나프레소: "banapresso",
}

const MyCafeBadgeItem = ({
  myCafe,
  clickHandler,
  setCafeInfo,
  setIsLoading,
}) => {
  const tierColor =
    parseInt(myCafe.exp / 1000) < 5
      ? ["#8B6331", "#C0C0C0", "#FF9614", "#3DFF92"][
          parseInt(myCafe.exp / 1000)
        ]
      : "#65B1EF"
  const openDetail = async () => {
    setIsLoading(true)
    const cafeDetail =  await GetCafeDetail({lat:myCafe.latitude,lng:myCafe.longitude})
    setIsLoading(false)
    clickHandler(cafeDetail)
    setCafeInfo({ name: myCafe.cafeName, address: myCafe.address })
  }
  return (
    <Grid.Column width={4} style={{margin:"1rem"}}>
      <Popup
        trigger={
          <Image
            onClick={openDetail}
            src={require(`../../../assets/cafe_logos/${
              BRAND_LOGOS[myCafe.brandType]
            }.png`)}
            style={{ border: `1rem solid ${tierColor}`, borderRadius: "70%" }}
          />
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3>{myCafe.cafeName}</h3>
          <p>
            경험치: {myCafe.exp} / {(parseInt(myCafe.exp / 1000) + 1) * 1000}
          </p>
        </div>
      </Popup>
    </Grid.Column>
  )
}

export default MyCafeBadgeItem
