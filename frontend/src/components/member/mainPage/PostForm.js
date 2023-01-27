import { useState } from "react"
import { Button, Image, Modal, Icon } from "semantic-ui-react"

const PostForm = () => {
  const [open, setOpen] = useState(false)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="large"
      trigger={
        <Button circular icon='write' size='big'/>
      }
    >
      <Modal.Header>글을 작성하세요!!</Modal.Header>
      <Modal.Content image>
        <Image size="medium" src="/images/wireframe/image-square.png" wrapped />
        <Modal.Description>
          <p>여기에 글작성</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => setOpen(false)} positive>
          Ok
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default PostForm
