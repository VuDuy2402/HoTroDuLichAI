import { memo } from "react";
import styles from "./Panel.module.scss";
import { IoIosClose } from "react-icons/io";
const Panel = ({ title, status, bodyContent, onClose }) => {
  return (
    <div
      className={`panel-frame ${
        status === "" ? styles.panelFrame : styles.hide
      }`}
    >
      <div
        className={`panel-frame__content d-flex flex-column overflow-hidden shadow p-3 ${styles.panelContent}`}
      >
        <div
          className={`panel-frame__content__header border-1 pb-2 border-bottom d-flex justify-content-between align-items-center`}
        >
          <h3>{title}</h3>
          <button className="btn btn-light" onClick={onClose}>
            <IoIosClose />
          </button>
        </div>
        <div
          className={`panel-frame__content__body`}
          style={{ height: `calc(100% - 50px)` }}
        >
          {bodyContent}
        </div>
      </div>
      <div className={`panel-frame__bg ${styles.panelBg}`}></div>
    </div>
  );
};
export default memo(Panel);
