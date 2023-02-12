import { Modal, Image, Header, Icon, Button } from "semantic-ui-react"
import { useHistory } from "react-router-dom"
import { useState } from "react"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const GetBeanModal = (props) => {
  const history = useHistory()
  const [open, setOpen] = useState(props.open)
  
  const submitHandler = async (e) => {
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      const response = await fetch(`${REST_DEFAULT_URL}/cafe/crowd/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          crowdLevel: props.selectedBtn + 1,
          todayDate: `${year}${month}${day}`
        }),
      })
      const responseData = await response.json()
      console.log(responseData)
      if (responseData.httpStatus === "UNAUTHORIZED" && responseData.data.sign ==="CAFE"){
        setOpen(false)
        alert("카페 인증이 필요합니다.")
      } else if (responseData.httpStatus === "BAD_REQUEST" && responseData.data.sign ==="CAFE"){
        setOpen(false)
        alert("이미 혼잡도 설문을 제출 했습니다.")
      } else if (responseData.httpStatus === "BAD_REQUEST" && responseData.data.sign==="JWT"){
        const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`,{
          method: "GET",
          headers: {
            "Authorization-RefreshToken" : `Bearer ${sessionStorage.getItem('refreshToken')}`
          }
        })
        const responseData = await response.json()
        if (responseData.httpStatus!=="OK"){
          alert('세션이 만료되었습니다.')
          sessionStorage.clear()
          setOpen(false)
          history.push('/login')
        }else if(responseData.httpStatus === "OK"){
          sessionStorage.setItem('accessToken', responseData.data.accessToken)
          setOpen(false)
          alert('다시 시도해주세요.')
        }
      } else if(responseData.httpStatus === "CREATED"){
          setOpen(true)
          sessionStorage.setItem('jamSurvey', 1)
      }
  }
  return (
    <Modal
      open={open}
      basic
      onOpen={()=>{setTimeout(()=>{
        setOpen(false)
      }, 1500)}}
      closeOnDimmerClick={true}
      closeOnDocumentClick={true}
      trigger={
        <Button
          onClick={submitHandler}
          fluid
          style={{ border: "2px solid black", borderRadius: "20px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
            }}
          >
            제보하고 커피콩 받기
            <Image
              style={{ marginLeft: "1rem" }}
              size="mini"
              src="https://s3-alpha-sig.figma.com/img/3d57/ee59/7512ebf811543edb9b944eafc0d846fa?Expires=1676246400&Signature=EBj09c-4lJBEt0reRa3emego1szI92YMnXELzF0jVl2~Q~fc7iAsuWBsd1eFJj8DL8phy8xwLv11IyW6NhTHfd6ekm63SK6AqLu9aSTM9oyAN8-1XdK2YtCcX0-rxiLjVia09-h6yMO4U6zxeUHaKLFa4Rzg-m9f04vD5mSZLCVMi8KI1H4-c9mXNfQ-s2O2Fasy3cHlMtbW~YrVBIfV4i~Z-dUVi4ZUXqOpg~o6OiBW3TnKmBI3uMEZ9E0byTY2sNw2O~25NxQhVXiFDXH5rQVkjsI~ZE5ggSEzShxoGB8nqYxLfrE13i4YhfejKlYFn1pi3EK74gVfsKPhxJwxEg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
            />
          </div>
        </Button>
      }
    >
      <Header icon style={{ fontSize: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          <Icon name="plus" style={{ margin: "0" }} />
          <Image
            style={{ marginLeft: "1rem" }}
            size="small"
            src="https://s3-alpha-sig.figma.com/img/3d57/ee59/7512ebf811543edb9b944eafc0d846fa?Expires=1676246400&Signature=EBj09c-4lJBEt0reRa3emego1szI92YMnXELzF0jVl2~Q~fc7iAsuWBsd1eFJj8DL8phy8xwLv11IyW6NhTHfd6ekm63SK6AqLu9aSTM9oyAN8-1XdK2YtCcX0-rxiLjVia09-h6yMO4U6zxeUHaKLFa4Rzg-m9f04vD5mSZLCVMi8KI1H4-c9mXNfQ-s2O2Fasy3cHlMtbW~YrVBIfV4i~Z-dUVi4ZUXqOpg~o6OiBW3TnKmBI3uMEZ9E0byTY2sNw2O~25NxQhVXiFDXH5rQVkjsI~ZE5ggSEzShxoGB8nqYxLfrE13i4YhfejKlYFn1pi3EK74gVfsKPhxJwxEg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
          />
        </div>
        커피콩 1개 획득!
      </Header>
    </Modal>
  )
}

export default GetBeanModal
