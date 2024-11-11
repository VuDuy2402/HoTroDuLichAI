import { useForm } from "react-hook-form";
import styles from "./RequestResetPasswordPage.module.scss";
import backgroundLogin from "@/assets/img/learning.png";
import Input from "../../../common/components/Input/Input";
import { authService } from "../../../services/authServices";
import { useDispatch } from "react-redux";
import { systemAction } from "../../../redux/slices/systemSlice";
import { toast } from "react-toastify";
import FormErrorAlert from "../../../common/components/FormErrorAlert/FormErrorAlert";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ErrorField from "@/common/components/ErrorField/ErrorField";

const ConfirmResetPasswordPage = () => {
  return (
    <div
      className={`login-page container-fluid position-relative p-0 m-0 ${styles.forgetpage}`}
    >
      <div
        className={`login-page__card rounded-2 p-3 ${styles.forgetpage__card}`}
      >
        <ConfirmResetPasswordForm />
      </div>
      <div
        className={`login-page__background w-100 h-100 ${styles.forgetpage__background}`}
        style={{ backgroundImage: `url(${backgroundLogin})` }}
      ></div>
    </div>
  );
};

const ConfirmResetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit } = useForm();
  const [errorList, setErrorList] = useState([]);
  
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const token = queryParams.get("token");

  useEffect(() => {
    if (!userId || !token) {
      toast.error("Parameter không hợp lệ");
      navigate("/dangnhap");
    }
  }, [userId, token, navigate]);

  const handleSubmitForm = async (data) => {
    dispatch(systemAction.enableLoading());

    const payload = {
      UserId: userId,
      Token: token,
      NewPassword: data.newPassword,
      NewPasswordConfirm: data.newPasswordConfirm,
    };

    const fetchApi = await authService.confirmResetPassword(payload);
    if (fetchApi) {
      if (fetchApi.success) {
        toast.success(fetchApi.data.message);
        navigate("/dangnhap");
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
          Xác Nhận Đổi Mật Khẩu
        </button>
      </div>
      <div className="login-form__body">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Input type={"password"} label={"Mật khẩu mới"} register={register} name={"newPassword"} />
          <ErrorField errorList={errorList} field={"NewPassword_Error"} />
          <Input type={"password"} label={"Nhập lại mật khẩu mới"} register={register} name={"newPasswordConfirm"} />
          <ErrorField errorList={errorList} field={"NewPasswordConfirm_Error"} />
          <FormErrorAlert errors={errorList} />
          <button
            type="submit"
            className="btn btn-warning text-white w-100 fw-bold mt-5"
          >
            Xác Nhận Đổi Mật Khẩu
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

export default ConfirmResetPasswordPage;