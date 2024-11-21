import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const BackButton = ({ to, color = "black" }) => {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-light"
      onClick={() => navigate(to)}
      style={{ width: "40px", height: "40px" }}
    >
      <MdOutlineArrowBackIosNew color={color} />
    </button>
  );
};

export default BackButton;
