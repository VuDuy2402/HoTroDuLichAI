import { useState, useEffect } from "react";
import { Button, Badge, Modal, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { notificationService } from "../../../services/notificationService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { IoTrashBinSharp } from "react-icons/io5";

const NotificationPage = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [errorList, setErrorList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Call API để lấy số lượng thông báo chưa đọc
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

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationService.getWithPaging({ page: 1, size: 10 });
            if (response && response.success) {
                setNotifications(response.data);
            }
            else if (response.errors) {
                setErrorList(response.errors);
            }
        } catch (error) {
            toast.error("Không thể lấy thông báo.");
        }
        setLoading(false);
    };

    // Xóa thông báo
    const handleDelete = async (notificationId) => {
        try {
            const response = await notificationService.delete(notificationId);
            if (response && response.success) {
                setNotifications((prev) => prev.filter((item) => item.notificationId !== notificationId));
                toast.success("Đã xóa thông báo.");
            }
        } catch (error) {
            toast.error("Không thể xóa thông báo.");
        }
    };

    return (
        <Modal show onHide={onClose} centered size="lg">
            <FormErrorAlert errors={errorList} />
            <Modal.Header closeButton>
                <Modal.Title>Thông Báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <h5>Số lượng thông báo chưa đọc: <Badge pill bg="danger">{unreadCount}</Badge></h5>
                </div>

                <Button variant="primary" onClick={fetchNotifications} className="mb-3">
                    Xem Thông Báo
                </Button>

                {loading ? (
                    <div>Đang tải...</div>
                ) : (
                    <ListGroup>
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <ListGroup.Item key={notification.notificationId} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{notification.title}</strong>
                                        <p>{notification.content}</p>
                                        <small>{new Date(notification.createdDate).toLocaleString()}</small>
                                    </div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(notification.notificationId)}
                                    >
                                        <IoTrashBinSharp /> Xóa
                                    </Button>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <div>Không có thông báo nào.</div>
                        )}
                    </ListGroup>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default NotificationPage;
