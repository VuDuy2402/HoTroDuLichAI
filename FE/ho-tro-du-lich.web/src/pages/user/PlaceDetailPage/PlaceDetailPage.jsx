/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import { placeService } from "../../../services/placeService";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import RateStar from "../../../common/components/RateStar/RateStar";
import { IoEyeSharp } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { LiaRouteSolid } from "react-icons/lia";
import TabCustom from "../../../common/components/TabCustom/TabCustom";
import { itineraryService } from "../../../services/itineraryService";
import { toast } from "react-toastify";
import Paging from "../../../common/components/Paging/Paging";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ReviewTab from "../../../common/components/Review/ReviewTab";
import MapCustom from "../../../common/components/MapCustom/MapCustom";
import useDocumentTitle from "../../../common/js/useDocumentTitle";
import styles from './PlaceDetailPage.module.scss';
import { FaPlusCircle } from "react-icons/fa";
import { Button } from "react-bootstrap";

const PlaceDetailPage = () => {
  const { placeId } = useParams();
  const [dataPlace, setDataPlace] = useState(null);
  const [errors, setErrors] = useState([]);
  useDocumentTitle('Chi tiết địa điểm');
  const [pagingData, setPagingData] = useState({
    currentPage: 1,
    total: 1,
    pageSize: 10,
  });
  const [itineraryFilter, setItineraryFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchQuery: "",
    filterProperty: {},
    sortProperty: {},
  });
  const [itineraryData, setItineraryData] = useState([]);
  const [tab, setTab] = useState(1);
  const handleDetailPage = async () => {
    const result = await placeService.getPlaceById(placeId);
    if (result) {
      if (result.success) {
        useDocumentTitle(`Du lịch ${result.data.name}`);
        setDataPlace(result.data);
      }
      else if (result.errors) {
        setErrors(result.errors);
      }
    } else {
      toast.error("Không thể kết nối đến server.");
    }
  };
  const handleIteraryPage = async () => {
    const result = await itineraryService.getWithPaging(
      placeId,
      itineraryFilter
    );
    if (result) {
      if (result.success) {
        setItineraryData(result.data.items);
        setPagingData({
          currentPage: result.data.currentPage,
          total: result.data.totalPages,
          pageSize: result.data.pageSize,
        });
      } else if (result.errors) {
        setErrors(result.errors);
      }
    } else {
      toast.error("Không thể kết nối đến server.");
    }
  };
  useEffect(() => {
    handleDetailPage();
  }, []);
  useEffect(() => {
    handleIteraryPage();
  }, [itineraryFilter]);

  const handleChangeTab = (data) => {
    setTab(data.id);
  };
  return (
    <div className="container-fluid p-0 pb-2">
      <div className="frame-img bg-black">
        <FormErrorAlert errors={errors} />
        {dataPlace && (
          <Swiper
            className="new-place-frame-swiper"
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides
            autoplay={true}
            loop={true}
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
            {dataPlace.imageDetailProperties &&
              dataPlace.imageDetailProperties.map((imgInfo) => (
                <SwiperSlide key={imgInfo.fileId} className="">
                  <div
                    className="w-100 d-flex justify-content-center bg-black"
                    style={{ height: "400px" }}
                  >
                    <img
                      className="h-100"
                      src={imgInfo.url}
                    ></img>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </div>
      {dataPlace && (
        <div className="container mt-2">
          <div className="frame-base-info rounded border shadow p-3">
            <div className="d-flex justify-content-between">
              <h3 className="">{dataPlace.name}</h3>
              <p className="text-secondary m-0">
                {dataPlace.ownerProperty?.fullName}
              </p>
            </div>
            <div className="d-flex align-items-center gap-1">
              <RateStar rate={dataPlace.rating} maxRate={5} color={"F1B600"} />
            </div>

            <div className="frame-analys d-flex flex-wrap justify-content-center align-items-center gap-2">
              <BoxIconInfo
                icon={<IoEyeSharp size={30} color="#309365" />}
                title={"Lượt xem"}
                value={dataPlace.totalView}
                style={{ width: "150px", height: "150px" }}
              />
              <BoxIconInfo
                icon={<IoChatboxEllipses size={30} color="#309365" />}
                title={"Số bình luận"}
                value={dataPlace.totalReview}
                style={{ width: "150px", height: "150px" }}
              />
              <BoxIconInfo
                icon={<LiaRouteSolid size={30} color="#309365" />}
                title={"Hành trình"}
                value={dataPlace.totalUseItinerary}
                style={{ width: "150px", height: "150px" }}
              />
            </div>
          </div>
          {dataPlace.address && (
            <div className="mt-3">
              <h6 className="text-muted">Địa chỉ:</h6>
              <p>{dataPlace.address}</p>
            </div>
          )}

          {dataPlace.description && (
            <div className="mt-3">
              <h6 className="text-muted">Mô tả:</h6>
              <p>{dataPlace.description}</p>
            </div>
          )}
          <div className="place-detail mt-3 p-1">
            <h5 className="">Chi tiết địa điểm</h5>
            <div style={{ maxHeight: "450px", marginBottom: "20px" }}>
              <MapCustom
                longitude={dataPlace.longitude}
                latitude={dataPlace.latitude}
                pin={true}
                zoom={30}
              />
            </div>
            <div className="more-detail-place">
              <TabCustom
                items={[
                  { label: "Hành trình", id: 1 },
                  { label: "Bình luận", id: 2 },
                ]}
                selectedItem={tab}
                onChange={handleChangeTab}
              />
              <div className="content-tab pt-2" style={{ height: "450px" }}>
                {tab === 1 && (
                  <ItineraryTab
                    placeId={placeId}
                    data={itineraryData}
                    paging={pagingData}
                    handleChangePage={(page) =>
                      setItineraryFilter((pre) => ({
                        ...pre,
                        pageNumber: page,
                      }))
                    }
                  />
                )}

                {tab === 2 && (
                  <ReviewTab placeId={placeId} rating={dataPlace.rating} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BoxIconInfo = ({ icon, title, value, style }) => {
  return (
    <div
      className="rounded border shadow p-3 d-flex flex-column justify-content-center align-items-center"
      style={style}
    >
      {icon}
      <h5>{title}</h5>
      <p className="fw-bold">{value}</p>
    </div>
  );
};

const ItineraryTab = ({ data, paging, handleChangePage, placeId }) => {
  return (
    <div className="w-100 p-2 pt-0 h-100 overflow-auto">
      <div
        className="position-sticky bg-white p-1 border-1 border-bottom"
        style={{ top: 0 }}
      >
        <Paging
          classActive={"bg-success text-white"}
          data={paging}
          onChange={(page) => handleChangePage(page)}
        />
      </div>
      <Button
        variant="primary"
        className={`${styles.createItineraryBtn} w-100`}
        onClick={() => window.location.href = `/diadiem/hanhtrinh/${placeId}/taomoichuyendi`}
      >
        <FaPlusCircle size={40} className={styles.iconCreate} />
        <span className="ms-2">Tạo mới chuyến đi</span>
      </Button>
      <hr />
      {
        data &&
        data.map((item) => <ItineraryRow key={item.itineraryId} data={item} />)
      }
    </div >
  );
};

const ItineraryRow = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      className="itinerary-items d-flex border-1 border-bottom p-2"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/hanhtrinh/${data.itineraryId}`)}
    >
      <div className="base-info w-50">
        <h4 className="m-0">{data.name}</h4>
        <p className="m-0 text-secondary">{data.ownerProperty?.fullName}</p>
      </div>
      <div className="stat-info w-50 d-flex justify-content-between">
        <div className="total-amount d-flex flex-column align-items-center">
          <h5 className="m-0 fw-bold text-success">Chi Phí</h5>
          <h5>{data.totalAmount}</h5>
        </div>
        <div className="total-day d-flex flex-column align-items-center">
          <h5 className="m-0 fw-bold text-primary">Ngày</h5>
          <h5>{data.totalDay}</h5>
        </div>
        <div className="total-day d-flex flex-column align-items-center">
          <h5 className="m-0 fw-bold text-warning">Lượt áp dụng</h5>
          <h5>{data.totalUse}</h5>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
