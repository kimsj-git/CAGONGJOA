import { Header, Image } from "semantic-ui-react"

const NotFound = () => {
  return (
    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" ,marginTop:"5rem"}}>
      <Image src={require("../assets/icons/kagongjoa_logo.png")} style={{width:"30rem", height:"25rem"}}/>
      <Header as="h1" textAlign="center">
        찾을 수 없음(404)
        <Header.Subheader>
          죄송합니다. 찾으시는 페이지가 존재하지 않습니다.
        </Header.Subheader>
      </Header>
    </div>
  )
}

export default NotFound
