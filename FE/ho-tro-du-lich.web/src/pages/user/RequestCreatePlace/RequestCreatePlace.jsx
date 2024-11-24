import { IoSend } from "react-icons/io5";
import { placeService } from "../../../services/placeService";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../common/components/Input/Input";
import Textarea from "../../../common/components/Textarea/Textarea";
import Select from "react-select";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import MapCustom from "../../../common/components/MapCustom/MapCustom";
import { useState } from "react";
const options = Object.keys(CPlaceType).map((key) => ({
  label: PlaceTypeDescriptions[CPlaceType[key]],
  value: CPlaceType[key],
}));
const RequestCreatePlacePage = () => {
  const { register, handleSubmit, control } = useForm();
  const [positionMap, setPositionMap] = useState(null);
  const handleSubmitRequestNewPlace = (data) => {
    // const result = await placeService.requestCreatePlace(data);
    console.log("vao");
    data.latitude = positionMap[0];
    data.longtidute = positionMap[1];
    console.log(data);
  };
  return (
    <div className="frame-create-newplace p-2 container">
      <form onSubmit={handleSubmit(handleSubmitRequestNewPlace)}>
        <div className="header-newplace d-flex justify-content-between border-1 border-bottom py-2">
          <h4>Tạo địa điểm mới</h4>
          <button className="btn btn-success d-flex gap-2 align-items-center">
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
            label={"Mô tả"}
            placeholder={"Mô tả"}
            register={register}
            name={"description"}
          />
          <MapCustom
            pin={false}
            onChangePosition={(data) => setPositionMap(data)}
          />
          <ImageUploadGallery
            label={"Hình ảnh địa điểm"}
            onImagesUploaded={(data) => console.log("add", data)}
            onImagesRemove={(data) => console.log("remove", data)}
          />
        </div>
      </form>
    </div>
  );
};

export default RequestCreatePlacePage;
