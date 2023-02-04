import { Modal, Image, Header, Icon, Button } from "semantic-ui-react"
const GetBeanModal = (props) => {
  return (
    <Modal
      basic
      closeOnDimmerClick
      onClose={() => {
        props.setHasReported(true)
      }}
      trigger={
        <Button
          fluid
          style={{ border: "2px solid black", borderRadius: "20px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
            }}
          >
            제보하고 커피콩 받기
            <Image
              style={{ marginLeft: "1rem" }}
              size="mini"
              src="https://s3-alpha-sig.figma.com/img/3d57/ee59/7512ebf811543edb9b944eafc0d846fa?Expires=1676246400&Signature=EBj09c-4lJBEt0reRa3emego1szI92YMnXELzF0jVl2~Q~fc7iAsuWBsd1eFJj8DL8phy8xwLv11IyW6NhTHfd6ekm63SK6AqLu9aSTM9oyAN8-1XdK2YtCcX0-rxiLjVia09-h6yMO4U6zxeUHaKLFa4Rzg-m9f04vD5mSZLCVMi8KI1H4-c9mXNfQ-s2O2Fasy3cHlMtbW~YrVBIfV4i~Z-dUVi4ZUXqOpg~o6OiBW3TnKmBI3uMEZ9E0byTY2sNw2O~25NxQhVXiFDXH5rQVkjsI~ZE5ggSEzShxoGB8nqYxLfrE13i4YhfejKlYFn1pi3EK74gVfsKPhxJwxEg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
            />
          </div>
        </Button>
      }
    >
      <Header icon style={{ fontSize: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          <Icon name="plus" style={{ margin: "0" }} />
          <Image
            style={{ marginLeft: "1rem" }}
            size="small"
            src="https://s3-alpha-sig.figma.com/img/3d57/ee59/7512ebf811543edb9b944eafc0d846fa?Expires=1676246400&Signature=EBj09c-4lJBEt0reRa3emego1szI92YMnXELzF0jVl2~Q~fc7iAsuWBsd1eFJj8DL8phy8xwLv11IyW6NhTHfd6ekm63SK6AqLu9aSTM9oyAN8-1XdK2YtCcX0-rxiLjVia09-h6yMO4U6zxeUHaKLFa4Rzg-m9f04vD5mSZLCVMi8KI1H4-c9mXNfQ-s2O2Fasy3cHlMtbW~YrVBIfV4i~Z-dUVi4ZUXqOpg~o6OiBW3TnKmBI3uMEZ9E0byTY2sNw2O~25NxQhVXiFDXH5rQVkjsI~ZE5ggSEzShxoGB8nqYxLfrE13i4YhfejKlYFn1pi3EK74gVfsKPhxJwxEg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
          />
        </div>
        커피콩 1개 획득!
      </Header>
    </Modal>
  )
}

export default GetBeanModal
