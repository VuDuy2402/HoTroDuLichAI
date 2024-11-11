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
  onClick,
  classItem = "",
  styleItem,
  classDropdown = "",
  styleDropdown,
  autoClose = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="drop-down position-relative"
      onMouseLeave={() => autoClose && setIsOpen(false)}
    >
      <button
        className={`${classBtn}`}
        style={styleBtn}
        onClick={() => setIsOpen((pre) => !pre)}
      >
        {title}
      </button>
      {isOpen && (
        <div
          className={`position-absolute d-flex flex-column gap-2 ${classDropdown}`}
          style={{ ...styleDropdown, top: "100%", minWidth: "130px" }}
        >
          {items.map((item) => (
            <div
              className={`${classItem} ${styles.item}`}
              onClick={() => onClick(item)}
              style={{ ...styleItem, cursor: "pointer" }}
            >
              <p className="m-0">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCustom;
