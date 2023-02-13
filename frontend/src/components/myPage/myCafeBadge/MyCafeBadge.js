import { useState } from "react"
import { Grid } from "semantic-ui-react"
import MapCafeDetial from "../../map/MapCafeDetail"
import MyCafeBadgeItem from "./MyCafeBadgeItem"
import GetCafeDetail from "../../map/GetCafeDetail"

// 위도 경도도 얻어오기
const myCafe = [
  { id: 1, cafeName: "스타벅스 역삼점", BrandType: "스타벅스", exp: 9000 },
  { id: 2, cafeName: "바나프레소 역삼점", BrandType: "바나프레소", exp: 1200 },
  {
    id: 3,
    cafeName: "바나프레소 테헤란로점",
    BrandType: "바나프레소",
    exp: 1200,
  },
  { id: 4, cafeName: "파스쿠찌 역삼점", BrandType: "파스쿠찌", exp: 300 },
  { id: 5, cafeName: "엔제리너스 역삼점", BrandType: "엔제리너스", exp: 100 },
]

const MyCafeBadge = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectCafeDetail, setSelectCafeDetail] = useState({})
  const [cafeInfo, setCafeInfo] = useState({})
  const clickHandler = (detail) => {
    setOpen(true)
    setSelectCafeDetail(detail)
  }
  const closeHandler = () => {
    setOpen(false)
  }
  return (
    <section>
      <h1>방문 카페 도감</h1>
      <Grid>
        {myCafe.map((myCafe,index) => {
          return (
            <MyCafeBadgeItem
              key={myCafe.id}
              myCafe={myCafe}
              clickHandler={clickHandler}
              setCafeInfo={setCafeInfo}
              setIsLoading={setIsLoading}
            />
          )
        })}
      </Grid>
      <MapCafeDetial
        open={open}
        closeHandler={closeHandler}
        name={cafeInfo.name}
        isLoading={isLoading}
        cafeDetail={selectCafeDetail}
      />
    </section>
  )
}

export default MyCafeBadge
