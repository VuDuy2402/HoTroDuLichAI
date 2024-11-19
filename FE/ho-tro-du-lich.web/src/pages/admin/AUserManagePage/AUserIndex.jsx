import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Table from "../../../common/components/Table/Table";
import Paging from "../../../common/components/Paging/Paging";
import { systemAction } from "../../../redux/slices/systemSlice";
import { userService } from "../../../services/userSerivce";
import { useNavigate } from "react-router-dom";
import ConfirmModalPage from "../../commonpage/ModalPage/ConfirmModalPage";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { toast } from "react-toastify";
import AUpdateUserPage from "./AUpdateUserPage";
import ACreateUserPage from "./ACreateUserPage";
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";

const AUserIndex = () => {
    const initColumn = [
        { label: "Ảnh", row: 1 },
        { label: "Họ và tên" },
        { label: "Email" },
        { label: "Địa chỉ" },
        { label: "Ngày sinh" },
        { label: "Ngày tạo" },
        { label: "Vai trò" },
        { label: "Hành động" },
    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [errorList, setErrorList] = useState([]);
    const [dataUsers, setDataUsers] = useState([]);
    const [pagingData, setPagingData] = useState({
        currentPage: 1,
        total: 1,
        pageSize: 10,
    });
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async (paging = 1, query = "") => {
        dispatch(systemAction.enableLoading());
        try {
            const result = await userService.getWithPaging({
                pageNumber: paging,
                pageSize: 10,
                query: query,
                userFilterProperties: {}
            });

            if (result && result.success) {
                setDataUsers(result.data.items);
                setPagingData({
                    currentPage: result.data.currentPage,
                    total: result.data.totalPages,
                    pageSize: result.data.pageSize,
                });
            }
            else if (result.errors) {
                setErrorList(result.errors);
            }
            else {
                toast.error(result);
            }
        } catch (error) {
            toast.error("Error fetching data:", error);
        } finally {
            dispatch(systemAction.disableLoading());
        }
    };

    useEffect(() => {
        fetchData(pagingData.currentPage, searchQuery); 
    }, [pagingData.currentPage, searchQuery]);

    const handleDeleteUser = (userId) => {
        setDataUsers((prevUsers) => prevUsers.filter(user => user.userId !== userId));
    };

    const handleOpenUpdateModal = (userId) => {
        setSelectedUserId(userId);
        setShowUpdateModal(true);
    };

    const handleUserUpdated = (updatedUser) => {
        setDataUsers(prevUsers => prevUsers.map(user => 
            user.userId === updatedUser.userId ? updatedUser : user
        ));
    };

    const handleUserCreated = (newUser) => {
        setDataUsers(prevUsers => [newUser, ...prevUsers]);
        setShowCreateModal(false);
    };

    const handleSubmitSearch = (data) => {
        setSearchQuery(data.searchQuery);
    };

    return (
        <div className="frame-user-detail p-2 w-100 h-100 overflow-auto">
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-warning text-white"
                    onClick={() => setShowCreateModal(true)}
                >
                    Tạo Người Dùng
                </button>
                <form
                    className="d-flex gap-1"
                    onSubmit={handleSubmit(handleSubmitSearch)}
                >
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm người dùng"
                        {...register("searchQuery")}
                    />
                    <button type="submit" className="btn btn-warning">
                        <FaSearch />
                    </button>
                </form>
            </div>
            <Table
                columns={initColumn}
                items={dataUsers}
                template={<TableRowTemplate onDelete={handleDeleteUser} onEdit={handleOpenUpdateModal} />}
            />
            <Paging data={pagingData} onChange={(page) => setPagingData(prev => ({ ...prev, currentPage: page }))} />
            <AUpdateUserPage
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                userId={selectedUserId}
                onUserUpdated={handleUserUpdated}
            />
            <ACreateUserPage
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onUserCreated={handleUserCreated}
            />
        </div>
    );
};

const TableRowTemplate = ({ data, onDelete, onEdit }) => {
    const dispatch = useDispatch();
    const [errorList, setErrorList] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const getInitials = (name) => {
        const names = name.split(" ");
        return names[0].charAt(0).toUpperCase();
    };

    const handleDelete = async (userId) => {
        const result = await userService.deleteUser(userId);
        if (result && result.success) {
            toast.success(result.data.message);
            onDelete(userId);
        } else {
            if (result.errors) {
                setErrorList(result.errors);
            }
        }
        setShowModal(false);
    };

    return (
        <>
            <FormErrorAlert errors={errorList} />
            <tr>
                <td>
                    {data.picture ? (
                        <img
                            src={data.picture}
                            alt={data.fullName}
                            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                backgroundColor: "#007bff",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                            }}
                        >
                            {getInitials(data.fullName)}
                        </div>
                    )}
                </td>
                <td className="fw-bold">{data.fullName}</td>
                <td>{data.email}</td>
                <td>{data.address}</td>
                <td>{data.dateOfBirth ? data.dateOfBirth.toString() : 'N/A'}</td>
                <td>{new Date(data.createdDate).toLocaleDateString("vi-VN")}</td>
                <td>{data.roleDetailProperties.map(role => role.roleName).join(", ")}</td>
                <td>
                    <button className="btn btn-sm btn-outline-warning me-2" title="Cập nhật"
                        onClick={() => onEdit(data.userId)}>
                        <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" title="Xóa"
                        onClick={() => setShowModal(true)}>
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
            <ConfirmModalPage
                show={showModal}
                onConfirm={() => handleDelete(data.userId)}
                onCancel={() => setShowModal(false)}
            />
        </>
    );
};

export default AUserIndex;