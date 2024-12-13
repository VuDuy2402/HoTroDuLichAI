import { useState } from "react";
import styles from "./Dropdown.module.scss";
/**
 *
 * @param {*} items : [{label:string, icon?: ReactNode}]
 * @param onClick: return object item
 * @returns
 */
const DropdownCustom = ({
  title,
  classBtn = "",
  styleBtn,
  items,
  onClickBtn,
  onOpen,
  onClose,
  onClick,
  classItem = "",
  styleItem,
  classDropdown = "",
  styleDropdown,
  autoClose = false,
  noticeIcon = false,
  amountNotice = 0,
  emptyItem,
  loadMore,
  onClickMore,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="drop-down position-relative"
      onMouseLeave={() => {
        autoClose && setIsOpen(false);
        onClose && isOpen && onClose();
      }}
    >
      <button
        className={`${classBtn} position-relative`}
        style={styleBtn}
        onClick={() => {
          setIsOpen((pre) => !pre);
          onClickBtn && onClickBtn();
          onOpen && !isOpen && onOpen();
          onClose && isOpen && onClose();
        }}
      >
        {title}
        {noticeIcon && amountNotice > 0 && (
          <p
            className="position-absolute rounded-pill bg-danger d-flex justify-content-center align-items-center text-white m-0"
            style={{
              top: 0,
              right: 1,
              width: "22px",
              height: "22px",
              fontSize: "11px",
            }}
          >
            {amountNotice > 99 ? "99+" : amountNotice}
          </p>
        )}
      </button>
      {isOpen && (
        <div
          className={`position-absolute d-flex flex-column gap-2 rounded ${classDropdown}`}
          style={{
            ...styleDropdown,
            top: "100%",
            minWidth: "130px",
            textAlign: "left",
          }}
        >
          {items && items.length > 0 && items.map((item, idx) => (
            <div
              key={idx}
              className={`${classItem} ${styles.item}`}
              onClick={() => onClick(item)}
              style={{ ...styleItem, cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              {item.icon && (
                <span className="me-2">{item.icon}</span>
              )}
              <div className="m-0" style={{ maxWidth: "100%" }}>
                {item.label}
              </div>
            </div>
          ))}
          {((items && items.length === 0) || !items) && (
            <div
              className={`${classItem} ${styles.item}`}
              style={{ ...styleItem, cursor: "pointer" }}
            >
              <p className="m-0">{emptyItem || "Trống"}</p>
            </div>
          )}
          {loadMore && items && items.length > 0 && (
            <div
              className={`${classItem} ${styles.item}`}
              onClick={() => onClickMore()}
              style={{ ...styleItem, cursor: "pointer" }}
            >
              <div className="m-0" style={{ maxWidth: "100%" }}>
                Thêm
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownCustom;
