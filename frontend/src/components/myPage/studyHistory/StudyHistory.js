import HistoryCalendar from "./HistoryCalendar"
import StudyDetail from "./StudyDetail"

const StudyHistory = () => {
  return (
    <>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "3rem",
        }}
      >
        <h1>카공 생활</h1>
        <HistoryCalendar />
        <StudyDetail />
      </section>
    </>
  )
}

export default StudyHistory
