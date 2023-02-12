import { Header, Image } from "semantic-ui-react"

const ErrorPage = () => {
  return (
    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" ,marginTop:"5rem"}}>
      <Image src={require("../assets/icons/kagongjoa_logo.png")} style={{width:"30rem", height:"30rem"}}/>
      <Header as="h1" textAlign="center">
        Error
        <Header.Subheader>
          죄송합니다. 오류가 발생했습니다.
        </Header.Subheader>
      </Header>
    </div>
  )
}
export default ErrorPage
