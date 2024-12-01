import { IoMenuOutline, IoChevronDown, IoChevronUp } from "react-icons/io5";
import "./Menuside.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const MenuSide = ({ items, status, onChangeStatus, onClickItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectId, setSelectId] = useState();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleToggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleClickItem = (data) => {
    setSelectId(data.id);
    onClickItem(data);
  };

  const renderMenuItems = (items) => {
    return items.map((item, idx) => {
      const isSelected = item.url === location.pathname || (selectId && item.id === selectId);

      return (
        <div key={idx} className="w-100 d-flex flex-column">
          {/* Main item button */}
          <div className="flex-grow-1 w-100">
            <button
              onClick={() =>
                item.url ? navigate(item.url) : handleToggleDropdown(item.id)
              }
              className={`btn btn-light d-flex align-items-center ${isSelected ? "text-success fw-bold" : ""} w-100 py-3 rounded-0 text-start`}
              style={{ borderTop: item.children ? "1px solid #ddd" : "none" }}
            >
              {item.icon && <span className="me-2">{item.icon}</span>}
              <span>{item.label}</span>
              {item.children && (
                <span className="ms-auto">
                  {openDropdown === item.id ? <IoChevronUp /> : <IoChevronDown />}
                </span>
              )}
            </button>
          </div>

          {item.children && (
            <div
              className={`w-100 pl-3 ${openDropdown === item.id ? "d-block" : "d-none"}`}
              style={{
                paddingLeft: "20px",
                transition: "max-height 0.3s ease-out",
              }}
            >
              {renderMenuItems(item.children)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={`menu-side ${status ? "open" : "hide"} h-100 bg-white d-flex flex-column ${status ? "border border-end" : ""} m-0`}
      style={status ? { minWidth: "250px", width: "250px", maxWidth: "250px" } : { minWidth: "50px", width: "50px", maxWidth: "50px" }}
    >
      <div className="navbar__toggle position-sticky p-1" style={{ top: 0 }}>
        <button
          className={`d-block btn-toggle btn btn-light border bg-white ${status ? "ms-auto" : ""}`}
          onClick={onChangeStatus}
        >
          <IoMenuOutline />
        </button>
      </div>

      <div className="border-1 border-top h-100 p-1 d-flex flex-column gap-1" style={status ? { overflow: "auto", minWidth: "200px", maxWidth: "250px" } : { overflow: "hidden", minWidth: "0px", maxWidth: "0px" }}>
        {items && renderMenuItems(items)}
      </div>
    </div>
  );
};

export default MenuSide;
