import { useSelector } from "react-redux"
import { Icon } from "semantic-ui-react"

import classes from "./MapSpinner.module.css"

const MapSpinner = () => {
  const isLoading = useSelector((state) => state.cafe.isCafeListLoading)
  return (
    <>
      {isLoading && (
        <Icon
          name="spinner"
          loading
          size="huge"
          color="blue"
          className={classes.mapSpinner}
        />
      )}
    </>
  )
}

export default MapSpinner
