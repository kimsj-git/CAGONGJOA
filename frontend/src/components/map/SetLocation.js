const SetLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      sessionStorage.setItem("location", JSON.stringify(location))
      return location
    })
    
  } else {
    alert('위치 인증 실패 새로고침 하세요.')
    window.location.reload()
  }
}

export default SetLocation
