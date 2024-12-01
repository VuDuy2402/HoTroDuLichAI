import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { systemAction } from "@/redux/slices/systemSlice";
import { Form, Button, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { authService } from "@/services/authServices";
import { toQueryString } from "@/utils/queryParams";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import PasswordStrengthIndicator from "../../../common/components/Password/PasswordStrengthIndicator";
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorList, setErrorList] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    dispatch(systemAction.enableLoading());
    const result = await authService.signup(formData);
    if (result && result.success) {
      try {
        const queryString = toQueryString(result.data || {});
        navigate(`/thongbao/?${queryString}`);
      } catch (error) {
        toast.error(`Lỗi khi tạo query string: ${error.message}`);
      }
    } else if (result && result.errors) {
      setErrorList(result.errors);
    }
    dispatch(systemAction.disableLoading());
  };

  return (
    <div className="register-form d-flex flex-column gap-2 w-100">
      <div className="register-form__header d-flex gap-1">
        <h4 className="rounded-0 fw-bold mb-3">Đăng Ký</h4>
      </div>
      <div className="register-form__body">
        <Form onSubmit={handleSubmitForm}>
          <FormErrorAlert errors={errorList} />
          
          {/* Full Name Field */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="register-fullname" className="">Họ tên</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaUser /></InputGroup.Text>
              <Form.Control
                type="text"
                id="register-fullname"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập tên"
              />
            </InputGroup>
            <ErrorField errorList={errorList} field={"FullName_Error"} />
          </Form.Group>

          {/* Email Field */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="register-email" className="">Email</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaEnvelope /></InputGroup.Text>
              <Form.Control
                type="email"
                id="register-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
              />
            </InputGroup>
            <ErrorField errorList={errorList} field={"Email_Error"} />
          </Form.Group>

          {/* Password Field */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="register-pass" className="">Mật khẩu</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                id="register-pass"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập password"
              />
            </InputGroup>
            <ErrorField errorList={errorList} field={"Password_Error"} />
            <PasswordStrengthIndicator password={formData.password} />
          </Form.Group>

          {/* Confirm Password Field */}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="register-repass" className="">Xác nhận mật khẩu</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                id="register-repass"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại password"
              />
            </InputGroup>
            <ErrorField errorList={errorList} field={"ConfirmPassword_Error"} />
            <PasswordStrengthIndicator password={formData.confirmPassword} />
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="fw-bold w-100 mt-4"
          >
            <FaUserPlus className="me-2" />
            Đăng ký
          </Button>
        </Form>

        <Button
          variant="link"
          className="w-100 mt-2 text-decoration-none"
          onClick={() => navigate("/dangnhap")}
        >
          <FaSignInAlt className="me-2" />
          Đăng nhập
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
