import { useSelector } from "react-redux"
import { Grid, Image, Popup } from "semantic-ui-react"
import GetCafeDetail from "../../map/GetCafeDetail"


const MyCafeBadgeItem = ({
  myCafe,
  clickHandler,
  setCafeInfo,
  setIsLoading,
}) => {
  const brandLogo = useSelector((state) => state.cafe.brandLogo)
  const tierColor =
    parseInt(myCafe.exp / 1000) < 4
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
    <Grid.Column width={4} style={{margin:"1rem", backgroundColor:"rgba(223, 223, 223, 0.6)", borderRadius:"80%"}}>
      <Popup
        trigger={
          <div>
            
          <Image
            onClick={openDetail}
            src={require(`../../../assets/cafe_logos/${
              brandLogo[myCafe.brandType]
            }.png`)}
            style={{ border: `0.5rem solid ${tierColor}`, borderRadius: "70%", marginBottom:"1rem"}}
            />
            <p style={{fontSize:"10px", fontWeight:"bold"}}>{myCafe.cafeName}</p>
            </div>
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
          {/* <h3>{myCafe.cafeName}</h3> */}
          <p>
            경험치: {myCafe.exp} / {(parseInt(myCafe.exp / 1000) + 1) * 1000}
          </p>
        </div>
      </Popup>
    </Grid.Column>
  )
}

export default MyCafeBadgeItem
