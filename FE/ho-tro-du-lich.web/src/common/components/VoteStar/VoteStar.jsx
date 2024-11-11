import { FaStar } from "react-icons/fa";
import { useState } from "react";
const VoteStar = ({
  maxStar,
  colorDefault = "black",
  colorHover = "yellow",
  onVote,
}) => {
  const [starHover, setStarHover] = useState(-1);
  const [selectStar, setSelectStar] = useState(-1);
  const renderStar = [];
  for (let i = 0; i < maxStar; i++) {
    renderStar.push(
      <FaStar
        ref={(el) => (refStar.current[i] = el)}
        className="item-star"
        key={`full-${i}`}
        color={i <= starHover ? colorHover : colorDefault}
        onClick={() => handleSelectStar(i)}
        onMouseEnter={() => handleMouseEnter(i)}
      />
    );
  }
  const handleSelectStar = (index) => {
    setSelectStar(index);
    setStarHover(index);
    onVote(index + 1);
  };
  const handleMouseEnter = (index) => {
    if (selectStar < 0) {
      setStarHover(index);
    }
  };
  const handleMouseLeave = () => {
    if (selectStar < 0) {
      setStarHover(-1);
    }
  };
  return (
    <div
      className="frame-vote-star__custom d-flex gap-1"
      onMouseLeave={handleMouseLeave}
    >
      {renderStar}
    </div>
  );
};

export default VoteStar;
