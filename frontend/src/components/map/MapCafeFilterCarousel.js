import { Carousel } from "primereact/carousel"
import { Button } from "semantic-ui-react"
import { useSelector,useDispatch } from "react-redux"

import { cafeActions } from "../../store/cafe"
import classes from "./MapCafeFilterCarousel.css"

const MapCafeFilterCarousel = () => {
  const dispatch = useDispatch()
  const cafeBrandList = useSelector((state) => state.cafe.cafeBrandFilterList)
  const isFiltered = useSelector((state)=> state.cafe.isFiltered)
  const carouselTemplate = (type) => {
    const filterHandler = (e) => {
      dispatch(cafeActions.filterCafeList({brand:type, isFiltered: isFiltered}))
    }
    return (
      <Button onClick={filterHandler}>{type}</Button>
    )
  }
  return (
    <Carousel
      value={cafeBrandList}
      // responsiveOptions={responsiveOptions}
      numVisible= {2}
      numScroll ={1}
      itemTemplate={carouselTemplate}
      className={classes.cafeFilterBtns}
    />
  )
}

export default MapCafeFilterCarousel
