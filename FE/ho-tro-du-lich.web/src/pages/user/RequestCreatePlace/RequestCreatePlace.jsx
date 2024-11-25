import { IoSend } from "react-icons/io5";
import { placeService } from "../../../services/placeService";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../common/components/Input/Input";
import Textarea from "../../../common/components/Textarea/Textarea";
import Select from "react-select";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import MapCustom from "../../../common/components/MapCustom/MapCustom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { systemAction } from "../../../redux/slices/systemSlice";
const options = Object.keys(CPlaceType).map((key) => ({
  label: PlaceTypeDescriptions[CPlaceType[key]],
  value: CPlaceType[key],
}));
const RequestCreatePlacePage = () => {
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [positionMap, setPositionMap] = useState(null);
  const [fileIds, setFileIds] = useState([]);
  const handleSubmitRequestNewPlace = async (data) => {
    data.isNew = true;
    if (!positionMap) {
      setError("map", {
        type: "custom",
        message: "Vui lòng chọn địa điểm trên bản đồ",
      });
      return;
    }
    data.latitude = positionMap[0];
    data.longtidute = positionMap[1];
    data.fileIds = fileIds;
    dispatch(systemAction.enableLoading());
    const result = await placeService.requestCreatePlace(data);
    dispatch(systemAction.disableLoading());
    if (result) {
      if (result.success) {
        toast.success("Gửi yêu cầu thành công.");
        navigate("/");
      } else {
        toast.error("Error:" + result.errors[0].error);
      }
    } else {
      navigate("/error");
    }
  };
  useEffect(() => {
    clearErrors("map");
  }, [positionMap]);
  return (
    <div className="frame-create-newplace p-2 container">
      <form onSubmit={handleSubmit(handleSubmitRequestNewPlace)}>
        <div className="header-newplace d-flex justify-content-between border-1 border-bottom py-2">
          <h4>Tạo địa điểm mới</h4>
          <button
            type="submit"
            className="btn btn-success d-flex gap-2 align-items-center"
          >
            Gửi yêu cầu <IoSend />{" "}
          </button>
        </div>
        <div className="newplace-body py-2">
          <Input
            label={"Tên địa điểm"}
            placeholder={"Điền tên địa điểm"}
            register={register}
            name={"name"}
          />
          <div className="placeType my-2">
            <label className="fw-bold my-1">Loại địa điểm</label>
            <Controller
              name="placeType"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <Select
                  options={options}
                  placeholder="Loại địa điểm"
                  onChange={(selectOption) =>
                    field.onChange(selectOption ? selectOption.value : "")
                  }
                />
              )}
            />
          </div>
          <Input
            label={"Địa chỉ"}
            placeholder={"Điền địa chỉ"}
            register={register}
            name={"address"}
          />
          <Textarea
            className={"mb-2 form-control"}
            label={"Mô tả"}
            placeholder={"Mô tả"}
            register={register}
            name={"description"}
          />
          <MapCustom
            pin={false}
            onChangePosition={(data) => setPositionMap(data)}
          />
          {errors.map && <p className="text-danger">{errors.map.message}</p>}
          <ImageUploadGallery
            label={"Hình ảnh địa điểm"}
            onImagesUploaded={(data) => setFileIds((pre) => [...pre, data])}
            onImagesRemove={(data) =>
              setFileIds((pre) => [...pre.filter((i) => i !== data)])
            }
          />
        </div>
      </form>
    </div>
  );
};

export default RequestCreatePlacePage;
