import { useDispatch, useSelector } from "react-redux"
import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react"
import { Icon } from "semantic-ui-react"

import ImagePreview from "./ImagePreview"
import "./ImageUploadBox.css"
import { postActions } from "../../store/post"

const ImageUploadBox = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    reportImages() {
      console.log("reporting!")
      return uploadedImages
    },
  }))
  const dispatch = useDispatch()
  const uploadedImages = useSelector((state) => state.post.uploadedImage)
  const [previewImages, setPreviewImages] = useState([])
  const uploadBoxRef = useRef()
  const inputRef = useRef()
  useEffect(() => {
    const uploadBox = uploadBoxRef.current
    const input = inputRef.current
    const handleFiles = (files) => {
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue
        const reader = new FileReader()
        reader.onloadend = (e) => {
          const result = e.target.result
          if (result) {
            dispatch(postActions.handleFiles(result))
          }
        }
        reader.readAsDataURL(file)
      }
    }

    const changeHandler = (event) => {
      event.preventDefault()
      event.stopPropagation()
      const files = event.target.files
      handleFiles(files)
    }

    const dropHandler = (event) => {
      event.preventDefault()
      event.stopPropagation()
      const files = event.dataTransfer.files
      handleFiles(files)
    }

    const dragOverHandler = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    uploadBox.addEventListener("drop", dropHandler)
    uploadBox.addEventListener("dragover", dragOverHandler)
    input.addEventListener("change", changeHandler)

    return () => {
      uploadBox.removeEventListener("drop", dropHandler)
      uploadBox.removeEventListener("dragover", dragOverHandler)
      input.removeEventListener("change", changeHandler)
    }
  }, [dispatch])

  useEffect(() => {
    const imageJSXs = uploadedImages.map((image, index) => {
      const isDeleteImage = (element) => {
        return element === image
      }
      const deleteFunc = () => {
        const deleteimage = uploadedImages.findIndex(isDeleteImage)
        dispatch(postActions.removeImage(deleteimage))
      }
      return <ImagePreview image={image} deleteFunc={deleteFunc} key={index} />
    })
    setPreviewImages(imageJSXs)
  }, [uploadedImages, dispatch])

  return (
    <div className="ImageUploadBox">
      <label
        className="drag_or_click"
        htmlFor="img-upload-box"
        ref={uploadBoxRef}
      >
        <div className="icon_box">
          <Icon name="images outline" size="big" />
        </div>
        <div className="text_box">
          <h3>드래그 또는 클릭하여 업로드</h3>
        </div>
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        id="img-upload-box"
        ref={inputRef}
      />
      <div className="preview_wrapper">
        <div className="preview_container">{previewImages}</div>
      </div>
    </div>
  )
})

export default ImageUploadBox
