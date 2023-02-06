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
    console.log("X")
  }
}

export default SetLocation
