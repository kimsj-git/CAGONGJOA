import HistoryCalendar from "./HistoryCalendar"
import StudyDetail from "./StudyDetail"

const StudyHistory = () => {
  return (
    <>
      <h1>StudyHistory</h1>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginLeft: "20%",
          marginRight: "20%"
        }}
      >
        <HistoryCalendar />
        <StudyDetail />
      </section>
    </>
  )
}

export default StudyHistory
