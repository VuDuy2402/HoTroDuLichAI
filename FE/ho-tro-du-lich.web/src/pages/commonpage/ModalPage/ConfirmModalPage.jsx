import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModalPage = ({ show, onConfirm, onCancel }) => {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận xóa</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc chắn muốn xóa người dùng này?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModalPage;
