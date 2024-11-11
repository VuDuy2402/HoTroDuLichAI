import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { userService } from "../../../services/userSerivce";
import { roleService } from "../../../services/roleService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { MultiSelect } from 'react-multi-select-component';

const AUpdateUserPage = ({ show, onClose, userId, onUserUpdated }) => {
    const [userDetails, setUserDetails] = useState({
        userId: '',
        fullName: '',
        newPassword: '',
        dateOfBirth: null,
        address: '',
        confirmEmail: false,
        twoFactorEnable: false,
        roleIds: [],
    });

    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorList, setErrorList] = useState([]);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = {
                pageNumber: 1,
                pageSize: 10,
            };
            const result = await roleService.getWithPaging(data);
            if (result && result.success) {
                let resultOption = result.data.items.map(item => ({
                    label: item.roleName,
                    value: item.roleId,
                }));
                setRoles(resultOption);
            } else {
                if (result.errors) {
                    setErrorList(result.errors);
                }
            }
        } catch (error) {
            toast.error("An error occurred while fetching roles.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const result = await userService.getById(userId);
            if (result && result.success) {
                const { data } = result;
                setUserDetails(data);
                const selectedRoles = data.roleDetailProperties.map(role => ({
                    label: role.roleName,
                    value: role.roleId,
                }));
                setSelectedRoles(selectedRoles);
            } else {
                if (result.errors) {
                    setErrorList(result.errors);
                }
            }
        } catch (error) {
            toast.error("An error occurred while fetching user details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        }
    }, [userId, roles]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleRoleChange = (selectedOptions) => {
        setSelectedRoles(selectedOptions);
        setUserDetails(prev => ({
            ...prev,
            roleIds: selectedOptions.map(option => option.value),
        }));
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const result = await userService.updateUser(userDetails);
            if (result && result.success) {
                toast.success("User updated successfully!");
                onUserUpdated(userDetails.userId);
                onClose();
            } else {
                if (result.errors) {
                    setErrorList(result.errors);
                }
            }
        } catch (error) {
            toast.error("An error occurred while updating user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormErrorAlert errors={errorList} />
                <Form>
                    <Form.Group controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={userDetails.fullName}
                            onChange={handleChange}
                            required
                        />
                        <ErrorField errorList={errorList} field={"FullName_Error"} />
                    </Form.Group>
                    <Form.Group controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            value={userDetails.newPassword || ''}
                            onChange={handleChange}
                            required
                        />
                        <ErrorField errorList={errorList} field={"NewPassword_Error"} />
                    </Form.Group>
                    <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={userDetails.address}
                            onChange={handleChange}
                        />
                        <ErrorField errorList={errorList} field={"Address_Error"} />
                    </Form.Group>
                    <Form.Group controlId="dateOfBirth">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                            type="date"
                            name="dateOfBirth"
                            value={userDetails.dateOfBirth || ''}
                            onChange={handleChange}
                        />
                        <ErrorField errorList={errorList} field={"DateOfBirth_Error"} />
                    </Form.Group>
                    <Form.Group controlId="confirmEmail">
                        <Form.Check
                            type="checkbox"
                            label="Confirm Email"
                            name="confirmEmail"
                            checked={userDetails.confirmEmail}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="twoFactorEnable">
                        <Form.Check
                            type="checkbox"
                            label="Two Factor Enable"
                            name="twoFactorEnable"
                            checked={userDetails.twoFactorEnable}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="roles">
                        <Form.Label>Roles</Form.Label>
                        <MultiSelect
                            options={roles}
                            value={selectedRoles}
                            onChange={handleRoleChange}
                            labelledBy="Select Roles"
                        />
                        <ErrorField errorList={errorList} field={"Roles_Error"} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleUpdate} disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AUpdateUserPage;