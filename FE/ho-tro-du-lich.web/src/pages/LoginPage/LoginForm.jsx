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
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
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
        }
        else {
          toast.error("Đã có lỗi xảy ra. Error : " + result);
        }
      }
    }
    catch (e) {
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
        }
        else {
          toast.error("Đã có lỗi xảy ra. Error : " + result);
        }
      }
    }
    catch (e) {
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
              onFailure={(error) => toast.error(`Google Login Failed: ${error}`)}
            />
            <a href="#!" className="btn btn-light border-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-facebook"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
              </svg>
              <span className="ms-2 fs-6">Facebook</span>
            </a>
            <a href="#!" className="btn btn-light border-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-twitter"
                viewBox="0 0 16 16"
              >
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.335 0-.143 0-.284-.01-.426A6.688 6.688 0 0 0 16 3.539a6.568 6.568 0 0 1-1.889.517A3.294 3.294 0 0 0 15.557 2a6.586 6.586 0 0 1-2.088.796A3.281 3.281 0 0 0 11.073 0a3.276 3.276 0 0 0-3.279 3.278c0 .257.03.506.085.747-2.726-.136-5.148-1.44-6.769-3.414A3.267 3.267 0 0 0 1.396 2.63a3.28 3.28 0 0 1-1.48-.408v.041c0 1.579 1.125 2.891 2.62 3.193A3.268 3.268 0 0 1 .64 5.69v.045c0 2.271 1.594 4.16 3.708 4.593a3.29 3.29 0 0 1-.864.115c-.211 0-.418-.022-.62-.058.42 1.311 1.63 2.268 3.07 2.296A6.591 6.591 0 0 1 0 13.088a9.281 9.281 0 0 0 5.034 1.477" />
              </svg>
              <span className="ms-2 fs-6">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
