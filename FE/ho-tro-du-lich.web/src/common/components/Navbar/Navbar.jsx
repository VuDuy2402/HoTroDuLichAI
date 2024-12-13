import { useLocation, useNavigate } from "react-router-dom";
import { systemAction } from "@/redux/slices/systemSlice";
import { authService } from "../../../services/authServices";
import styles from "./Navbar.module.scss";
import { localStorageService } from "../../../services/localstorageService";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../../redux/slices/authSlices";
import { memo, useEffect, useState } from "react";
import { userService } from "../../../services/userSerivce";
import { notificationService } from "../../../services/notificationService";
import { FiBell } from "react-icons/fi";
import { MdAddBusiness, MdBusiness, MdOutlineAddLocation, MdOutlineBookmarkAdd, MdOutlineManageAccounts } from "react-icons/md";
import UserTag from "../UserTag/UserTag";
import {
  getAuthSelector,
  getUserProfileSelector,
  getUserRoleSelector,
} from "../../../redux/selectors/authSelector";
import LinkCustom from "../LinkCustom/LinkCustom";
import { Role } from "../../../enum/permission";
import { Modal } from "react-bootstrap";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { TbLogin } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineApps } from "react-icons/md";
import DropdownCustom from "../Dropdown/Dropdown";
import { IoLogOutSharp } from "react-icons/io5";
import { getNoticeNumberSelector } from "../../../redux/selectors/systemSelector";
import { IoMenu } from "react-icons/io5";
import { getSignalR } from "../../../redux/selectors/signalRSelector";
import { RiMessage2Line } from "react-icons/ri";
import ButtonCustom from "../ButtonCustom/ButtonCustom";

const contentItem = [
  { title: "Trang Chủ", url: "/" },
  { title: "Tin Tức", url: "/tintuc" },
  { title: "Địa điểm", url: "/diadiem" },
];

