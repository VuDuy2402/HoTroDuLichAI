import styles from "./PromptConfirm.module.scss";
const PromptConfirm = ({
  title,
  onConfirm,
  onCancel,
  textBtnConfirm,
  textBtnCancel,
}) => {
  return (
    <div className={`frame-prompt-confirm ${styles.framePrompt}`}>
      <div
        className={`frame-prompt-confirm__container rounded shadow p-2 d-flex flex-column ${styles.frameBox}`}
      >
        <div className="frame-prompt-confirm__container__header border-1 border-bottom">
          <h5 className="fw-bold">Thông Báo</h5>
        </div>
        <div className="frame-prompt-confirm__container__body w-100 h-100 d-flex flex-column justify-content-center align-items-center">
          <p>{title}</p>
        </div>
        <div className="frame-btn-prompt d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-outline-warning bg-white"
            onClick={onCancel}
          >
            {textBtnCancel || "Đóng"}
          </button>
          <button
            type="button"
            className="btn btn-warning text-white"
            onClick={onConfirm}
          >
            {textBtnConfirm || "Xác nhận"}
          </button>
        </div>
      </div>
      <div className={`frame-prompt-confirm__bg ${styles.frameBg}`}></div>
    </div>
  );
};

export default PromptConfirm;
