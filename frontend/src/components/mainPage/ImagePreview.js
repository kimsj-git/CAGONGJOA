import { Icon } from "semantic-ui-react"

export default function ImagePreview({ image, deleteFunc }) {
  return (
    <div className="ImagePreview" draggable>
      <img src={image} alt="preview" />
      <div className="icon_container" onClick={deleteFunc}>
        <Icon name="delete" fitted></Icon>
      </div>
    </div>
  )
}
