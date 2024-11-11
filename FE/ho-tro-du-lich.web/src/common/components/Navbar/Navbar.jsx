import { useLocation, useNavigate } from "react-router-dom";
import { systemAction } from "@/redux/slices/systemSlice";
import { authService } from "../../../services/authServices";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../../redux/slices/authSlices";
import { notificationService } from "../../../services/notificationService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { memo, useEffect, useState } from "react";
import { userService } from "../../../services/userSerivce";
import UserTag from "../UserTag/UserTag";
import {
  getAuthSelector,
  getUserProfileSelector,
  getUserRoleSelector,
} from "../../../redux/selectors/authSelector";
import LinkCustom from "../LinkCustom/LinkCustom";
import { Role } from "../../../enum/permission";
import { Modal, Button, Nav, Navbar as BSNavbar, Dropdown, Badge } from "react-bootstrap";
import { TbLogin } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineApps } from "react-icons/md";
import { IoLogOutSharp } from "react-icons/io5";
import { FiBell } from "react-icons/fi";
import { toast } from "react-toastify";
import NotificationPage from "../../../pages/commonpage/Notification/NotificationPage";
const contentItem = [
  { title: "Trang Chủ", url: "/" },
  { title: "Khoá Học", url: "/khoahoc" },
];

const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const getAuth = useSelector(getAuthSelector);
  const getUserProfile = useSelector(getUserProfileSelector);
  const getUserRoles = useSelector(getUserRoleSelector);
  const [unreadCount, setUnreadCount] = useState(0);
  const [errorList, setErrorList] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setuserProfile] = useState(null);
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

  const handleLogin = () => {
    navigate("/dangnhap");
  };

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
      }
      else if (result.errors) {
        setErrorList(result.errors);
      }
      else {
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
          <Button
            variant="light"
            className="fw-bold rounded-0 navbar__btn__dangxuat text-warning"
          >
            <IoLogOutSharp /> Đăng xuất
          </Button>
        ),
        id: 5,
      });
    }
    return listBtn;
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.countUnRead();
        if (response && response.success) {
          setUnreadCount(response.data);
        }
        else if (response.errors) {
          setErrorList(response.errors);
        }
      } catch (error) {
        toast.error("Không thể lấy số lượng thông báo.");
      }
    };
    fetchUnreadCount();
  }, []);

  const handleShowNotifications = () => {
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleClickDropdownRole = (data) => {
    if (data.id === 2) {
      navigate("/admin");
    }
    if (data.id === 3) {
      handleShowModal();
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
      <BSNavbar fixed="top" bg="white" expand="lg" className="shadow">
        <FormErrorAlert errors={errorList} />
        <BSNavbar.Brand onClick={() => navigate("/")}>
          <strong>COURSE WEBSITE</strong>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav" />
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {contentItem.map((item, idx) => (
              <LinkCustom
                key={idx}
                title={item.title}
                url={item.url}
                className={
                  item.url === location.pathname
                    ? "text-warning fw-bold"
                    : "text-black fw-bold"
                }
              />
            ))}
          </Nav>

          {/* Right-aligned buttons */}
          <div className="d-flex align-items-center gap-3">
            {/* Icon thông báo */}
            <div>
              <Button
                variant="light"
                className="position-relative"
                onClick={handleShowNotifications}
              >
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
              </Button>
            </div>

            {/* Profile, Login/Logout */}
            {userProfile ? (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" id="dropdown-custom-components">
                    <MdOutlineApps />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow p-2">
                    {generateBtnRole().map((item) => (
                      <Dropdown.Item key={item.id} onClick={() => handleClickDropdownRole(item)}>
                        {item.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {windowSize.width > 768 && (
                  <>
                    <UserTag profile={userProfile} onClick={handleClickUserTag} />
                    <Button
                      variant="light"
                      className="fw-bold rounded-0 text-warning"
                      onClick={() => setShowConfirmLogout(true)}
                    >
                      <IoLogOutSharp />
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button variant="light" onClick={handleLogin} className="fw-bold rounded-0">
                  {windowSize.width <= 767 ? <TbLogin color="#FFC107" size={"20px"} /> : "Đăng nhập"}
                </Button>
                <Button
                  variant="outline-warning"
                  onClick={handleRegister}
                  className="fw-bold rounded-0"
                >
                  {windowSize.width <= 767 ? <FaUserPlus /> : "Đăng ký"}
                </Button>
              </>
            )}
          </div>
        </BSNavbar.Collapse>
      </BSNavbar>
      {showNotifications && <NotificationPage onClose={handleCloseNotifications} />}
      <Modal show={showConfirmLogout} onHide={() => setShowConfirmLogout(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông Báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn chắc chắn muốn đăng xuất ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowConfirmLogout(false)}>
            Đóng
          </Button>
          <Button variant="warning" onClick={handleLogout}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(Navbar);
