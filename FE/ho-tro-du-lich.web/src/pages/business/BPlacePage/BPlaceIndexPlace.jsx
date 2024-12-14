import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import { systemAction } from "../../../redux/slices/systemSlice";
import { placeService } from "../../../services/placeService";
import { FaInfoCircle, FaSearch, FaFilter } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import Paging from "../../../common/components/Paging/Paging";
import Table from "../../../common/components/Table/Table";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import { ApprovalTypeDescriptions, CApprovalType } from "../../../enum/approvalTypeEnum";
import AUpdatePlacePage from "../../admin/APlaceManage/AUpdatePlacePage";
import APlaceDetailPage from "../../admin/APlaceManage/APlaceDetailPage";
import ACreatePlacePage from "../../admin/APlaceManage/ACreatePlacePage";
import ConfirmModalPage from "../../commonpage/ModalPage/ConfirmModalPage";
import useDocumentTitle from "../../../common/js/useDocumentTitle";

const BPlaceIndexPlace = () => {
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [errorList, setErrorList] = useState([]);
  const [dataPlaces, setDataPlaces] = useState([]);
  useDocumentTitle('Địa điểm');
  const [pagingData, setPagingData] = useState({
    currentPage: 1,
    total: 1,
    pageSize: 10,
  });
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filter, setFilter] = useState({
    approvalType: null,
    placeType: null,
    fromDate: null,
    toDate: null,
  });

  // Fetch data
  const fetchData = useCallback(async (paging = 1, query = "", filter = {}, sort = {}) => {
    dispatch(systemAction.enableLoading());
    try {
      const result = await placeService.getMyPlacePaging({
        pageNumber: paging,
        pageSize: 10,
        isBusiness: false,
        searchQuery: query,
        filterProperty: filter,
        sortProperty: sort,
      });

      if (result && result.success) {
        setDataPlaces(result.data.items);
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

  const handleDeletePlace = (placeId) => {
    toast.info(placeId);
    setDataPlaces((prevPlaces) => prevPlaces.filter((place) => place.placeId !== placeId));
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

  const handleOpenDetailModal = (placeId) => {
    setSelectedPlaceId(placeId);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedPlaceId(null);
  };

  const handleSubmitSearch = (data) => {
    fetchData(1, data.searchQuery, filter);
  };

  const handleSort = (key, direction) => {
    fetchData(1, "", filter, { key, direction });
  };

  const handleApplyFilter = (filter) => {
    setFilter(filter);
    fetchData(1, "", filter);
  };

  const handleClearFilter = () => {
    setFilter({});
    setShowFilterSidebar(false);
  };

  return (
    <div className="frame-place-detail p-2 w-100 h-100 overflow-auto">
      <FormErrorAlert errors={errorList} />
      <div className="d-flex justify-content-between">
        <Form className="d-flex gap-1" onSubmit={handleSubmit(handleSubmitSearch)}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm địa điểm"
            {...register("searchQuery")}
          />
          <Button type="submit" variant="success">
            <FaSearch />
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => setShowFilterSidebar(true)}
            className="ms-2"
          >
            <FaFilter />
          </Button>
        </Form>
      </div>

      <Table
        columns={initColumn}
        items={dataPlaces}
        template={
          <TableRowTemplate
            onDelete={handleDeletePlace}
            onEdit={handleOpenUpdateModal}
            onOpenDetail={handleOpenDetailModal}
          />
        }
        onSort={handleSort}
      />

      <Paging
        data={pagingData}
        classActive={"bg-success text-white"}
        onChange={(page) => fetchData(page)}
      />

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

      {selectedPlaceId && (
        <APlaceDetailPage
          show={showDetailModal}
          placeId={selectedPlaceId}
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
  const [errors, setErrors] = useState([]);

  const handleDelete = async (placeId) => {
    const result = await placeService.deletePlaceById(placeId);
    if (result && result.success) {
      toast.success(result.data.message);
      onDelete(placeId);
    } else if (result && result.errors) {
      setErrors(result.errors);
    }
    setShowConfirmDeleteModal(false);
  };

  const renderApprovalStatus = (approvalType) => {
    let statusLabel =
      ApprovalTypeDescriptions[approvalType] || "Không xác định";
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
      case CApprovalType.None:
        statusColor = "secondary";
        break;
      default:
        statusColor = "gray";
    }

    return (
      <div className="d-flex align-items-center">
        <div
          className={`rounded-circle bg-${statusColor}`}
          style={{ width: "10px", height: "10px" }}
        ></div>
        <span className="ms-2">{statusLabel}</span>
      </div>
    );
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
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
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
            {owner.fullName.charAt(0).toUpperCase()}
          </div>
        </OverlayTrigger>
      );
    }
  };

  return (
    <>
      <FormErrorAlert errors={errors} />
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
              {data.name.charAt(0).toUpperCase()}
            </div>
          )}
        </td>
        <td className="fw-bold">{data.name}</td>
        <td>{PlaceTypeDescriptions[data.placeType] || "Không xác định"}</td>
        <td>{new Date(data.createdDate).toLocaleDateString("vi-VN")}</td>
        <td>{renderApprovalStatus(data.approvalType)}</td>
        <td>{data.totalView}</td>
        <td>{renderOwner(data.ownerProperty)}</td>
        <td>
          <Button
            className="me-2"
            variant="outline-info"
            size="sm"
            onClick={() => onOpenDetail(data.placeId)}
            title="Xem chi tiết"
          >
            <FaInfoCircle />
          </Button>
          <Button
            className="me-2"
            variant="outline-warning"
            size="sm"
            onClick={() => onEdit(data.placeId)}
            title="Cập nhật"
          >
            <i className="bi bi-pencil-fill"></i>
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setShowConfirmDeleteModal(true)}
            title="Xóa"
          >
            <i className="bi bi-trash-fill"></i>
          </Button>
        </td>
      </tr>
      <ConfirmModalPage
        show={showModal}
        onConfirm={() => handleDelete(data.placeId)}
        onCancel={() => setShowConfirmDeleteModal(false)}
      />
    </>
  );
};

const FilterSidebar = ({ show, onClose, onApplyFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({
    approvalType: null,
    placeType: null,
    fromDate: null,
    toDate: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: ['placeType', 'approvalType'].includes(name)
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
          <Form.Group className="mb-3" controlId="approvalType">
            <Form.Control
              as="select"
              name="approvalType"
              value={filters.approvalType || null}
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

          <Form.Group className="mb-3" controlId="placeType">
            <Form.Label>Loại địa điểm</Form.Label>
            <Form.Control
              as="select"
              name="placeType"
              value={filters.placeType || ""}
              onChange={handleChange}
            >
              <option value="">Chọn loại địa điểm</option>
              {Object.keys(CPlaceType).map((key) => {
                const value = CPlaceType[key];
                return (
                  <option key={value} value={value}>
                    {PlaceTypeDescriptions[value]}
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
            <Button variant="primary" onClick={handleApplyFilters}>
              Áp dụng
            </Button>
            <Button variant="outline-danger" onClick={handleClearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default BPlaceIndexPlace;
