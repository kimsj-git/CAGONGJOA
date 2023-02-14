import { useEffect, useState } from "react"
import { Dropdown, Grid } from "semantic-ui-react"
import MapCafeDetial from "../../map/MapCafeDetail"
import MyCafeBadgeItem from "./MyCafeBadgeItem"
import GetMyCafe from "./GetMyCafe"

const MyCafeBadge = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isListLoading, setIsListLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectCafeDetail, setSelectCafeDetail] = useState({})
  const [cafeInfo, setCafeInfo] = useState({})
  const [myCafe, setMyCafe] = useState([])
  const [sortCafe, setSortCafe] = useState([])
  const options = [
    { key: 1, text: "티어 순", value: 1 },
    { key: 2, text: "티어 낮은 순", value: 2 },
    { key: 3, text: "이름 순", value: 3 },
  ]
  const sortHandler = (e) => {
    setIsListLoading(true)
    setSortVal(e.target.value)
    if (e.target.outerText === "티어 순") {
      const sortCafe = myCafe.sort((a, b) => {
        return b.exp - a.exp
      })
      setSortCafe(sortCafe)
    } else if (e.target.outerText === "티어 낮은 순") {
      const sortCafe = myCafe.sort((a, b) => {
        return a.exp - b.exp
      })
      setSortCafe(sortCafe)
    } else if (e.target.outerText === "이름 순") {
      const sortCafe = myCafe.sort((a, b) => {
        return a.cafeName < b.cafeName ? -1 : a.cafeName > b.cafeName ? 1 : 0
      })
      setSortCafe(sortCafe)
    }
  }
  useEffect(() => {
    setIsListLoading(false)
    setMyCafe(sortCafe)
  }, [sortCafe, isListLoading])

  const [sortVal, setSortVal] = useState(options[0].value)
  useEffect(() => {
    const getMyCafe = async () => {
      const data = await GetMyCafe()
      if (data === "ERROR") {
        alert("오류가 발생했습니다.")
      } else setMyCafe(data)
    }
    getMyCafe()
  }, [])

  const clickHandler = (detail) => {
    setOpen(true)
    setSelectCafeDetail(detail)
  }
  const closeHandler = () => {
    setOpen(false)
  }

  return (
    <section style={{textAlign:"center", marginTop:"3rem"}}>
      <h1>방문 카페 도감</h1>
      <section style={{display:"flex", justifyContent:"end", marginBottom:"2rem"}}>
        <Dropdown
          options={options}
          selection
          value={sortVal}
          onChange={sortHandler}
        />
      </section>
      <Grid>
        {myCafe.length > 0 &&
          myCafe.map((myCafe) => {
            return (
              <MyCafeBadgeItem
                key={myCafe.cafeId}
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
        address={cafeInfo.address}
        isLoading={isLoading}
        cafeDetail={selectCafeDetail}
      />
    </section>
  )
}

export default MyCafeBadge
