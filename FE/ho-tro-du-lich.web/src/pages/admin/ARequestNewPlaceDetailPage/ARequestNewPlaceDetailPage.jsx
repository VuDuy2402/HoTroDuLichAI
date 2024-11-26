import { useEffect, useState } from "react";
import { placeService } from "../../../services/placeService";
import { useNavigate, useParams } from "react-router-dom";
import RowInfo from "../../../common/components/RowInfo/RowInfo";
import Textarea from "../../../common/components/Textarea/Textarea";
import MapCustom from "../../../common/components/MapCustom/MapCustom";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import {
  ApprovalTypeDescriptions,
  CApprovalType,
} from "../../../enum/approvalTypeEnum";
import { PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";

const ARequestNewPlaceDetailPage = () => {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const [dataDetail, setDataDetail] = useState();
  const handleGetInitData = async () => {
    const result = await placeService.getPlaceById(placeId);
    if (result) {
      if (result.success) {
        setDataDetail(result.data);
      }
    }
  };
  useEffect(() => {
    handleGetInitData();
  }, []);
  const handleApproOrNor = async (type) => {
    const result = await placeService.approveNewPlace({
      placeId: placeId,
      type: type,
    });
    if (result) {
      if (result.success) {
        toast.success("Thành công.");
        navigate("/admin/requestnewplace");
      } else {
        toast.error("Xảy ra lỗi." + result.errors[0].error);
      }
    } else {
      navigate("/error");
    }
  };
  return (
    <div className="frame-new-place-detail p-2">
      {dataDetail && (
        <div className="container">
          <h5 className="mb-3">Yêu cầu chấp thuận địa điểm mới</h5>
          <RowInfo
            title={"Trạng thái"}
            info={ApprovalTypeDescriptions[dataDetail.approvalType]}
          />
          <RowInfo title={"Tên địa điểm"} info={dataDetail.name} />
          <RowInfo title={"Địa chỉ"} info={dataDetail.address} />
          <Textarea
            disabled={true}
            value={dataDetail.description}
            label={"Mô tả"}
          />
          <br></br>
          <RowInfo
            title={"Người gửi"}
            info={dataDetail.ownerProperty?.fullName}
          />
          <RowInfo title={"Email"} info={dataDetail.ownerProperty?.email} />
          <br></br>
          <MapCustom
            latitude={dataDetail.latitude}
            longtitude={dataDetail.longtitude}
            pin={true}
            label={"Vị trí"}
          />
          <br></br>
          <div className="">
            <label className="fw-bold">Ảnh</label>
            <p>Số lượng : {dataDetail.imageDetailProperties.length}</p>
            <Swiper
              className="new-place-frame-swiper"
              spaceBetween={10}
              slidesPerView={1}
              style={{ height: "400px" }}
            >
              {dataDetail.imageDetailProperties.map((image) => (
                <SwiperSlide
                  key={image.fileId}
                  className="h-100 d-flex justify-content-center"
                >
                  <img className="h-100" src={image.url}></img>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <br></br>
          <div className="row-accept d-flex gap-2 justify-content-end p-2">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => handleApproOrNor(CApprovalType.Rejected)}
            >
              Từ chối
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleApproOrNor(CApprovalType.Accepted)}
            >
              Chấp thuận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARequestNewPlaceDetailPage;
