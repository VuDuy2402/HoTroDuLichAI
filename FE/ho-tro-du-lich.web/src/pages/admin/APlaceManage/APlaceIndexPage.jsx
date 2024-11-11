import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Modal } from "react-bootstrap";
import { systemAction } from "../../../redux/slices/systemSlice";
import { placeService } from "../../../services/placeService";
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import AUpdatePlacePage from "./AUpdatePlacePage";
import ACreatePlacePage from "./ACreatePlacePage";
import ConfirmModalPage from "../../commonpage/ModalPage/ConfirmModalPage";
import Paging from "../../../common/components/Paging/Paging";
import Table from "../../../common/components/Table/Table";

const APlaceIndexPlace = () => {
    const initColumn = [
        { label: "Ảnh", row: "thumbnail", sortable: false },
        { label: "Tên địa điểm", row: "name", sortable: true },
        { label: "Loại địa điểm", row: "placeType", sortable: true },
        { label: "Ngày tạo", row: "createdDate", sortable: true },
        { label: "Trạng thái duyệt", row: "approvalType", sortable: true },
        { label: "Số lượt xem", row: "totalView", sortable: true },
        { label: "Chủ sở hữu", row: "ownerProperty.fullName", sortable: true },
        { label: "Hành động", row: "actions", sortable: false },
    ];

    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [errorList, setErrorList] = useState([]);
    const [dataPlaces, setDataPlaces] = useState([]);
    const [pagingData, setPagingData] = useState({
        currentPage: 1,
        total: 1,
        pageSize: 10,
    });

    const fetchData = async (paging = 1, query = "", sort = {}) => {
        dispatch(systemAction.enableLoading());
        try {
            const result = await placeService.getWithPaging({
                pageNumber: paging,
                pageSize: 10,
                searchQuery: query,
                filterProperty: {},
                sortProperty: sort,
            });            

            if (result && result.success) {
                setDataPlaces(result.data.items);
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
        fetchData();
    }, []);

    const handleDeletePlace = (placeId) => {
        setDataPlaces((prevPlaces) => prevPlaces.filter(place => place.placeId !== placeId));
    };

    const handleOpenUpdateModal = (placeId) => {
        setSelectedPlaceId(placeId);
        setShowUpdateModal(true);
    };

    const handlePlaceUpdated = () => {
        fetchData();
    };

    const handlePlaceCreated = () => {
        fetchData();
        setShowCreateModal(false);
    };

    const handleSubmitSearch = (data) => {
        fetchData(1, data.searchQuery);
    };

    const handleSort = (key, direction) => {
        fetchData(1, "", { key, direction });
    };

    return (
        <div className="frame-place-detail p-2 w-100 h-100 overflow-auto">
            <FormErrorAlert errors={errorList} />
            <div className="d-flex justify-content-between">
                <Button
                    variant="warning"
                    className="text-white"
                    onClick={() => setShowCreateModal(true)}
                >
                    Tạo Địa Điểm
                </Button>
                <Form className="d-flex gap-1" onSubmit={handleSubmit(handleSubmitSearch)}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm địa điểm"
                        {...register("searchQuery")}
                    />
                    <Button type="submit" variant="warning">
                        <FaSearch />
                    </Button>
                </Form>
            </div>

            {/* Updated Table Component */}
            <Table
                columns={initColumn}
                items={dataPlaces}
                template={<TableRowTemplate onDelete={handleDeletePlace} onEdit={handleOpenUpdateModal} />}
                onSort={handleSort}
            />

            <Paging data={pagingData} onChange={(page) => fetchData(page)} />

            <AUpdatePlacePage
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                placeId={selectedPlaceId}
                onPlaceUpdated={handlePlaceUpdated}
            />

            <ACreatePlacePage
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPlaceCreated={handlePlaceCreated}
            />
        </div>
    );
};

const TableRowTemplate = ({ data, onDelete, onEdit }) => {
    const [showModal, setShowModal] = useState(false);

    const getInitials = (name) => {
        const names = name.split(" ");
        return names[0].charAt(0).toUpperCase();
    };

    const handleDelete = async (placeId) => {
        const result = await placeService.deletePlace(placeId);
        if (result && result.success) {
            toast.success(result.data.message);
            onDelete(placeId);
        } else {
            if (result.errors) {
                setErrorList(result.errors);
            }
        }
        setShowModal(false);
    };

    return (
        <>
            <tr>
                <td>
                    {data.thumbnail ? (
                        <img
                            src={data.thumbnail}
                            alt={data.name}
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
                            {getInitials(data.name)}
                        </div>
                    )}
                </td>
                <td className="fw-bold">{data.name}</td>
                <td>{data.placeType}</td>
                <td>{new Date(data.createdDate).toLocaleDateString("vi-VN")}</td>
                <td>{data.approvalType}</td>
                <td>{data.totalView}</td>
                <td>{data.ownerProperty?.fullName || "Chưa có thông tin"}</td>
                <td>
                    <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => onEdit(data.placeId)}
                    >
                        <i className="bi bi-pencil-fill"></i> Cập nhật
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setShowModal(true)}
                        className="ms-2"
                    >
                        <i className="bi bi-trash-fill"></i> Xóa
                    </Button>
                </td>
            </tr>
            <ConfirmModalPage
                show={showModal}
                onConfirm={() => handleDelete(data.placeId)}
                onCancel={() => setShowModal(false)}
            />
        </>
    );
};

export default APlaceIndexPlace;