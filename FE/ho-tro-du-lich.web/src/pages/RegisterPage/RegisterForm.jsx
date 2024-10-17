import { useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import { useForm } from "react-hook-form";
import { authService } from "../../services/authServices";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { systemAction } from "../../redux/slices/systemSlice";
import FormErrorAlert from "../../common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "../../common/components/ErrorField/ErrorField";
import { toast } from "react-toastify";
import { toQueryString } from "../../utils/queryParams";

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [errorList, setErrorList] = useState([]);
  const [message, setMessage] = useState("");
  const [levelClass, setLevelClass] = useState();
  const handleSubmitForm = async (data) => {
    dispatch(systemAction.enableLoading());
    const result = await authService.signup(data);
    if (result && result.success) {
      try {
        const queryString = toQueryString(result.data || {});
        navigate(`/thongbao/?${queryString}`);
      } catch (error) {
        toast.error(`Lỗi khi tạo query string: ${error.message}`);
      }
    } else {
      setErrorList(result.errors);
    }
    dispatch(systemAction.disableLoading());
  };

  return (
    <div className="register-form d-flex flex-column gap-2 w-100">
      <div className="register-form__header d-flex gap-1">
        <h4 className={`rounded-0 fw-bold mb-3`}>Đăng Ký</h4>
      </div>
      <div className="register-form__body">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <FormErrorAlert
            errors={errorList}
            message={message}
            levelClass={levelClass}
          />
          <label htmlFor="register-fullname" className="mb-1 fw-bold">
            Name
          </label>
          <input
            name="fullName"
            id="register-fullname"
            className={`mb-2 ${styles.input}`}
            placeholder="Nhập tên"
            autoComplete="one-time-code"
            {...register("fullName", {})}
          />
          <ErrorField errorList={errorList} field={"FullName_Error"} />
          <label htmlFor="register-email" className="mb-1 fw-bold">
            Email
          </label>
          <input
            name="email"
            type="email"
            id="register-email"
            className={`mb-2 ${styles.input}`}
            placeholder="Nhập email"
            autoComplete="one-time-code"
            {...register("email", {})}
          />
          <ErrorField errorList={errorList} field={"Email_Error"} />
          <label htmlFor="register-pass" className=" mb-1 fw-bold">
            Password
          </label>
          <input
            name="password"
            type="password"
            id="register-pass"
            className={`${styles.input}`}
            placeholder="Nhập password"
            autoComplete="one-time-code"
            {...register("password", {})}
          />
          <ErrorField errorList={errorList} field={"Password_Error"} />
          <label htmlFor="register-repass" className=" mb-1 fw-bold">
            Nhập lại Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            autoComplete="one-time-code"
            id="register-repass"
            className={`${styles.input}`}
            placeholder="Nhập lại password"
            {...register("confirmPassword", {})}
          />
          <ErrorField errorList={errorList} field={"ConfirmPassword_Error"} />
          <input
            type="submit"
            className={`btn btn-success fw-bold btn-white btn-success mt-5 ${styles.btnsubmit}`}
            value="Đăng ký"
          />
        </form>
        <button
          className={`btn btn-login rounded-0 w-100 mt-2 ${styles.btndeactive}`}
          onClick={() => navigate("/dangnhap")}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};
export default RegisterForm;
