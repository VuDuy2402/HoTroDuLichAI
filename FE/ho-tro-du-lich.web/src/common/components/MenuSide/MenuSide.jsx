import {
  IoMenuOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoEllipseOutline,
} from "react-icons/io5";
import "./Menuside.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const MenuSide = ({ items, status, onChangeStatus, onClickItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectId, setSelectId] = useState();

  const handleClickItem = (data) => {
    setSelectId(data.id);
    onClickItem(data);
  };

  const getProgressIcon = (percentage) => {
    if (percentage > 100) {
      percentage = 100;
    }
    if (percentage === 100) {
      return <IoCheckmarkCircleOutline className="text-success" />;
    } else if (percentage > 0) {
      return <IoTimeOutline className="text-warning" />;
    } else {
      return <IoEllipseOutline className="text-danger" />;
    }
  };

  return (
    <div
      className={`menu-side ${
        status ? "open" : "hide"
      } h-100 bg-white d-flex flex-column ${
        status ? "border border-end" : ""
      } m-0`}
      style={
        status
          ? {
              minWidth: "250px",
              width: "250px",
              maxWidth: "250px",
            }
          : {
              minWidth: "50px",
              width: "50px",
              maxWidth: "50px",
            }
      }
    >
      <div className="navbar__toggle position-sticky p-1" style={{ top: 0 }}>
        <button
          className={`d-block btn-toggle btn btn-light border bg-white ${
            status ? "ms-auto" : ""
          }`}
          onClick={onChangeStatus}
        >
          <IoMenuOutline />
        </button>
      </div>
      <div
        className="border-1 border-top h-100 p-1 d-flex flex-column gap-1"
        style={
          status
            ? { overflow: "auto", minWidth: "200px", maxWidth: "250px" }
            : { overflow: "hidden", minWidth: "0px", maxWidth: "0px" }
        }
      >
        {items &&
          items.map((item, idx) => {
            return (
              <div key={idx} className="w-100 d-flex align-items-center">
                <div
                  className="flex-grow-1 d-flex align-items-center"
                  style={{
                    background: "linear-gradient(to right, red 30%, white 30%)",
                  }}
                >
                  <button
                    onClick={() =>
                      item.url ? navigate(item.url) : handleClickItem(item)
                    }
                    className={`btn btn-light d-flex align-items-center ${
                      item.url === location.pathname ||
                      (selectId && item.id === selectId)
                        ? "text-warning fw-bold"
                        : ""
                    } w-100 py-3 rounded-0 text-start`}
                  >
                    {item.progressLesson >= 0 &&
                      getProgressIcon(item.progressLesson)}
                    <span className="ms-2">{item.label}</span>
                    {item.progressLesson >= 0 && (
                      <div
                        className="ms-auto text-end"
                        style={{ minWidth: "50px", maxWidth: "60px" }}
                      >
                        {item.progressLesson > 100 ? 100 : item.progressLesson}%
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MenuSide;
