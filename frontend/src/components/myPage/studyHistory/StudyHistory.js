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
        <HistoryCalendar />
        <StudyDetail />
      </section>
    </>
  )
}

export default StudyHistory
