import { useState } from "react";
import { authService } from "../../services/authServices";
import styles from "./Login.module.scss";
import { useForm } from "react-hook-form";
import { localStorageService } from "../../services/localstorageService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { systemAction } from "../../redux/slices/systemSlice";
import FormErrorAlert from "../../common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "../../common/components/ErrorField/ErrorField";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [errorList, setErrorList] = useState([]);

  const handleSubmitForm = async (data) => {
    dispatch(systemAction.enableLoading());
    try {
      const result = await authService.login(data);
      if (result && result.success) {
        localStorageService.setToken(JSON.stringify(result.data));
        navigate("/");
      } else {
        if (result.errors) {
          setErrorList(result.errors);
        } else {
          toast.error("Đã có lỗi xảy ra. Error : " + result);
        }
      }
    } catch (e) {
      toast.error("Đã có lỗi xảy ra. Error : " + e);
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
          toast.error("Đã có lỗi xảy ra. Error : " + result);
        }
      }
    } catch (e) {
      toast.error("Đã có lỗi xảy ra. Error : " + e);
    }
    dispatch(systemAction.disableLoading());
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="login-form d-flex flex-column gap-2 w-100">
        <div className="login-form__header d-flex gap-1 justify-content-center">
          <h4 className={`rounded-0 fw-bold mb-3`}>Đăng nhập</h4>
        </div>
        <div className="login-form__body">
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <FormErrorAlert errors={errorList} />
            <label htmlFor="login-email" className=" mb-1 fw-bold">
              Email
            </label>
            <input
              type="email"
              id="login-email"
              className={`mb-2 ${styles.input}`}
              placeholder="Vui lòng nhập email"
              autoComplete="one-time-code"
              {...register("email", {})}
            />
            <ErrorField errorList={errorList} field={"Email_Error"} />
            <label htmlFor="login-pass" className="mb-1 fw-bold">
              Password
            </label>
            <input
              type="password"
              id="login-pass"
              className={`${styles.input}`}
              placeholder="Vui lòng nhập password"
              autoComplete="one-time-code"
              {...register("password", {})}
            />
            <ErrorField errorList={errorList} field={"Password_Error"} />
            <input
              type="submit"
              className={`btn fw-bold mt-5 text-white bg-success ${styles.btnsubmit}`}
              value="Đăng nhập"
            />
          </form>
          <button
            className={`btn btn-register w-100 mt-2 rounded-0 ${styles.btndeactive}`}
            onClick={() => navigate("/dangky")}
          >
            Đăng ký ngay
          </button>
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
