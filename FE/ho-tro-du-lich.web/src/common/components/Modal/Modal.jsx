import styles from "./Modal.module.scss";
const Modal = ({ children, status = true }) => {
  return (
    <>
      {status ? (
        <div className={`modal-frame ${styles.modalFrame}`}>
          <div className={`modal-container rounded ${styles.frameContainer}`}>
            {children}
          </div>
          <div className={`modal-bg ${styles.frameBg}`}></div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
export default Modal;
