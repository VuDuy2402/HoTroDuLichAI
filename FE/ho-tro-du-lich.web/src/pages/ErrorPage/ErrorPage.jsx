import errorImg from "@/assets/img/page404.png";
import { useNavigate } from "react-router-dom";
const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-100 d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <img src={errorImg} className="w-25"></img>
      <button
        className="btn btn-outline-secondary"
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </button>
    </div>
  );
};

export default ErrorPage;
