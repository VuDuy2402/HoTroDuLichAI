import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import { systemAction } from "../../../redux/slices/systemSlice";
import { businessService } from "../../../services/businessService";
import { FaFilter, FaInfoCircle, FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import AUpdateBusinessPage from "./AUpdateBusinessPage";
import ACreateBusinessPage from "./ACreateBusinessPage";
import ABusinessDetailPage from "./ABusinessDetailPage";
import ConfirmModalPage from "../../commonpage/ModalPage/ConfirmModalPage";
import Paging from "../../../common/components/Paging/Paging";
import Table from "../../../common/components/Table/Table";
import { CBusinessServiceType, CBusinessServiceTypeDescriptions } from "../../../enum/businessTypeEnum";
import { ApprovalTypeDescriptions, CApprovalType } from "../../../enum/approvalTypeEnum";
import useDocumentTitle from "../../../common/js/useDocumentTitle";


const ABusinessIndexPage = () => {
    const initColumn = [
        { label: "Ảnh", row: "thumbnail", sortable: false },
        { label: "Tên doanh nghiệp", row: "businessName", sortable: true },
        { label: "Loại doanh nghiệp", row: "businessServiceType", sortable: true },
        { label: "Ngày tạo", row: "createdDate", sortable: true },
        { label: "Trạng thái duyệt", row: "appoved", sortable: true },
        { label: "Số lượt xem", row: "totalView", sortable: true },
        { label: "Chủ sở hữu", row: "ownerProperty.fullName", sortable: true },
        { label: "Hành động", row: "actions", sortable: false },
    ];

    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);
    const [errorList, setErrorList] = useState([]);
    const [dataBusinesses, setDataBusinesses] = useState([]);
    useDocumentTitle('Quản lý doanh nghiệp');
    const [pagingData, setPagingData] = useState({
        currentPage: 1,
        total: 1,
        pageSize: 10,
    });
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const [filter, setFilter] = useState({
        businessServiceType: null,
        approvalType: null,
        fromDate: null,
        toDate: null,
    });
    const fetchData = useCallback(async (paging = 1, query = "", filter = {}, sort = {}) => {
        dispatch(systemAction.enableLoading());
        try {
            const result = await businessService.getWithPagingAdmin({
                pageNumber: paging,
                pageSize: 10,
                searchQuery: query,
                filterProperty: filter,
                sortProperty: sort,
            });

            if (result && result.success) {
                setDataBusinesses(result.data.items);
                setPagingData({
                    currentPage: result.data.currentPage,
                    total: result.data.totalPages,
                    pageSize: result.data.pageSize,
                });
            } else if (result.errors) {
                setErrorList(result.errors);
            } else {
                toast.error(result);
            }
        } catch (error) {
            toast.error("Error fetching data:", error);
        } finally {
            dispatch(systemAction.disableLoading());
        }
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteBusiness = (businessId) => {
        setDataBusinesses(prevBusinesses => prevBusinesses.filter(business => business.businessId !== businessId));
    };

    const handleOpenUpdateModal = (businessId) => {
        setSelectedBusinessId(businessId);
        setShowUpdateModal(true);
    };

    const handleBusinessUpdated = () => {
        fetchData();
    };

    const handleBusinessCreated = () => {
        fetchData();
        setShowCreateModal(false);
    };

    const handleOpenDetailModal = (businessId) => {
        setSelectedBusinessId(businessId);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedBusinessId(null);
    };

    const handleSubmitSearch = (data) => {
        fetchData(1, data.searchQuery);
    };

    const handleSort = (key, direction) => {
        fetchData(1, "", { key, direction });
    };

    const handleClearFilter = () => {
        setFilter({});
        setShowFilterSidebar(false);
    };

    const handleApplyFilter = (filter) => {
        setFilter(filter);
        fetchData(1, "", filter);
    };

    return (
        <div className="frame-place-detail p-2 w-100 h-100 overflow-auto">
            <FormErrorAlert errors={errorList} />
            <div className="d-flex justify-content-between">
                <Button variant="warning" className="text-white" onClick={() => setShowCreateModal(true)}>
                    Tạo Địa Điểm
                </Button>
                <Form className="d-flex gap-1" onSubmit={handleSubmit(handleSubmitSearch)}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm doanh nghiệp"
                        {...register("searchQuery")} />
                    <Button type="submit" variant="warning">
                        <FaSearch />
                    </Button>
                    <Button 
                        variant="outline-secondary"
                        onClick={() => setShowFilterSidebar(true)}
                        className="ms-2">
                        <FaFilter />
                    </Button>

                    <FilterSidebar
                        show={showFilterSidebar}
                        onClose={() => setShowFilterSidebar(false)}
                        onApplyFilters={handleApplyFilter}
                        onClearFilters={handleClearFilter}
                    />
                </Form>
            </div>

            <Table
                columns={initColumn}
                items={dataBusinesses}
                template={<TableRowTemplate data={dataBusinesses} onDelete={handleDeleteBusiness} onEdit={handleOpenUpdateModal} onOpenDetail={handleOpenDetailModal} />}
                onSort={handleSort}
            />

            <Paging data={pagingData} onChange={(page) => fetchData(page)} />

            <AUpdateBusinessPage
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                businessId={selectedBusinessId}
                onBusinessUpdated={handleBusinessUpdated}
            />

            <ACreateBusinessPage
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onBusinessCreated={handleBusinessCreated}
            />

            {/* Business Detail Modal */}
            {selectedBusinessId && (
                <ABusinessDetailPage
                    show={showDetailModal}
                    businessId={selectedBusinessId}
                    onClose={handleCloseDetailModal}
                />
            )}

            <FilterSidebar
                show={showFilterSidebar}
                onClose={() => setShowFilterSidebar(false)}
                onApplyFilters={handleApplyFilter}
                onClearFilters={handleClearFilter}
            />
        </div>
    );
};

const TableRowTemplate = ({ data, onDelete, onEdit, onOpenDetail }) => {
    const [showModal, setShowConfirmDeleteModal] = useState(false);

    const getInitials = (name) => {
        const names = name.split(" ");
        return names[0].charAt(0).toUpperCase();
    };

    const handleDelete = async (businessId) => {
        const result = await businessService.deleteBusinessAdmin(businessId);
        if (result && result.success) {
            toast.success(result.data.message);
            onDelete(businessId);
        } else if (result.errors) {
            toast.error(result.errors.join(", "));
        }
        setShowConfirmDeleteModal(false);
    };

    const renderApprovalStatus = (approvalType) => {
        let statusLabel = ApprovalTypeDescriptions[approvalType] || "Không xác định";
        let statusColor = "gray";

        switch (approvalType) {
            case CApprovalType.Accepted:
                statusColor = "success";
                break;
            case CApprovalType.Rejected:
                statusColor = "danger";
                break;
            case CApprovalType.PendingAprroval:
                statusColor = "warning";
                break;
            default:
                statusColor = "gray";
        }

        return <span className={`badge bg-${statusColor}`}>{statusLabel}</span>;
    };

    const renderBusinessServiceType = (serviceType) => {
        const serviceTypeLabel = CBusinessServiceTypeDescriptions[serviceType] || "Không xác định";
        let badgeColor = "secondary";
        switch (serviceType) {
            case 1:
                badgeColor = "primary";
                break;
            case 2:
                badgeColor = "info";
                break;
            case 3:
                badgeColor = "success";
                break;
            default:
                badgeColor = "secondary";
        }
        return <span className={`badge bg-${badgeColor}`}>{serviceTypeLabel}</span>;
    };

    const renderOwner = (owner) => {
        if (owner?.avatar) {
            return (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-owner">{`${owner.fullName} (${owner.email})`}</Tooltip>}
                >
                    <img
                        src={owner.avatar}
                        alt={owner.fullName}
                        style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            cursor: "pointer",
                        }}
                    />
                </OverlayTrigger>
            );
        } else {
            return (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-owner">{`${owner.fullName} (${owner.email})`}</Tooltip>}
                >
                    <div
                        style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            backgroundColor: "#007bff",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        {getInitials(owner.fullName)}
                    </div>
                </OverlayTrigger>
            );
        }
    };

    return (
        <>
            <tr>
                <td>
                    {data.thumbnail ? (
                        <img
                            src={data.thumbnail}
                            alt={data.businessName}
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
                            {getInitials(data.businessName)}
                        </div>
                    )}
                </td>
                <td>{data.businessName}</td>
                <td>{renderBusinessServiceType(data.businessServiceType)}</td>
                <td>{new Date(data.createdDate).toLocaleDateString("vi-VN")}</td>
                <td>{renderApprovalStatus(data.appoved)}</td>
                <td>{data.totalView}</td>
                <td>{renderOwner(data.ownerProperty)}</td>
                <td>
                    <Button
                        variant="outline-info"
                        size="sm"
                        className="ms"
                        onClick={() => onOpenDetail(data.id)}
                        title="Xem chi tiết"
                    >
                        <FaInfoCircle />
                    </Button>
                    <Button
                        variant="outline-warning"
                        size="sm"
                        className="ms-2"
                        title="Cập nhật"
                        onClick={() => onEdit(data.id)}
                    >
                        <i className="bi bi-pencil-fill"></i>
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        title="Xóa"
                        onClick={() => setShowConfirmDeleteModal(true)}
                        className="ms-2"
                    >
                        <i className="bi bi-trash-fill"></i>
                    </Button>
                </td>
            </tr>
            <ConfirmModalPage
                show={showModal}
                onConfirm={() => handleDelete(data.id)}
                onCancel={() => setShowConfirmDeleteModal(false)}
            />
        </>
    );
};

