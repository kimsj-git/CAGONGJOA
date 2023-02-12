import { useState } from "react"
import { Modal, ModalHeader, Icon } from "semantic-ui-react"

const JAMLIST = {"H":"혼잡", "M":"보통", "L":"여유"}

const MapCafeDetial = (props) => {
  const [isShowMore, setIsShowMore] = useState(false)
  const detailHandler = () => {
    setIsShowMore(!isShowMore)
  }
  return (
    <Modal
      onClose={props.closeHandler}
      open={props.open}
      size="mini"
      dimmer="blurring"
    >
      <ModalHeader>
        {props.name} {/*카페이름*/} {JAMLIST[props.crowdLevel]} {/*혼잡도*/}
      </ModalHeader>
      <Modal.Content>
        <p>
          <Icon.Group>
            <Icon name="map" color="brown" />
            <Icon corner="top right" name="map marker alternate" color="red" />
          </Icon.Group>
          주소: {props.address}
        </p>
        <p>
          <Icon name="fire" color="red" />
          5명 이용중(어떻게 가져올지?)
        </p>
        <p>
          <Icon name="clock" color="orange" /> 10:00 ~ 20:00
        </p>
        {isShowMore && (
          <>
            <p>
              <Icon name="plug" color="yellow" /> 충분:0 보통:0 부족:0
            </p>
            <p>
              <Icon name="wifi" color="green" /> 원활:4 보통:0 불안:0
            </p>
            <p>
              <Icon name="bath" color="blue" /> 청결:0 보통:0 열악:0
            </p>
            <p>
              <Icon name="hourglass half" color="grey" />
              시간 제한 2시간
            </p>
          </>
        )}
        <p>
          <Icon name="coffee" color="brown" />
          4500원 아메리카노 가격
        </p>
        {isShowMore ? (
          <Icon name="angle up" link onClick={detailHandler} />
        ) : (
          <Icon name="angle down" link onClick={detailHandler} />
        )}
      </Modal.Content>
    </Modal>
  )
}

export default MapCafeDetial
