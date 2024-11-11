import { useForm } from "react-hook-form";
import styles from "./RequestResetPasswordPage.module.scss";
import backgroundLogin from "@/assets/img/learning.png";
import { authService } from "../../../services/authServices";
import { useDispatch } from "react-redux";
import { systemAction } from "../../../redux/slices/systemSlice";
import { toast } from "react-toastify";
import FormErrorAlert from "../../../common/components/FormErrorAlert/FormErrorAlert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import Input from "../../../common/components/Input/Input";
const RequestResetPasswordPage = () => {
  return (
    <div
      className={`login-page container-fluid position-relative p-0 m-0 ${styles.forgetpage}`}
    >
      <div
        className={`login-page__card rounded-2 p-3 ${styles.forgetpage__card}`}
      >
        <RequestResetPasswordForm />
      </div>
      <div
        className={`login-page__background w-100 h-100 ${styles.forgetpage__background}`}
        style={{ backgroundImage: `url(${backgroundLogin})` }}
      ></div>
    </div>
  );
};

const RequestResetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [errorList, setErrorList] = useState([]);
  const handleSubmitForm = async (data) => {
    dispatch(systemAction.enableLoading());
    const fetchApi = await authService.requestResetPassword(data);
    if (fetchApi) {
      if (fetchApi.success) {
        toast.success(fetchApi.data.message);
      } else {
        setErrorList(fetchApi.errors);
      }
    }
    dispatch(systemAction.disableLoading());
  };
  return (
    <div className="forget-form d-flex flex-column gap-2 w-100 h-100">
      <div className="login-form__header d-flex gap-1">
        <button
          className={`btn btn-login rounded-0 text-white fw-bold ${styles.btn}`}
        >
          Quên mật khẩu
        </button>
      </div>
      <div className="login-form__body">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Input register={register} name={"email"} />
          <ErrorField errorList={errorList} field={"Email_Error"} />
          <p className="text-white">
            Vui lòng điền email mà bạn đã quên mật khẩu, chúng tôi sẽ gửi mail
            xác nhận về email này. Kiểm tra email và làm theo hướng dẫn trong
            email
          </p>
          <FormErrorAlert errors={errorList} />
          <button
            type="submit"
            className="btn btn-warning text-white w-100 fw-bold"
          >
            Yêu Cầu Đặt Lại Mật Khẩu
          </button>
        </form>
      </div>
      <div className="w-100 d-flex justify-content-center mt-auto">
        <button
          className={`btn btn-outline-light btn-register rounded-0 ${styles.btndeactive}`}
          onClick={() => navigate("/dangnhap")}
        >
          Quay lại Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
