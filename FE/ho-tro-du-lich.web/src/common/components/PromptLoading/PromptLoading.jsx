import { useEffect } from "react";
import Loading from "../Loading/Loading";
import styles from "./PromptLoading.module.scss";
import { useDispatch } from "react-redux";
import { systemAction } from "../../../redux/slices/systemSlice";
const PromptLoading = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(systemAction.disableLoading());
    }, 30 * 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`frame-prompt-loading ${styles.framePrompt}`}>
      <div
        className={`frame-prompt-loading__container rounded shadow p-2 d-flex flex-column ${styles.frameBox}`}
      >
        <div className="frame-prompt-loading__container__header border-1 border-bottom">
          <h5 className="fw-bold">Thông Báo</h5>
        </div>
        <div className="frame-prompt-loading__container__body w-100 h-100 d-flex flex-column justify-content-center align-items-center">
          <Loading />
          <p>Đang tải dữ liệu, vui lòng chờ</p>
        </div>
      </div>
      <div className={`frame-prompt-loading__bg ${styles.frameBg}`}></div>
    </div>
  );
};

export default PromptLoading;
