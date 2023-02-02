import TodayCafeNavigation from "../components/todayCafe/TodayCafeNavigation"

const TodayCafe = (props) => {
  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        borderRadius: "30px 30px 0px 0px",
        padding: "2rem",
        margin: '5px'
      }}
    >
      <TodayCafeNavigation />
      <main>{props.children}</main>
    </div>
  )
}

export default TodayCafe
