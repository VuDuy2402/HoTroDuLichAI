import { Controller, useForm } from "react-hook-form";
import Input from "../../../common/components/Input/Input";
import Select from "react-select";
import MapCustom from "../../../common/components/MapCustom/MapCustom";
import { useEffect, useState } from "react";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import { itineraryService } from "../../../services/itineraryService";
import {
  CBusinessType,
  PlaceTypeDescriptions,
} from "../../../enum/businessTypeEnum";
import { businessService } from "../../../services/businessService";
import { toast } from "react-toastify";
const options = Object.keys(CBusinessType).map((key) => ({
  label: PlaceTypeDescriptions[CBusinessType[key]],
  value: CBusinessType[key],
}));
const RegisterBusinessPage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [positionMap, setPositionMap] = useState();
  const [avtFilId, setAvtFileId] = useState();
  const [provinceList, setProvinceList] = useState([]);

  const handleGetAllProvince = async () => {
    const result = await itineraryService.getAllProvince();
    if (result) {
      if (result.success) {
        const listConvert = result.data.map((item) => ({
          label: item.provinceName,
          value: item.provinceId,
        }));
        setProvinceList(listConvert);
      }
    }
  };
  useEffect(() => {
    handleGetAllProvince();
  }, []);
  console.log(errors);

  const handleSubmitRegisterForm = async (data) => {
    if (!positionMap) {
      setError("map", { type: "custom", message: "Vui lòng chọn vị trí" });
      return;
    }
    if (!avtFilId) {
      setError("avatar", { type: "custom", message: "Vui lòng chọn avatar" });
      return;
    }
    data.latitude = positionMap[0];
    data.longitude = positionMap[1];
    data.contactPersonInfo.fileId = avtFilId;
    data.contactPersonInfo.avatar = "";
    console.log(data);
    const result = await businessService.sendRequestBecomeBusiness(data);
    if (result) {
      if (result.success) {
        toast.success("Gửi yêu cầu thành công.");
      } else {
        toast.error("Xảy ra lỗi.");
      }
    }
  };
  useEffect(() => {
    if (avtFilId) {
      clearErrors("avatar");
    }
    if (positionMap) {
      clearErrors("map");
    }
  }, [avtFilId, positionMap]);
  return (
    <div className="request-business p-2 container">
      <h4>Đăng ký trở thành Doanh nghiệp</h4>
      <form
        className="form-register"
        onSubmit={handleSubmit(handleSubmitRegisterForm)}
      >
        <h5>Thông tin doanh nghiệp</h5>
        <Input
          label={"Tên Doanh Nghiệp"}
          register={register}
          name={"businessName"}
          validate={{ required: "Vui lòng điền tên doanh nghiệp" }}
          errors={errors}
        />
        <MapCustom
          label={"Vị trí"}
          pin={false}
          onChangePosition={(data) => setPositionMap(data)}
        />
        {errors && errors["map"] && (
          <p className="text-danger">{errors["map"].message}</p>
        )}
        <div className="my-2">
          <label className="fw-bold">Tỉnh</label>
          <Controller
            name="provinceId"
            control={control}
            defaultValue={null}
            rules={{ required: "Vui lòng chọn tỉnh" }}
            render={({ field }) => (
              <Select
                options={provinceList}
                placeholder="Tỉnh"
                styles={{ zIndex: "999" }}
                onChange={(selectedOption) =>
                  field.onChange(selectedOption ? selectedOption.value : "")
                }
              />
            )}
          />
          {errors && errors["provinceId"] && (
            <p className="text-danger">{errors["provinceId"].message}</p>
          )}
        </div>
        <div>
          <label className="fw-bold">Loại doanh nghiệp</label>
          <Controller
            name="businessType"
            control={control}
            defaultValue={null}
            rules={{ required: "Vui lòng chọn loại doanh nghiệp" }}
            render={({ field }) => (
              <Select
                options={options}
                placeholder="Loại địa điểm"
                onChange={(selectedOption) =>
                  field.onChange(selectedOption ? selectedOption.value : "")
                }
              />
            )}
          />
          {errors && errors["businessType"] && (
            <p className="text-danger">{errors["businessType"].message}</p>
          )}
        </div>
        <Input
          label={"Địa chỉ"}
          name={"address"}
          register={register}
          validate={{ required: "Vui lòng điền địa chỉ" }}
          errors={errors}
        />
        <br></br>
        <h5>Thông tin người liên hệ</h5>
        <Input
          label={"Tên người Liên hệ"}
          register={register}
          name={"contactPersonInfo.name"}
          validate={{ required: "Vui lòng điền tên người liên hệ" }}
          errors={errors}
        />
        <Input
          label={"Email người Liên hệ"}
          register={register}
          name={"contactPersonInfo.email"}
          type="email"
          validate={{ required: "Vui lòng điền email người liên hệ" }}
          errors={errors}
        />
        <Input
          label={"Số điện thoại liên hệ"}
          register={register}
          name={"contactPersonInfo.phoneNumber"}
          validate={{ required: "Vui lòng điền số điện thoại người liên hệ" }}
          errors={errors}
        />
        <ImageUploadGallery
          label={"Ảnh đại diện người liên hệ"}
          onImagesUploaded={(data) => setAvtFileId(data)}
          onImagesRemove={() => setAvtFileId(null)}
          multiple={false}
        />
        {errors && errors["avatar"] && (
          <p className="text-danger">{errors["avatar"].message}</p>
        )}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light">
            Huỷ
          </button>
          <button type="submit" className="btn btn-success">
            Gửi Yêu Cầu
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterBusinessPage;
