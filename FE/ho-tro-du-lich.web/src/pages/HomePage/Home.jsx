import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import bgKH from "@/assets/img/bgkh.webp";
import { CiLocationOn } from "react-icons/ci";
import "./Home.scss";
import { toast } from "react-toastify";
import * as signalR from "@microsoft/signalr";
import { localStorageService } from "../../services/localstorageService";
const Home = () => {
  const navigate = useNavigate();
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7001/notificationHub", {
      accessTokenFactory: () => localStorageService.getAccessToken()
    })
    .withAutomaticReconnect()
    .build();
 connection.on("ReceiveNotification", function (message) {
    toast.success(message);
  });

  connection.start().catch(function (err) {
    return console.error(err.toString());
  });

  return (
    <>
      <div
        className="container-fluid p-5 d-flex align-items-center"
        style={{
          backgroundImage: `url(https://bizweb.dktcdn.net/100/372/532/themes/744930/assets/slider_2.jpg?1721978544764)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "400px",
        }}
      >
        <div className="main-content mx-auto w-100">
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column justify-content-center align-items-center gap-2 w-75">
              <h2 className="text-white text-center m-0">Du Lịch Cùng Với </h2>
              <h1
                className="text-success text-center"
                style={{
                  textShadow:
                    "-1px -1px 5px white, 1px -1px 5px white, -1px 1px 5px white, 1px 1px 5px white",
                }}
              >
                Ước Mơ Của Bạn
              </h1>
              <h5 className="text-white">DULICHDN Luôn Đồng Hành Cùng Bạn</h5>
              <div
                className="d-flex gap-2 justify-content-center w-100"
                style={{ maxWidth: "300px" }}
              >
                <input
                  className="form-control rounded-pill"
                  placeholder="Tìm kiếm địa điểm . . ."
                />
                <button className="btn btn-success">
                  <FaSearch color="white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ---------------------- */}
      <div
        className="frame-three-steps border-1 border-bottom d-flex justify-content-between p-3"
        style={{ height: "150px" }}
      >
        <StepIntroduce
          number={1}
          title={"Địa Điểm Hot Nhất"}
          description={"Cập nhật các địa điểm hot nhanh chóng"}
        />
        <StepIntroduce
          number={2}
          title={"Tin Tức Du Lịch Mới Nhất"}
          description={"Tin tức về các địa điểm du lịch mới nhất"}
        />
        <StepIntroduce
          number={3}
          title={"Định Vị Chính Xác"}
          description={"Xác định địa điểm du lịch chính xác nhất"}
        />
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-7">
            <div
              className="frame-why-choose d-flex flex-column justify-content-center align-items-center p-5 h-100"
              style={{}}
            >
              <h4 className="fw-bold">
                HÃY CHỌN <span className="text-success">DULICHDN</span>
              </h4>
              <h5>
                1.000 lý do tại sao bạn nên chọn đến với chúng tôi DulichDN, có
                1 thế giới tuyệt đẹp quanh ta hãy đến với chúng tôi
              </h5>
              <p className="text-secondary">
                Trang web của chúng tôi cung cấp thông tin về các địa điểm du
                lịch nổi bật và cập nhật tin tức du lịch mới nhất, giúp bạn dễ
                dàng lên kế hoạch cho hành trình khám phá của mình!
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-5">
            <img
              className="w-100"
              src="https://bizweb.dktcdn.net/100/319/254/themes/894747/assets/about.jpg?1676255871974"
            ></img>
          </div>
        </div>
        <h2 className="fw-bold text-success">Các địa điểm đến phổ biến</h2>
        <div className="row">
          <div className="col-6 col-md-4 p-1">
            <FamousLocation
              img={
                "https://bizweb.dktcdn.net/100/319/254/products/2.jpg?v=1529381089257"
              }
              title={"Đà Lạt"}
            />
          </div>
          <div className="col-6 col-md-4 p-1">
            <FamousLocation
              img={
                "https://bizweb.dktcdn.net/100/319/254/products/9.jpg?v=1529381887240"
              }
              title={"Phú Quốc"}
            />
          </div>
          <div className="col-6 col-md-4 p-1">
            <FamousLocation
              img={
                "https://bizweb.dktcdn.net/100/319/254/products/16.jpg?v=1529382039330"
              }
              title={"Cần Thơ"}
            />
          </div>
          <div className="col-6 col-md-4 p-1">
            <FamousLocation
              img={
                "https://bizweb.dktcdn.net/100/319/254/products/25.jpg?v=1529382237713"
              }
              title={"Đà Nẵng"}
            />
          </div>
          <div className="col-6 col-md-4 p-1">
            <FamousLocation
              img={
                "https://bizweb.dktcdn.net/100/319/254/products/1.jpg?v=1529382365957"
              }
              title={"Hạ Long"}
            />
          </div>
          <div className="col-6 col-md-4 p-1">
            <FamousLocation
              img={
                "https://bizweb.dktcdn.net/100/319/254/products/7.jpg?v=1529382490283"
              }
              title={"Sa Pa"}
            />
          </div>
        </div>
      </div>

      <div className="">
        <div className="my-5 text-center">
          <h1 className="text-primary">Top điểm đến nổi tiếng</h1>
          <div className="d-flex flex-row justify-content-center gap-3 px-3">
            <div className="">
              <div className="">
                <img
                  src="/src/assets/img/cauvang.jpg"
                  alt=""
                  className="w-100 h-100"
                />
              </div>
              <div className="mt-3">
                <h3 className="fs-5 text-left">Cầu Vàng Đà Nẵng</h3>
              </div>
              <button type="button" className="btn btn-primary">
                Xem chi tiết
              </button>
            </div>
            <div className="">
              <div className="">
                <img
                  src="/src/assets/img/bgHoiAn.jpg"
                  alt=""
                  className="w-100 h-100"
                />
              </div>
              <div className="mt-3">
                <h3 className="fs-5 text-left">Phố Cổ Hội An</h3>
              </div>
              <button type="button" className="btn btn-primary">
                Xem chi tiết
              </button>
            </div>
            <div className="">
              <div className="">
                <img
                  src="/src/assets/img/bgHoiAn.jpg"
                  alt=""
                  className="w-100 h-100"
                />
              </div>
              <div className="mt-3">
                <h3 className="fs-5 text-left">Cố đô Huế</h3>
              </div>
              <button type="button" className="btn btn-primary">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="my-3 text-center">
          <h1 className="text-primary">Tìm hiểu thêm về các tours du lịch</h1>
          <div className="d-flex flex-row justify-content-center gap-3 px-3">
            <div className="">
              <div className="">
                <img
                  src="/src/assets/img/cauvang.jpg"
                  alt=""
                  className="w-100 h-100"
                />
              </div>
              <div className="mt-3">
                <div className="fs-6" style={{ textAlign: "right" }}>
                  NEW - 19 Oct 2024
                </div>
                <h3 className="fs-5 text-left">Lan Ha Bay in Vietnam</h3>
              </div>
            </div>
            <div className="">
              <div className="">
                <img
                  src="/src/assets/img/bgHoiAn.jpg"
                  alt=""
                  className="w-100 h-100"
                />
              </div>
              <div className="mt-3">
                <div className="fs-6" style={{ textAlign: "right" }}>
                  NEW - 19 Oct 2024
                </div>
                <h3 className="fs-5 text-left">
                  Best Time to Visit Phu Quoc Island in Vietnam
                </h3>
              </div>
            </div>
            <div className="">
              <div className="">
                <img
                  src="/src/assets/img/bgHoiAn.jpg"
                  alt=""
                  className="w-100 h-100"
                />
              </div>
              <div className="mt-3">
                <div className="fs-6" style={{ textAlign: "right" }}>
                  NEW - 19 Oct 2024
                </div>
                <h3 className="fs-5 text-left">
                  Ninh Binh – Halong Bay on Land
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className=""
        style={{
          backgroundImage: `url(${bgKH})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="my-3 text-center mb-10">
          <h1 className="text-primary">Khách hàng đánh giá</h1>
          <div className="fs-6">
            Mục tiêu hàng đầu của chúng tôi là sự hài lòng của khách hàng
          </div>
          <div>
            Faucibus tristique felis potenti ultrices ornare rhoncus semper hac
            facilisi Rutrum tellus lorem sem velit nisi non.
          </div>
          <div>
            Đặt chuyến tham quan ngay hôm nay và tận hưởng khoản tiết kiệm độc
            quyền cho bất kỳ chuyến đi nào bạn đặt trong tương lai! Không có
            giới hạn thời gian hoặc ngày hết hạn đối với những khoản tiết kiệm
            này
          </div>
        </div>
      </div>
    </>
  );
};

const StepIntroduce = ({ number, title, description }) => {
  return (
    <div className="step-introduce d-flex flex-column justify-content-center align-items-center gap-1">
      <h1 className="fw-bold text-secondary m-0" style={{ fontSize: "4rem" }}>
        {number}
      </h1>
      <div className="step-introduce__information h-100 d-flex flex-column justify-content-center align-items-center">
        <h5 className="m-0">{title}</h5>
        <p className="m-0 text-body-tertiary" style={{ fontSize: "0.95rem" }}>
          {description}
        </p>
      </div>
    </div>
  );
};

const FamousLocation = ({ img, title }) => {
  return (
    <div className="famous-location__item position-relative">
      <img className="w-100" src={img}></img>
      <div
        className="famous-location__item__location bg-white d-flex align-items-center position-absolute px-2 py-1"
        style={{ bottom: 0, right: 0 }}
      >
        <CiLocationOn />
        <p className="m-0">{title}</p>
      </div>
    </div>
  );
};

export default Home;
