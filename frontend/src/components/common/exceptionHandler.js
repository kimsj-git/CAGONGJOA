const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const exceptionHandler = async(props) => {
    if (props.status === "UNAUTHORIZED"){
        if(props.data.sign === "JWT"){
            const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
                method: "GET",
                headers: {
                  "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
                    "refreshToken"
                  )}`,
                },
              })
              const responseData = await response.json()
              if (responseData.httpStatus !== "OK") {
                sessionStorage.clear()
                window.location.href = '/login'
                alert('세션이 만료 되었습니다.')
            } else if (responseData.httpStatus === "OK") {
                sessionStorage.setItem("accessToken", responseData.data.accessToken)
                props.func(props.dataSet)
            }
        }else if (props.data.sign === "CAFE"){
            alert("카페 위치 인증이 필요합니다.")
        } else if (props.data.sign === "POST"){
            alert(`${props.errMsg}`)
        }
    }else if (props.status === "BAD_REQUEST"){
        if (props.data.sign === "cafe") {
            alert(`${props.errMsg}`)
        } else if (props.data.sign === "MEMBER"){
            alert(`${props.errMsg}`)
        } else{
            return new Error('에러가 발생했습니다.')
        }
    } else {
        return new Error('에러가 발생했습니다.')
    }
}

export default exceptionHandler