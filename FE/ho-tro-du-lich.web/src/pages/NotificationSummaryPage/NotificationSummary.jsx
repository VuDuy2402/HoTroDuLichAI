// src/components/NotificationSummary.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Lottie from 'lottie-react';
import 'react-toastify/dist/ReactToastify.css';
import './notification.css';
import { getQueryParameters } from '../../utils/queryParams';
import {
  CNotificationType,
  CNotificationLevel,
  NotificationTypeDescriptions,
  NotificationLevelDescriptions,
} from '../../enum/notificationSummary';
import animationMap from '../../utils/animations';

const NotificationSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resultMessage, setResultMessage] = useState(null);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const params = getQueryParameters();

    // Kiểm tra xem các tham số cần thiết có tồn tại hay không
    const hasLevel = params.level !== undefined && !isNaN(parseInt(params.level));
    const hasMessage = params.message !== undefined && params.message.trim() !== '';
    const hasNotificationType = params.notificationtype !== undefined && !isNaN(parseInt(params.notificationtype));

    if (hasLevel && hasMessage && hasNotificationType) {
      const message = {
        level: parseInt(params.level),
        message: params.message,
        notificationType: parseInt(params.notificationtype),
      };
      setResultMessage(message);
    } else {
      // Nếu thiếu tham số, hiển thị toast warning và không set resultMessage
      toast.warn("Thiếu tham số truy vấn cần thiết. Bạn không có quyền truy cập trang này.");
      setResultMessage(null);
    }
  }, [location.search]);

  useEffect(() => {
    if (
      resultMessage &&
      resultMessage.message &&
      resultMessage.level !== CNotificationLevel.NONE &&
      resultMessage.notificationType !== CNotificationType.NONE
    ) {
      const typeKey = Object.keys(CNotificationType).find(
        key => CNotificationType[key] === resultMessage.notificationType
      );
      const levelKey = Object.keys(CNotificationLevel).find(
        key => CNotificationLevel[key] === resultMessage.level
      );

      // Kiểm tra xem typeKey và levelKey có hợp lệ hay không
      if (!typeKey || !levelKey) {
        toast.error("Loại thông báo hoặc mức độ thông báo không hợp lệ.");
        return;
      }

      const templateKey = `${typeKey}_Notification_Template_${levelKey}`;
      console.log(templateKey);
      

      // Lấy dữ liệu hoạt hình từ bản đồ
      const animation = animationMap[templateKey];

      if (animation) {
        setAnimationData(animation);
      } else {
        toast.error(`Không tìm thấy hoạt hình cho: ${templateKey}`);
      }
    }
  }, [resultMessage]);

  const closeTab = () => {
    try {
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-layout">
      <ToastContainer />
      {resultMessage ? (
        <div className="container">
          <div className="box">
            <div className="row mb-4">
              <h1>Thông báo</h1>
            </div>
            <div className="row mb-4">
              <div className="col-12 d-flex justify-content-center align-items-center">
                {animationData && (
                  <Lottie
                    animationData={animationData}
                    style={{ width: '100%', height: '70%' }}
                  />
                )}
              </div>
            </div>
            <div className="row mb-4 text-center">
              <h2>
                {NotificationTypeDescriptions[resultMessage.notificationType]}{' '}
                {NotificationLevelDescriptions[resultMessage.level]}
              </h2>
              <p>{resultMessage.message}</p>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-auto">
                <button className="btn btn-outline-secondary" onClick={closeTab}>
                  <i className="bi bi-arrow-return-left"></i> Trở về Đăng Nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Nếu không có resultMessage, chỉ hiển thị ToastContainer
        null
      )}
    </div>
  );
};

export default NotificationSummary;
