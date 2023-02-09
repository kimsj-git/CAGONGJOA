// 카카오 로그인 버튼 component
const KakaoLogin = () => {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=204f458585e0229e8443cd7bc1be5c5e&redirect_uri=http://i8a308.p.ssafy.io/oauth/kakao&response_type=code`

  return (
    <a href={KAKAO_AUTH_URL}>
      <img
        src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
        width="242"
        alt="카카오 로그인"
      />
    </a>
  )
}


export default KakaoLogin
