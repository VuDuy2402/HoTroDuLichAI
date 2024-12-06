import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import MapCustom from "../../../common/components/MapCustom/MapCustom";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import { itineraryService } from "../../../services/itineraryService";
import { CBusinessServiceType, CBusinessServiceTypeDescriptions } from "../../../enum/businessTypeEnum";
import { businessService } from "../../../services/businessService";
import { toast } from "react-toastify";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { toQueryString } from "@/utils/queryParams";
import { useDispatch } from "react-redux";
import { systemAction } from "@/redux/slices/systemSlice";
import { useNavigate } from "react-router-dom";

// Create options for business types
const options = Object.keys(CBusinessServiceType).map((key) => ({
  label: CBusinessServiceTypeDescriptions[CBusinessServiceType[key]],
  value: CBusinessServiceType[key],
}));

const RegisterNewBusinessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [positionMap, setPositionMap] = useState();
  const [avtFilId, setAvtFileId] = useState();
  const [provinceList, setProvinceList] = useState([]);
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    businessName: '',
    provinceId: null,
    businessType: 0,
    address: '',
    contactPersonInfo: {
      name: '',
      email: '',
      phoneNumber: ''
    }
  });

  // Fetch provinces list
  const handleGetAllProvince = async () => {
    try {
      dispatch(systemAction.enableLoading());
      const result = await itineraryService.getAllProvince();
      if (result && result.success) {
        const listConvert = result.data.map((item) => ({
          label: item.provinceName,
          value: item.provinceId,
        }));
        setProvinceList(listConvert);
      }
      else if (result && result.errors) {
        setErrors(result.errors);
      }
    }
    catch (err) {
      toast.error(`Đã có lỗi xảy ra ${err}`)
    }
    finally {
      dispatch(systemAction.disableLoading());
    }
  };

  useEffect(() => {
    handleGetAllProvince();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContactPersonChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      contactPersonInfo: {
        ...prevData.contactPersonInfo,
        [name]: value,
      },
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      dispatch(systemAction.enableLoading());
      const data = {
        ...formData,
        businessType: Number(formData.businessType),
        latitude: positionMap ? positionMap[0] : 0,
        longitude: positionMap ? positionMap[1] : 0,
        contactPersonInfo: {
          ...formData.contactPersonInfo,
          fileId: avtFilId,
          avatar: "",
        }
      };

      const result = await businessService.sendRequestBecomeBusiness(data);
      if (result) {
        if (result.success) {
          const queryString = toQueryString(result.data || {});
          navigate(`/thongbao/?${queryString}`);
        } else if (result.errors) {
          setErrors(result.errors);
        }
      }
      else {
        toast.error("Không thể kết nối đến server.");
      }
    }
    catch (err) {
      toast.error(`Đã có lỗi xảy ra: ${err}`);
    }
    finally {
      dispatch(systemAction.disableLoading());
    }
  };

  return (
    <div className="request-business p-2 container">
      <h4>Đăng ký trở thành Doanh nghiệp</h4>
      <Form onSubmit={handleSubmitForm}>
        <FormErrorAlert errors={errors} />

        <h5>Thông tin doanh nghiệp</h5>

        <Form.Group controlId="businessName">
          <Form.Label>Tên Doanh Nghiệp</Form.Label>
          <Form.Control
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
          />
          <ErrorField errorList={errors} field={"BusinessName_Error"} />
        </Form.Group>

        <MapCustom
          label="Vị trí"
          pin={false}
          onChangePosition={(data) => setPositionMap(data)}
        />
        <ErrorField errorList={errors} field={"Longitude_Error"} />
        <ErrorField errorList={errors} field={"Latitude_Error"} />

        <Form.Group controlId="provinceId" className="my-2">
          <Form.Label>Tỉnh</Form.Label>
          <Form.Select
            name="provinceId"
            value={formData.provinceId}
            onChange={handleInputChange}
          >
            <option value="">Chọn tỉnh</option>
            {provinceList.map((province) => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </Form.Select>
          <ErrorField errorList={errors} field="ProvinceId_Error" />
        </Form.Group>

        <Form.Group controlId="businessType">
          <Form.Label>Loại doanh nghiệp</Form.Label>
          <Form.Select
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
          >
            <option value="">Chọn loại doanh nghiệp</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          <ErrorField errorList={errors} field="BusinessType_Error" />
        </Form.Group>

        <Form.Group controlId="address">
          <Form.Label>Địa chỉ</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <ErrorField errorList={errors} field="Address_Error" />
        </Form.Group>

        <h5>Thông tin người liên hệ</h5>

        <Form.Group controlId="contactPersonName">
          <Form.Label>Tên người Liên hệ</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.contactPersonInfo.name}
            onChange={handleContactPersonChange}
          />
          <ErrorField errorList={errors} field="ContactPersonInfo.Name_Error" />
        </Form.Group>

        <Form.Group controlId="contactPersonEmail">
          <Form.Label>Email người Liên hệ</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.contactPersonInfo.email}
            onChange={handleContactPersonChange}
          />
          <ErrorField errorList={errors} field="ContactPersonInfo.Email_Error" />
        </Form.Group>

        <Form.Group controlId="contactPersonPhone">
          <Form.Label>Số điện thoại liên hệ</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            value={formData.contactPersonInfo.phoneNumber}
            onChange={handleContactPersonChange}
          />
          <ErrorField errorList={errors} field="ContactPersonInfo.PhoneNumber_Error" />
        </Form.Group>

        <ImageUploadGallery
          label="Ảnh đại diện người liên hệ"
          onImagesUploaded={(data) => setAvtFileId(data)}
          onImagesRemove={() => setAvtFileId(null)}
          multiple={false}
        />
        <ErrorField errorList={errors} field="ContactPersonInfo.FileId_Error" />

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="light" type="button">
            Huỷ
          </Button>
          <Button variant="success" type="submit">
            Gửi Yêu Cầu
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterNewBusinessPage;
