import { FaStarHalfAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

const RateStar = ({ rate, maxRate, color }) => {
  const fullStar = Math.floor(rate);
  const halfStar = rate - fullStar > 0;
  const remainStar = maxRate - fullStar - (halfStar ? 1 : 0);
  const renderStar = [];

  for (let i = 0; i < fullStar; i++) {
    renderStar.push(<FaStar key={`full-${i}`} color={color} />);
  }
  if (halfStar) {
    renderStar.push(<FaStarHalfAlt key="half" color={color} />);
  }
  for (let i = 0; i < remainStar; i++) {
    renderStar.push(<FaRegStar key={`empty-${i}`} color={color} />);
  }

  return <div className="rate-star">{renderStar}</div>;
};

export default RateStar;