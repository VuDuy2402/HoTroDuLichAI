import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const BackButton = ({ to }) => {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-light"
      onClick={() => navigate(to)}
      style={{ width: "40px", height: "40px" }}
    >
      <MdOutlineArrowBackIosNew />
    </button>
  );
};

export default BackButton;