const FilterSidebar = ({ show, onClose, onApplyFilters, onClearFilters }) => {
    const [filters, setFilters] = useState({
        businessServiceType: null,
        approvalType: null,
        fromDate: null,
        toDate: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: ['businessServiceType', 'approvalType'].includes(name)
                ? Number(value) || null
                : value || null,
        }));
    };

    const handleApplyFilters = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleClearFilters = () => {
        setFilters({
            approvalType: null,
            placeType: null,
            fromDate: null,
            toDate: null,
        });
        onClearFilters();
        onClose();
    };

    return (
        <Offcanvas show={show} onHide={onClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Bộ lọc</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="businessServiceType">
                        <Form.Label>Loại doanh nghiệp</Form.Label>
                        <Form.Control
                            as="select"
                            name="businessServiceType"
                            value={filters.businessServiceType || ""}
                            onChange={handleChange}
                        >
                            <option value="">Chọn loại doanh nghiệp</option>
                            {Object.keys(CBusinessServiceType).map((key) => {
                                const value = CBusinessServiceType[key];
                                return (
                                    <option key={value} value={value}>
                                        {CBusinessServiceTypeDescriptions[value]}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="approved">
                        <Form.Label>Trạng thái duyệt</Form.Label>
                        <Form.Control
                            as="select"
                            name="approved"
                            value={filters.approvalType || ""}
                            onChange={handleChange}
                        >
                            <option value="">Chọn trạng thái duyệt</option>
                            {Object.keys(CApprovalType).map((key) => {
                                const value = CApprovalType[key];
                                return (
                                    <option key={value} value={value}>
                                        {ApprovalTypeDescriptions[value]}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="fromDate">
                        <Form.Label>Từ ngày</Form.Label>
                        <Form.Control
                            type="date"
                            name="fromDate"
                            value={filters.fromDate || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="toDate">
                        <Form.Label>Đến ngày</Form.Label>
                        <Form.Control
                            type="date"
                            name="toDate"
                            value={filters.toDate || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="primary" onClick={handleApplyFilters}>Áp dụng</Button>
                        <Button variant="outline-danger" onClick={handleClearFilters}>Xóa bộ lọc</Button>
                    </div>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ABusinessIndexPage;
