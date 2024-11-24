import { useNavigate } from "react-router-dom";

const BPlacePage = () => {
  const navigate = useNavigate();
  return (
    <div className="frame-publisher-course p-2 w-100 h-100 overflow-auto">
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-success text-white"
          //   onClick={() => navigate("/publisher/createcourse")}
        >
          Tạo Địa Điểm
        </button>
      </div>
    </div>
  );
};

export default BPlacePage;
