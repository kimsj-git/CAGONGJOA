import { Carousel } from "primereact/carousel"
import { Button } from "semantic-ui-react"
import { useSelector, useDispatch } from "react-redux"

import { cafeActions } from "../../store/cafe"
import "./MapCafeFilterCarousel.css"

const MapCafeFilterCarousel = () => {
  const dispatch = useDispatch()
  const cafeBrandList = useSelector((state) => state.cafe.cafeBrandFilterList)
  const isFiltered = useSelector((state) => state.cafe.isFiltered)
  const carouselTemplate = (type) => {
    const filterHandler = (e) => {
      dispatch(
        cafeActions.filterCafeList({ brand: type, isFiltered: isFiltered })
      )
    }
    return (
      <Button
        onClick={filterHandler}
        circular
        color="blue"
        style={{
          fontSize: "10px",
          width: "auto",
          minWidth: "90%",
          height: "3em",
          margin: "4px 3px",
          whiteSpace: "nowrap"
          
        }}
      >
        {type}
      </Button>
    )
  }
  const responsiveOptions = [
    {
      breakpoint: "1444px",
      numVisible: 4,
      numScroll: 2,
    },
    {
      breakpoint: "768px",
      numVisible: 3,
      numScroll: 1,
    },
  ]
  return (
    <>
    {cafeBrandList.length>1 && 
      <Carousel
      value={cafeBrandList}
      responsiveOptions={responsiveOptions}
      // numVisible={4}
      // numScroll={1}
      itemTemplate={carouselTemplate}
      />
    }
    </>
  )
}

export default MapCafeFilterCarousel
