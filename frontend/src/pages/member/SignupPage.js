import Signup from "../../components/member/signup/Signup"
import { Image } from "semantic-ui-react"

const SignupPage = () => {
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
      <Image src={require("../../assets/icons/kagongjoa_logo.png")} />
      <h1 id="title">카공조아</h1>
      <Signup />
    </div>
  )
}

export default SignupPage
