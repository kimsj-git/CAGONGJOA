import { useState } from "react"
import { Modal, ModalHeader, Icon } from "semantic-ui-react"

const JAMLIST = { H: "혼잡", M: "보통", L: "여유" }

const MapCafeDetial = (props) => {
  const [isShowMore, setIsShowMore] = useState(false)
  const detailHandler = () => {
    setIsShowMore(!isShowMore)
  }
  console.log(props)
  return (
    <>
      {props.isLoading ? (
        <Icon name="spinner" loading />
      ) : (
        <Modal
          onClose={props.closeHandler}
          open={props.open}
          size="mini"
          dimmer="blurring"
        >
          <ModalHeader>
            {props.name} {/*카페이름*/} {props.crowdLevel && JAMLIST[props.crowdLevel]} {/*혼잡도*/}
          </ModalHeader>
          <Modal.Content>
            <p>
              <Icon.Group>
                <Icon name="map" color="brown" />
                <Icon
                  corner="top right"
                  name="map marker alternate"
                  color="red"
                />
              </Icon.Group>
              주소: {props.address}
            </p>
            {isShowMore && (
              <>
                <p>
                  <Icon name="wifi" color="green" /> 원활:
                  {props.cafeDetail && props.cafeDetail.replyPower_high ? props.cafeDetail.replyPower_high : 0} 보통:
                  {props.cafeDetail && props.cafeDetail.replyPower_mid ? props.cafeDetail.replyPower_mid : 0} 불안:
                  {props.cafeDetail && props.cafeDetail.replyPower_low ? props.cafeDetail.replyPower_low : 0}
                </p>
                <p>
                  <Icon name="plug" color="yellow" /> 충분:
                  {props.cafeDetail && props.cafeDetail.replyWifi_high ? props.cafeDetail.replyWifi_high : 0} 보통:
                  {props.cafeDetail && props.cafeDetail.replyWifi_mid ? props.cafeDetail.replyWifi_mid : 0} 부족:
                  {props.cafeDetail && props.cafeDetail.replyWifi_low ? props.cafeDetail.replyWifi_low : 0}
                </p>
                <p>
                  <Icon name="bath" color="blue" /> 청결:
                  {props.cafeDetail && props.cafeDetail.replyToilet_high ? props.cafeDetail.replyToilet_high : 0} 보통:
                  {props.cafeDetail && props.cafeDetail.replyToilet_mid ? props.cafeDetail.replyToilet_mid : 0} 열악:
                  {props.cafeDetail && props.cafeDetail.replyToilet_low ? props.cafeDetail.replyToilet_low : 0}
                </p>
                <p>
                  <Icon name="hourglass half" color="grey" />
                  시간제한 {props.cafeDetail && props.cafeDetail.replyTime ? "O" : "X"}
                </p>
              </>
            )}
            {isShowMore ? (
              <Icon name="angle up" link onClick={detailHandler} />
            ) : (
              <Icon name="angle down" link onClick={detailHandler} />
            )}
          </Modal.Content>
        </Modal>
      )}
    </>
  )
}

export default MapCafeDetial
