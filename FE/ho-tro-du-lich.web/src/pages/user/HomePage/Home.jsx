import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import bgKH from "@/assets/img/bgkh.webp";
import { CiLocationOn } from "react-icons/ci";
import "./Home.scss";
import { toast } from "react-toastify";
import * as signalR from "@microsoft/signalr";
import { localStorageService } from "../../../services/localstorageService";
import { placeService } from "../../../services/placeService";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { articleService } from "../../../services/articleService";
const Home = () => {
  const navigate = useNavigate();
  const [famousPlace, setFamousPlace] = useState([]);
  const [newPlace, setNewPlace] = useState([]);
  const [article, setArticle] = useState([]);
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7001/notificationHub", {
      accessTokenFactory: () => localStorageService.getAccessToken(),
    })
    .withAutomaticReconnect()
    .build();
  connection.on("ReceiveNotification", function (message) {
    toast.success(message);
  });

  connection.start().catch(function (err) {
    return console.error(err.toString());
  });

  const handlePlaceFamous = async () => {
    const dataSend = {
      pageNumber: 1,
      pageSize: 6,
      searchQuery: "",
      filterProperty: {},
      sortProperty: {},
    };
    const result = await placeService.getWithPaging(dataSend);
    if (result) {
      if (result.success) {
        console.log(result);
        setFamousPlace([...result.data.items]);
      }
    }
  };
  const handlePlaceNew = async () => {
    const dataSend = {
      pageNumber: 1,
      pageSize: 6,
      searchQuery: "",
      filterProperty: {},
      sortProperty: {},
    };
    const result = await placeService.getNewPlacePaging(dataSend);
    if (result) {
      if (result.success) {
        console.log(result);
        setNewPlace([...result.data.items]);
      }
    }
  };
  const handleArticle = async () => {
    const dataSend = {
      pageNumber: 1,
      pageSize: 6,
      searchQuery: "",
    };
    const result = await articleService.paging(dataSend);
    if (result) {
      if (result.success) {
        console.log(result);
        setArticle([...result.data.items]);
      }
    }
  };
  useEffect(() => {
    handlePlaceFamous();
    handlePlaceNew();
    handleArticle();
  }, []);
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
      <div className="row py-3 border-1 border-bottom">
        <div className="col-12 col-md-4 py-4">
          <StepIntroduce
            number={1}
            title={"Địa Điểm Hot Nhất"}
            description={"Cập nhật các địa điểm hot nhanh chóng"}
          />
        </div>
        <div className="col-12 col-md-4 py-4">
          <StepIntroduce
            number={2}
            title={"Tin Tức Du Lịch Mới Nhất"}
            description={"Tin tức về các địa điểm du lịch mới nhất"}
          />
        </div>
        <div className="col-12 col-md-4 py-4">
          <StepIntroduce
            number={3}
            title={"Định Vị Chính Xác"}
            description={"Xác định địa điểm du lịch chính xác nhất"}
          />
        </div>
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
        <h2
          className="fw-bold text-success mt-5 mb-3"
          style={{ cursor: "pointer" }}
        >
          Các địa điểm nổi bật
        </h2>
        <div className="row">
          {famousPlace.map((place) => (
            <div key={place.placeId} className="col-6 col-md-4 p-1">
              <FamousLocation img={place.thumbnail} title={place.name} />
            </div>
          ))}
        </div>
      </div>
      <div
        className="container-fluid p-5"
        style={{
          backgroundImage:
            "url('https://bizweb.dktcdn.net/100/299/077/themes/642224/assets/sec_inbound_tour_bg.png?1705894497089')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="container">
          <h2
            className="fw-bold text-success mt-5 mb-3"
            style={{ cursor: "pointer" }}
          >
            Các địa điểm mới
          </h2>
          <div className="row">
            <Swiper
              className="new-place-frame-swiper"
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={3}
              // autoplay
              loop
              navigation
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
            >
              {newPlace.map((place) => (
                <SwiperSlide key={place.placeId}>
                  <NewHotPlace place={place} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <div className="container mb-3">
        <h2 className="fw-bold text-success mt-5 mb-4">Tin tức du lịch</h2>
        <div className="row">
          {
            <Swiper
              className="new-place-frame-swiper"
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={3}
              // autoplay
              loop
              navigation
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
            >
              {article.map((news) => (
                <SwiperSlide className="pt-3" key={news.placeId}>
                  <NewsTravel
                    img={news.thumbnail}
                    month={new Date(news.createdDate).getMonth() + 1}
                    year={new Date(news.createdDate).getFullYear()}
                    title={news.title}
                    description={news.content}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          }
        </div>
      </div>
      <div
        className="container-fluid p-3"
        style={{
          backgroundImage: `url(${bgKH})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="my-3 text-center mb-10 text-white p-3">
          <h1 className="text-success mb-3">Khách hàng đánh giá</h1>
          <div className="p-2" style={{ background: "#00000085" }}>
            <p className="m-0">
              Mục tiêu hàng đầu của chúng tôi là sự hài lòng của khách hàng
            </p>
            <p className="m-0">
              Faucibus tristique felis potenti ultrices ornare rhoncus semper
              hac facilisi Rutrum tellus lorem sem velit nisi non.
            </p>
            <p className="m-0">
              Đặt chuyến tham quan ngay hôm nay và tận hưởng khoản tiết kiệm độc
              quyền cho bất kỳ chuyến đi nào bạn đặt trong tương lai! Không có
              giới hạn thời gian hoặc ngày hết hạn đối với những khoản tiết kiệm
              này
            </p>
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
    <div className="famous-location__item position-relative overflow-hidden h-100 w-100">
      <img className="w-100 h-100" src={img}></img>
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

const NewHotPlace = ({ place }) => {
  return (
    <div
      className="new-place-frame d-flex flex-column p-2"
      style={{
        height: "400px",
        backgroundImage: `url(${place.thumbnail})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        cursor: "pointer",
      }}
    >
      <div className="new-place-frame__content w-100 h-100 d-flex justify-content-center align-items-end">
        <div className="content-place w-100 p-2 d-flex align-items-center justify-content-center">
          <p className="text-center text-white fw-bold fs-4 m-0">
            {place.name}
          </p>
        </div>
      </div>
    </div>
  );
};

const NewsTravel = ({ img, month, year, title, description }) => {
  return (
    <div
      className="news-travel__frame position-relative d-flex flex-column w-100 shadow border"
      style={{ height: "400px" }}
    >
      <img className="h-50" src={img}></img>
      <div className="news-travel__content h-50 p-2">
        <h5
          className="fw-bold w-100 overflow-hidden"
          style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
        >
          {title}
        </h5>
        <p
          className="w-100 overflow-hidden"
          style={{
            textOverflow: "ellipsis",
            height: "7.5em",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
      </div>
      <div
        className="news-travel__times position-absolute d-flex flex-column p-2"
        style={{
          width: "70px",
          height: "120px",
          top: "-20px",
          right: "10px",
          background: "#424242b8",
        }}
      >
        <p className="text-white fs-2 h-50 m-0 text-center border-1 border-bottom">
          {month}
        </p>
        <p className="text-white fs-5 h-50 m-0 text-center d-flex align-items-center justify-content-center">
          {year}
        </p>
      </div>
    </div>
  );
};

export default Home;