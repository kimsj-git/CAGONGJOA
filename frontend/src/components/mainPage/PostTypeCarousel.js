import { Carousel } from "primereact/carousel";
import { Button } from "semantic-ui-react";
import ToggleButton from "../common/ToggleButton";
import "./PostTypeCarousel.css";

const PostTypeCarousel = () => {
  const postTypes = [
    { key: "hot", text: "HOT", value: "hot", icon: "hotjar" },
    { key: "free", text: "자유", value: "free", icon: "chat" },
    { key: "qna", text: "궁금해요", value: "qna", icon: "question" },
    { key: "together", text: "같이해요", value: "together", icon: "handshake" },
    { key: "tip", text: "정보공유", value: "tip", icon: "lightbulb" },
    {
      key: "recommend",
      text: "추천해요",
      value: "recommend",
      icon: "thumbs up",
    },
    { key: "help", text: "해주세요", value: "help", icon: "bullhorn" },
    { key: "lost", text: "분실물센터", value: "lost", icon: "box" },
  ];
  // const carouselTemplate = (type) => {
  //   return (
  //     <Button
  //       label={type.text}
  //       className="p-button-rounded p-button-outlined p-button-warning"
  //     />
  //   );
  // };
  // const responsiveOptions = [
  //   {
  //     breakpoint: "1024px",
  //     numVisible: 6,
  //     numScroll: 2,
  //   },
  //   {
  //     breakpoint: "768px",
  //     numVisible: 4,
  //     numScroll: 1,
  //   },
  //   {
  //     breakpoint: "560px",
  //     numVisible: 3,
  //     numScroll: 1,
  //   },
  const postTypeBtns = postTypes.map((type) => {
    return (
      <ToggleButton
        key={type.key}
        btnType="type-select"
        icon={type.icon}
        content={type.text}
        basic={true}
        inverted={false}
      />
    );
  });
  // ];

  return (
    <div style={{ display: "flex", whiteSpace: "nowrap" }}>{postTypeBtns}</div>
    // <Carousel
    //   value={postTypes}
    //   // numScroll={2}
    //   numVisible={6}
    //   // responsiveOptions={responsiveOptions}
    //   itemTemplate={carouselTemplate}
    // />
  );
};

export default PostTypeCarousel;
