import { useState } from "react"
import { Grid } from "semantic-ui-react"
import MapCafeDetial from "../../map/MapCafeDetail"
import MyCafeBadgeItem from "./MyCafeBadgeItem"
const myCafe = [
  { cafeName: "스타벅스 역삼점", BrandType: "스타벅스", exp: 9000 },
  { cafeName: "바나프레소 역삼점", BrandType: "바나프레소", exp: 1200 },
  { cafeName: "바나프레소 테헤란로점", BrandType: "바나프레소", exp: 1200 },
  { cafeName: "파스쿠찌 역삼점", BrandType: "파스쿠찌", exp: 300 },
  { cafeName: "엔제리너스 역삼점", BrandType: "엔제리너스", exp: 100 },
]
const MyCafeBadge = () => {
  const [open, setOpen] = useState(false)
  const clickHandler = () => {
    setOpen(true)
  }
  const closeHandler = () => {
    setOpen(false)
  }
  const [cafeInfo, setCafeInfo] = useState({})
  return (
    <section>
      <h1>방문 카페 도감</h1>
      <Grid>
        {myCafe.map((myCafe) => {
          return (
            <MyCafeBadgeItem
              myCafe={myCafe}
              clickHandler={clickHandler}
              setCafeInfo={setCafeInfo}
            />
          )
        })}
      </Grid>
      <MapCafeDetial
        open={open}
        closeHandler={closeHandler}
        name={cafeInfo.name}
      />
    </section>
  )
}

export default MyCafeBadge
