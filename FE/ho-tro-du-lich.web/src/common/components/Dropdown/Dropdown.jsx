import { useState } from "react";
import styles from "./Dropdown.module.scss";
/**
 *
 * @param {*} items : [{label:string}]
 * @param onClick: return object item
 * @returns
 */
const DropdownCustom = ({
  title,
  classBtn = "",
  styleBtn,
  items,
  onClickBtn,
  onClick,
  classItem = "",
  styleItem,
  classDropdown = "",
  styleDropdown,
  autoClose = false,
  noticeIcon = false,
  amountNotice = 1,
  emptyItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="drop-down position-relative"
      onMouseLeave={() => autoClose && setIsOpen(false)}
    >
      <button
        className={`${classBtn} position-relative`}
        style={styleBtn}
        onClick={() => {
          setIsOpen((pre) => !pre);
          onClickBtn && onClickBtn();
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
          className={`position-absolute d-flex flex-column gap-2 ${classDropdown}`}
          style={{ ...styleDropdown, top: "100%", minWidth: "130px" }}
        >
          {items &&
            items.length > 0 &&
            items.map((item) => (
              <div
                className={`${classItem} ${styles.item}`}
                onClick={() => onClick(item)}
                style={{ ...styleItem, cursor: "pointer" }}
              >
                <p className="m-0">{item.label}</p>
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
        </div>
      )}
    </div>
  );
};

export default DropdownCustom;
