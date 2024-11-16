import { useLocation, useNavigate } from "react-router-dom";
import { systemAction } from "@/redux/slices/systemSlice";
import { authService } from "../../../services/authServices";
import styles from "./Navbar.module.scss";
import { localStorageService } from "../../../services/localstorageService";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../../redux/slices/authSlices";
import { memo, useEffect, useState } from "react";
import { userService } from "../../../services/userSerivce";
import { publisherService } from "../../../services/publisherService";
import { notificationService } from "../../../services/notificationService";
import { FiBell } from "react-icons/fi";
import UserTag from "../UserTag/UserTag";
import {
  getAuthSelector,
  getUserProfileSelector,
  getUserRoleSelector,
} from "../../../redux/selectors/authSelector";
import * as signalR from "@microsoft/signalr";
import LinkCustom from "../LinkCustom/LinkCustom";
import { Role } from "../../../enum/permission";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { TbLogin } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineApps } from "react-icons/md";
import DropdownCustom from "../Dropdown/Dropdown";
import { IoLogOutSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import NotificationPage from "../../../pages/commonpage/Notification/NotificationPage";
import { getNoticeNumberSelector } from "../../../redux/selectors/systemSelector";
import useSignalR from "../../../hooks/useSignalR";

const contentItem = [
  { title: "Trang Chủ", url: "/" },
  { title: "Tin Tức", url: "/tintuc" },
  { title: "Địa điểm", url: "/diadiem" },
];

const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const noticeNumber = useSelector(getNoticeNumberSelector);
  const getAuth = useSelector(getAuthSelector);
  const getUserProfile = useSelector(getUserProfileSelector);
  const getUserRoles = useSelector(getUserRoleSelector);
  const [errorList, setErrorList] = useState([]);
  const handleLogin = () => {
    navigate("/dangnhap");
  };
  const [connection, setConnection] = useState(null);
  const [userProfile, setuserProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    description: "",
    videoUrl: "",
  });
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    const res = await authService.logout();
    if (res.success) {
      localStorageService.removeToken();
      dispatch(authAction.reset());
      navigate("/dangnhap");
    }
  };

  const handleRegister = () => {
    navigate("/dangky");
  };

  const handleClickUserTag = () => {
    navigate("/thongtincanhan");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const connectSignalR = async () => {
      const token = localStorageService.getAccessToken();
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7001/notificationHub", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();
      newConnection.on("ReceiveNotification", () => {
        dispatch(systemAction.addNoticeNumber(1));
      });
      try {
        await newConnection.start();
        setConnection(newConnection);
      } catch (error) {
        console.error("Error connection:", error);
        toast.error("Failed to connect.");
      }
    };
    connectSignalR();
    return () => {
      connection?.stop();
    };
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.countUnRead();
        if (response && response.success) {
          setUnreadCount(response.data);
        } else if (response.errors) {
          setErrorList(response.errors);
        }
      } catch (error) {
        toast.error("Không thể lấy số lượng thông báo.");
      }
    };
    fetchUnreadCount();
  }, []);

  // const { connection } = useSignalR(
  //   "https://localhost:7001/notificationHub",
  //   "ReceiveNotification",
  //   () => {
  //     dispatch(systemAction.addNoticeNumber(1));
  //   }
  // );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const dataToSend = {
      FullName: formData.fullName,
      Email: formData.email,
      Description: formData.description,
      VideoUrl: formData.videoUrl,
    };
    dispatch(systemAction.enableLoading());
    const result = await publisherService.requestBecomeToAPublisher(dataToSend);
    if (result && result.success) {
      dispatch(systemAction.disableLoading());
      window.location.href = result.data;
      setShowModal(false);
    } else {
      dispatch(systemAction.disableLoading());
      if (result.errors) {
        setErrorList(result.errors);
      }
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      if (getUserProfile) {
        setuserProfile(getUserProfile);
        return;
      }
      const result = await userService.getBaseProfile();
      if (result && result.success) {
        setuserProfile(result.data);
        dispatch(authAction.setInfoUser(result.data));
      } else {
        setuserProfile(null);
      }
    };
    fetchApi();
  }, [getAuth]);

  const generateBtnRole = () => {
    const listBtn = [];
    if (!userProfile) {
      return listBtn;
    }
    if (getUserRoles && getUserRoles.length > 0) {
      if (getUserRoles.includes(Role.Publisher)) {
        listBtn.push({ label: "Publisher Page", id: 1 });
      }
    }
    if (getUserRoles.includes(Role.Admin)) {
      listBtn.push({
        label: "Admin Page",
        id: 2,
      });
    }

    if (windowSize.width <= 767) {
      listBtn.push({
        label: <UserTag profile={userProfile} />,
        id: 4,
      });
      listBtn.push({
        label: (
          <button
            type="button"
            className={`btn btn-light fw-bold rounded-0  navbar__btn__dangxuat text-warning `}
          >
            <IoLogOutSharp /> Đăng xuất
          </button>
        ),
        id: 5,
      });
    }
    return listBtn;
  };
  const handleClickDropdownRole = (data) => {
    if (data.id === 1) {
      navigate("/publisher");
    }
    if (data.id === 2) {
      navigate("/admin");
    }
    if (data.id === 4) {
      handleClickUserTag();
    }
    if (data.id === 5) {
      setShowConfirmLogout(true);
    }
  };

  return (
    <>
      <nav className={`w-100 shadow bg-white ${styles.navbar}`}>
        <FormErrorAlert errors={errorList} />
        <div
          className={`${className} h-100 d-flex justify-content-between align-items-center`}
        >
          <div className="navbar__content_title d-flex">
            <div
              className={`navbar__logo d-flex align-items-center ${styles.navbar_logo}`}
              onClick={() => navigate("/")}
            >
              <p className="p-1 m-0 text-success">DULICHDN</p>
            </div>
            <div className="navbar__content__item ms-3 d-flex gap-1 align-items-center">
              {contentItem.map((item, idx) => (
                <LinkCustom
                  key={idx}
                  title={item.title}
                  url={item.url}
                  className={
                    item.url === location.pathname
                      ? "text-success fw-bold"
                      : "text-black"
                  }
                />
              ))}
            </div>
          </div>
          <div
            className={`navbar__btn d-flex gap-1 align-items-center ${styles.navbar_btn}`}
          >
            {userProfile ? (
              <>
                <DropdownCustom
                  title={<MdOutlineApps />}
                  classBtn={"btn btn-light rounded-0"}
                  classDropdown={"bg-white p-2 shadow"}
                  classItem="p-1 d-flex justify-content-center"
                  items={generateBtnRole()}
                  styleDropdown={{ right: 0, width: "150px" }}
                  autoClose
                  onClick={handleClickDropdownRole}
                />
                <DropdownCustom
                  title={
                    <div className="position-relative">
                      <FiBell size={24} />
                      {unreadCount > 0 && (
                        <Badge
                          bg="danger"
                          pill
                          className="position-absolute top-0 start-100 translate-middle"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  }
                  classBtn={"btn btn-light rounded-0"}
                  classDropdown={"bg-white p-2 shadow"}
                  classItem="p-1 d-flex justify-content-center"
                  styleDropdown={{ right: 0, width: "150px" }}
                  autoClose
                  noticeIcon
                  amountNotice={noticeNumber}
                  onClickBtn={() => dispatch(systemAction.resetNoticeNumber())}
                />
                {windowSize.width > 768 && (
                  <>
                    <UserTag
                      profile={userProfile}
                      onClick={handleClickUserTag}
                    />
                    <button
                      className={`btn btn-light fw-bold rounded-0 navbar__btn__dangxuat text-success`}
                      onClick={() => setShowConfirmLogout(true)}
                    >
                      <IoLogOutSharp />
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className={`btn btn-outline-success bg-white text-success rounded-0  navbar__btn__dangnhap`}
                >
                  {windowSize.width <= 767 ? (
                    <TbLogin color="#157347" size={"20px"} />
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
                <button
                  className={`btn btn-success border-1 rounded-0  navbar__btn__dangxuat ${
                    windowSize.width > 767 ? "" : ""
                  }`}
                  onClick={handleRegister}
                >
                  {windowSize.width <= 767 ? <FaUserPlus /> : "Đăng ký"}
                </button>
              </>
            )}
          </div>
          {/* {showNotifications && (
            <NotificationPage onClose={handleCloseNotifications} />
          )} */}
        </div>
      </nav>

      <Modal
        show={showConfirmLogout}
        onHide={() => setShowConfirmLogout(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông Báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn chắc chắn muốn đăng xuất ?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-light"
            onClick={() => setShowConfirmLogout(false)}
          >
            Đóng
          </button>
          <button className="btn btn-success" onClick={handleLogout}>
            Xác nhận
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(Navbar);
