import Signup from "../../components/member/signup/Signup"
import { Image } from "semantic-ui-react"

const SignupPage = ({setIsAuthenticated}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5rem",
      }}
    >
      <Image src={require("../../assets/icons/kagongjoa_logo.png")} style={{width:"20rem", height:"20rem"}} />
      <h1 id="title">카공조아</h1>
      <Signup setIsAuthenticated={setIsAuthenticated}/>
    </div>
  )
}

export default SignupPage
