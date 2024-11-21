/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import { itineraryService } from "../../../services/itineraryService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCircle } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import RowInfo from "../../../common/components/RowInfo/RowInfo";
import {
  BusinessServiceTypeDescriptions,
  CBusinessServiceStatusDescription,
} from "../../../enum/businessTypeEnum";
import { convertFormatTimeToVN } from "../../../utils/functionUtils";
import BackButton from "../../../common/components/BackButton/BackButton";
const ItineraryDetailPage = () => {
  const { itineraryId } = useParams();
  const navigate = useNavigate();
  const [dataIti, setDataIti] = useState([]);
  const getInitData = async () => {
    const result = await itineraryService.getDetail(itineraryId);
    if (result) {
      if (result.success) {
        console.log(result);
        setDataIti(result.data);
      } else {
        toast.error("Lỗi");
      }
    } else {
      navigate("/error");
    }
  };
  useEffect(() => {
    getInitData();
  }, []);
  return (
    <div className="container p-2" style={{ height: "fit-content" }}>
      <h4 className="border-1 border-bottom p-2 text-success m-0 d-flex align-items-center">
        <BackButton to={"/hanhtrinh"} color="rgb(25 135 84)" />
        <span className="ms-2 m-0">Chi tiết hành trình</span>
      </h4>
      <div className="itinerary-detail d-flex flex-column gap-3">
        {dataIti &&
          dataIti.map((item, idx) => (
            <CardDay key={item.itineraryDetailId} data={item} idx={idx} />
          ))}
      </div>
    </div>
  );
};

const CardDay = ({ data, idx }) => {
  return (
    <div className="d-flex align-items-start gap-2">
      <div className="node">
        <FaCircle size={10} color="rgb(25 135 84)" />
      </div>
      <div className="title rounded shadow border mb-2 p-2 w-100">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="text-success border-1 border-bottom py-2 m-0 pb-3">
            Ngày {idx + 1}
          </h4>
          <p className="m-0">{convertFormatTimeToVN(data.time)}</p>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="info-business-detail p-2 overflow-hidden">
              <h5
                style={{
                  textWrap: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {data.businessProperty.name}
              </h5>
              <p
                className="d-flex align-items-center gap-2 m-0"
                style={{
                  textWrap: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <FaLocationDot color="rgb(25 135 84)" />
                {data.businessProperty.address}
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 border-1 border-start">
            <div className="info-contact-person d-flex gap-2 p-2">
              <div
                className="avt rounded-pill overflow-hidden border"
                style={{ width: "70px", minWidth: "70px", height: "70px" }}
              >
                <img src="w-100 h-100" alt="avatar"></img>
              </div>
              <div className="w-100 overflow-hidden">
                <h5
                  className="w-100"
                  style={{
                    textWrap: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {data.businessProperty.contactPerson.name}
                </h5>
                <p
                  className="gap-2 m-0"
                  style={{
                    textWrap: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <IoMdMail color="rgb(25 135 84)" className="me-1" />
                  {data.businessProperty.contactPerson.email}
                </p>
                <p
                  className="gap-2 m-0"
                  style={{
                    textWrap: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <FaPhoneAlt color="rgb(25 135 84)" className="me-1" />
                  {data.businessProperty.contactPerson.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="services">
          <Swiper
            className="new-place-frame-swiper"
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            modules={[Pagination]}
          >
            {data &&
              data.businessProperty &&
              data.businessProperty.serviceProperties &&
              data.businessProperty.serviceProperties.map((service, idx) => (
                <SwiperSlide key={idx}>
                  <div className="p-2">
                    <ServiceItem data={service} />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

const ServiceItem = ({ data }) => {
  return (
    <div className="service-item border rounded overflow-hidden">
      <div className="row">
        <div className="col-12 col-md-6">
          <img className="w-100" src={data.thumbnail}></img>
        </div>
        <div className="col-12 col-md-6">
          <div className="frame-info-service p-2">
            <h4>{data.name}</h4>
            <p>
              Trạng thái:{" "}
              <span className="text-danger">
                {CBusinessServiceStatusDescription[data.status]}
              </span>
            </p>
            <RowInfo
              title={"Giới hạn"}
              color="rgb(113 193 156)"
              info={
                data.quantity + " " + BusinessServiceTypeDescriptions[data.type]
              }
            />
            <RowInfo
              title={"Chi phí"}
              color="rgb(113 193 156)"
              info={data.amount + " VNĐ"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TypeCustom = ({ type, title }) => {
  let className = "";
  switch (type) {
    case 1:
      className = "bg-warning text-white";
      break;
    case 2:
      className = "bg-success text-white";
      break;
    case 3:
      className = "bg-danger text-white";
      break;
    default:
      className = "bg-secondary text-white";
      break;
  }
  return <div className={className}>{title}</div>;
};
export default ItineraryDetailPage;
