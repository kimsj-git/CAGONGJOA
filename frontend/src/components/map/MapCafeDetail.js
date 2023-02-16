import { useState } from "react"
import { Modal, ModalHeader, Icon, List } from "semantic-ui-react"

const JAMLIST = { H: "혼잡", M: "보통", L: "여유" }

const MapCafeDetial = (props) => {
  const [isShowMore, setIsShowMore] = useState(false)
  const detailHandler = () => {
    setIsShowMore(!isShowMore)
  }
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
          style={{
            paddingInline: "3rem",
            borderRadius: "20px",
            backgroundColor: "var(--background-color)",
          }}
        >
          <ModalHeader style={{ backgroundColor: "var(--background-color)" }}>
            {props.name} {/*카페이름*/}{" "}
            {props.crowdLevel && JAMLIST[props.crowdLevel]} {/*혼잡도*/}
          </ModalHeader>
          <Modal.Content style={{ backgroundColor: "var(--background-color)" }}>
            <List relaxed size="large">
              <List.Item>
                <List.Content>
                  <List.Header>
                    <Icon.Group
                      style={{ display: "inline", marginRight: "0.5rem" }}
                    >
                      <Icon name="map" color="brown" />
                      <Icon
                        corner="top right"
                        name="map marker alternate"
                        color="red"
                      />
                    </Icon.Group>
                    {props.address}
                  </List.Header>
                  {/* <List.Description>just now.</List.Description> */}
                </List.Content>
              </List.Item>

              {isShowMore && (
                <>
                  <List.Item>
                    <List.Content>
                      <List.Header>
                        <Icon
                          name="wifi"
                          color="green"
                          style={{ marginRight: "0.7rem" }}
                        />
                        {`원활:
                  ${
                    props.cafeDetail && props.cafeDetail.replyPower_high
                      ? props.cafeDetail.replyPower_high
                      : 0
                  } 보통:
                  ${
                    props.cafeDetail && props.cafeDetail.replyPower_mid
                      ? props.cafeDetail.replyPower_mid
                      : 0
                  } 불안:
                  ${
                    props.cafeDetail && props.cafeDetail.replyPower_low
                      ? props.cafeDetail.replyPower_low
                      : 0
                  }`}
                      </List.Header>
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content>
                      <List.Header>
                        <Icon
                          name="plug"
                          color="yellow"
                          style={{ marginInline: "0.02rem 0.65rem" }}
                        />
                        {`충분: 
                  ${
                    props.cafeDetail && props.cafeDetail.replyWifi_high
                      ? props.cafeDetail.replyWifi_high
                      : 0
                  } 보통: 
                  ${
                    props.cafeDetail && props.cafeDetail.replyWifi_mid
                      ? props.cafeDetail.replyWifi_mid
                      : 0
                  } 부족: 
                  ${
                    props.cafeDetail && props.cafeDetail.replyWifi_low
                      ? props.cafeDetail.replyWifi_low
                      : 0
                  }`}
                      </List.Header>
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content>
                      <List.Header>
                        <Icon
                          name="bath"
                          color="blue"
                          style={{ marginRight: "0.65rem" }}
                        />
                        {`청결: 
                  ${
                    props.cafeDetail && props.cafeDetail.replyToilet_high
                      ? props.cafeDetail.replyToilet_high
                      : 0
                  } 보통: 
                  ${
                    props.cafeDetail && props.cafeDetail.replyToilet_mid
                      ? props.cafeDetail.replyToilet_mid
                      : 0
                  } 열악: 
                  ${
                    props.cafeDetail && props.cafeDetail.replyToilet_low
                      ? props.cafeDetail.replyToilet_low
                      : 0
                  }`}
                      </List.Header>
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content>
                      <List.Header>
                        <Icon
                          name="hourglass half"
                          color="grey"
                          style={{ marginRight: "0.7rem" }}
                        />
                        {`시간제한${
                          props.cafeDetail && props.cafeDetail.replyTime
                            ? "이 있어요!"
                            : " 없어요!"
                        }`}
                      </List.Header>
                    </List.Content>
                  </List.Item>
                </>
              )}
              <List.Item style={{ textAlign: "center" }}>
                <List.Content>
                  {isShowMore ? (
                    <Icon name="angle up" link onClick={detailHandler} />
                  ) : (
                    <Icon name="angle down" link onClick={detailHandler} />
                  )}
                </List.Content>
              </List.Item>
            </List>
          </Modal.Content>
        </Modal>
      )}
    </>
  )
}

export default MapCafeDetial
