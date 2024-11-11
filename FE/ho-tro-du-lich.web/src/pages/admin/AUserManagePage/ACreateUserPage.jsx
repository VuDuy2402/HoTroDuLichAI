import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { userService } from '../../../services/userSerivce';
import { roleService } from '../../../services/roleService';
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { MultiSelect } from 'react-multi-select-component';

const ACreateUserPage = ({ show, onClose, onUserCreated }) => {
    const [userDetails, setUserDetails] = useState({
        fullName: '',
        email: '',
        dateOfBirth: null,
        address: '',
        password: '',
        confirmEmail: false,
        twoFactorEnable: false,
        roleIds: [],
    });

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorList, setErrorList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selected, setSelected] = useState([]);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = {
                pageNumber: 1,
                pageSize: 10,
                query: searchQuery,
            };
            const result = await roleService.getWithPaging(data);
            if (result && result.success) {
                let resultOption = [];
                result.data.items.map((item) => {
                    resultOption.push({ label: item.roleName, value: item.roleId });
                });
                setRoles(resultOption);
            } else {
                toast.error("Failed to fetch roles.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching roles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleRoleChange = (selectedOptions) => {
        setSelected(selectedOptions);
        setUserDetails(prev => ({
            ...prev,
            roleIds: selectedOptions.map(option => option.value),
        }));
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const result = await userService.createUser(userDetails);
            if (result && result.success) {
                toast.success(result.data.message);
                onUserCreated(result.data.userId);
                onClose();
            } else {
                if (result.errors) {
                    setErrorList(result.errors);
                }
            }
        } catch (error) {
            toast.error("An error occurred while creating user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormErrorAlert errors={errorList} />
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
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={userDetails.email}
                            onChange={handleChange}
                            required
                        />
                        <ErrorField errorList={errorList} field={"Email_Error"} />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={userDetails.password}
                            onChange={handleChange}
                            required
                        />
                        <ErrorField errorList={errorList} field={"Password_Error"} />
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
                        <ErrorField errorList={errorList} field={"TwoFactorEnable_Error"} />
                    </Form.Group>
                    <Form.Group controlId="roles">
                        <MultiSelect
                            options={roles}
                            onChange={handleRoleChange}
                            value={selected}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCreate} disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ACreateUserPage;