const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const getAuth = useSelector(getAuthSelector);
  const getUserProfile = useSelector(getUserProfileSelector);
  const getUserRoles = useSelector(getUserRoleSelector);
  const [errorList, setErrorList] = useState([]);
  const handleLogin = () => {
    navigate("/dangnhap");
  };
  const [userProfile, setuserProfile] = useState(null);
  const unreadCount = useSelector(getNoticeNumberSelector);
  const signalNotice = useSelector(
    getSignalR("https://localhost:7001/notificationHub", "ReceiveNotification")
  );
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [pagingNotification, setPagingNotification] = useState(1);
  const [maxPagingNotification, setMaxPagingNotification] = useState();
  const [notificationItem, setNotificationItem] = useState([]);
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
    navigate("/canhan/thongtin");
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.countUnRead();
        if (response && response.success) {
          dispatch(systemAction.setNoticeNumber(response.data));
        } else if (response.errors) {
          setErrorList(response.errors);
        }
      } catch (error) {
        // toast.error("Không thể lấy số lượng thông báo.");
      }
    };
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    dispatch(systemAction.addNoticeNumber(1));
  }, [signalNotice]);

  const resetUnreadCount = async () => {
    const result = await notificationService.resetUnRead();
    if (result) {
      if (result.success) {
        dispatch(systemAction.resetNoticeNumber());
      } else {
        setErrorList(result.errors);
      }
    }
  };
  const loadNotification = async (page) => {
    const result = await notificationService.getWithPaging({
      pageNumber: page,
      pageSize: 10,
      searchQuery: "",
      filterProperty: {},
    });
    if (result) {
      if (result.success) {
        const newArr = result.data.items.map((item) => ({ label: item.title }));
        setNotificationItem((pre) => [...pre, ...newArr]);
        setMaxPagingNotification(result.data.totalPages);
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

    const isNormalUser = getUserRoles.includes(Role.NormalUser);
    const isBusiness = getUserRoles.includes(Role.Business);
    const isAdmin = getUserRoles.includes(Role.Admin);  

    if (isBusiness) {
      listBtn.push({
        label: "Doanh nghiệp",
        id: 1,
        icon: <MdBusiness size={24} className="text-primary"/>
      });
    }
  
    if (isAdmin) {
      listBtn.push({
        label: "Quản trị",
        id: 2,
        icon: <MdOutlineApps size={24} className="text-success" />
      });
    }
  
    if (isNormalUser && !isBusiness && !isAdmin) {
      listBtn.push({
        label: "Đăng ký Doanh nghiệp",
        id: 3,
        icon: <MdAddBusiness size={24} className="text-info"/>
      });
    }
  
    if ((isNormalUser || isBusiness) && !isAdmin) {
      listBtn.push({
        label: "Đăng Bài viết",
        id: 4,
        icon: <MdOutlineBookmarkAdd size={24} className="text-warning"/>
      });
    }

    if ((isNormalUser || isBusiness) && !isAdmin) {
      listBtn.push({
        label: "Đăng Địa điểm mới",
        id: 5,
        icon: <MdOutlineAddLocation size={24} className="text-secondary"/>
      });
    }

    if (windowSize.width <= 767) {
      listBtn.push({
        label: <UserTag size={1} profile={userProfile} className={"w-100"} />,
        id: 6,
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
        id: 7,
      });
    }    
    return listBtn;
  };

  const generateBtnPage = () => {
    const listBtn = contentItem.map((item) => ({
      label: item.title,
      url: item.url,
    }));

    return listBtn;
  };
  const handleClickDropdownPage = (data) => {
    navigate(data.url);
  };
  const handleClickDropdownRole = (data) => {
    if (data.id === 1) {
      navigate("/doanhnghiep");
    }
    if (data.id === 2) {
      navigate("/quantri");
    }
    if (data.id === 3) {
      navigate("/doanhnghiep/dangky");
    }
    if (data.id === 4) {
      navigate("/baiviet/dangky");
    }
    if (data.id === 5) {
      navigate("/diadiem/dangky");
    }
    if (data.id === 6) {
      handleClickUserTag();
    }
    if (data.id === 7) {
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
              {windowSize.width > 998 ? (
                contentItem.map((item, idx) => (
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
                ))
              ) : (
                <DropdownCustom
                  title={<IoMenu />}
                  classBtn={"btn btn-light"}
                  classDropdown={"bg-white p-2 shadow"}
                  classItem={"p-1 d-flex justify-content-center"}
                  items={generateBtnPage()}
                  onClick={handleClickDropdownPage}
                  autoClose
                />
              )}
            </div>
          </div>
          <div
            className={`navbar__btn d-flex gap-1 align-items-center ${styles.navbar_btn}`}
          >
            {userProfile ? (
              <>
                <DropdownCustom
                  title={<MdOutlineManageAccounts size={24} className="text-danger"/>}
                  classBtn={"btn btn-light rounded"}
                  classDropdown={"bg-white p-2 shadow"}
                  classItem="p-1 d-flex justify-content-start"
                  items={generateBtnRole()}
                  styleDropdown={{ right: 0, width: "200px" }}
                  autoClose
                  onClick={handleClickDropdownRole}
                />
                <ButtonCustom
                  title={<RiMessage2Line size={24} className="text-success" />}
                  noticeIcon
                  amountNotice={2}
                  className="btn btn-light rounded"
                  onClick={() => navigate("/chat")}
                />
                <DropdownCustom
                  title={<FiBell size={24} className="text-warning"/>}
                  classBtn={"btn btn-light rounded"}
                  classDropdown={"bg-white p-2 shadow"}
                  classItem="p-1 d-flex justify-content-center"
                  autoClose
                  noticeIcon
                  items={notificationItem}
                  amountNotice={unreadCount}
                  loadMore
                  styleDropdown={{
                    height: "50vh",
                    right: 0,
                    overflow: "auto",
                    width: "200px",
                    maxHeight: "500px",
                    minHeight: "200px",
                  }}
                  onOpen={() => {
                    resetUnreadCount();
                    if (notificationItem.length === 0) {
                      loadNotification(1);
                    }
                  }}
                  onClickMore={() => {
                    if (pagingNotification < maxPagingNotification) {
                      setPagingNotification((pre) => pre + 1);
                      loadNotification(pagingNotification + 1);
                    }
                  }}
                />
                {windowSize.width > 768 && (
                  <>
                    <UserTag
                      size={2}
                      profile={userProfile}
                      onClick={handleClickUserTag}
                    />
                    <button
                      className={`btn btn-light fw-bold rounded navbar__btn__dangxuat text-success`}
                      onClick={() => setShowConfirmLogout(true)}
                    >
                      <IoLogOutSharp className="rounded" />
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
                  className={`btn btn-success border-1 rounded-0  navbar__btn__dangxuat ${windowSize.width > 767 ? "" : "" }`}
                  onClick={handleRegister}
                >
                  {windowSize.width <= 767 ? <FaUserPlus /> : "Đăng ký"}
                </button>
              </>
            )}
          </div>
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
