import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { systemAction } from "@/redux/slices/systemSlice";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { authService } from "@/services/authServices";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { localStorageService } from "@/services/localstorageService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import PasswordStrengthIndicator from "../../../common/components/Password/PasswordStrengthIndicator";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorList, setErrorList] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    try {
      const result = await authService.login(formData);
      if (result && result.success) {
        localStorageService.setToken(JSON.stringify(result.data));
        navigate("/");
      } else {
        if (result.errors) {
          setErrorList(result.errors);
        } else {
          toast.error("Đã có lỗi xảy ra. Error: " + result);
        }
      }
    } catch (e) {
      toast.error("Đã có lỗi xảy ra. Error: " + e);
    }
    dispatch(systemAction.disableLoading());
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const { credential } = credentialResponse;
    dispatch(systemAction.enableLoading());
    try {
      const result = await authService.googlelogin({ idToken: credential });
      if (result && result.success) {
        localStorageService.setToken(JSON.stringify(result.data));
        navigate("/");
      } else {
        if (result.errors) {
          setErrorList(result.errors);
        } else {
          toast.error("Đã có lỗi xảy ra. Error: " + result);
        }
      }
    } catch (e) {
      toast.error("Đã có lỗi xảy ra. Error: " + e);
    }
    dispatch(systemAction.disableLoading());
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="d-flex flex-column gap-2 w-100">
        <div className="d-flex gap-1 justify-content-center">
          <h4 className="rounded-0 fw-bold mb-3">Đăng nhập</h4>
        </div>
        <div>
          <Form onSubmit={handleSubmitForm}>
            <FormErrorAlert errors={errorList} />

            <Form.Group className="mb-3">
              <Form.Label htmlFor="login-email" className="fw-bold">
                Email
              </Form.Label>
              <Form.Control
                type="email"
                id="login-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Vui lòng nhập email"
              />
              <ErrorField errorList={errorList} field={"Email_Error"} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="login-pass" className="fw-bold">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                id="login-pass"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Vui lòng nhập password"
              />
              <ErrorField errorList={errorList} field={"Password_Error"} />
              <PasswordStrengthIndicator password={formData.password} />
            </Form.Group>

            <Button type="submit" variant="success" className="fw-bold w-100 mt-4">
              <FaSignInAlt className="me-2" />
              Đăng nhập
            </Button>
          </Form>

          <Button
            variant="link"
            className="w-100 mt-2 text-decoration-none"
            onClick={() => navigate("/dangky")}
          >
            <FaUserPlus className="me-2" />
            Đăng ký ngay
          </Button>

          <p className="mt-5 mb-4 text-center">Or sign in with</p>
          <div className="d-flex gap-3 justify-content-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onFailure={(error) =>
                toast.error(`Google Login Failed: ${error}`)
              }
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
