import HistoryCalendar from "./HistoryCalendar"
import StudyDetail from "./StudyDetail"

const StudyHistory = () => {
  return (
    <>
      <h1>카공 생활</h1>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <HistoryCalendar />
        <StudyDetail />
      </section>
    </>
  )
}

export default StudyHistory
