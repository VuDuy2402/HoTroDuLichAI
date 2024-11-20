import { useParams } from "react-router-dom";
import { placeService } from "../../../services/placeService";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import RateStar from "../../../common/components/RateStar/RateStar";
import { IoEyeSharp } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { LiaRouteSolid } from "react-icons/lia";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import TabCustom from "../../../common/components/TabCustom/TabCustom";
const PlaceDetailPage = () => {
  const { placeId } = useParams();
  const [dataPlace, setDataPlace] = useState(null);
  const [tab, setTab] = useState(1);
  const handleDetailPage = async () => {
    const result = await placeService.getPlaceById(placeId);
    if (result) {
      if (result.success) {
        console.log(result);
        setDataPlace(result.data);
      }
    }
  };
  const handleIteraryPage = async () => {};
  useEffect(() => {
    handleDetailPage();
  }, []);

  const handleChangeTab = (data) => {
    setTab(data.id);
  };
  return (
    <div className="container-fluid p-0 pb-2">
      <div className="frame-img bg-black">
        {dataPlace && (
          <Swiper
            className="new-place-frame-swiper"
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides
            // autoplay
            loop
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
                      src={
                        "	https://th.bing.com/th/id/R.b8f2aa68aec55912820cbf343660c563?rik=Ar1ZzL0N5cZG4g&pid=ImgRaw&r=0"
                      }
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
              <p className="m-0">{dataPlace.rating}</p>
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
          <div className="place-detail mt-3 p-1">
            <h5 className="">Chi tiết địa điểm</h5>
            <div style={{ height: "350px", marginBottom: "20px" }}>
              <MapContainer
                center={[dataPlace.latitude, dataPlace.longtitude]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[dataPlace.latitude, dataPlace.longtitude]}>
                  <Popup>{dataPlace.name}</Popup>
                </Marker>
              </MapContainer>
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
              <div className="content-tab" style={{ height: "400px" }}>
                {tab === 1 && <div className="tab-iterary h-100"></div>}
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

export default PlaceDetailPage;
