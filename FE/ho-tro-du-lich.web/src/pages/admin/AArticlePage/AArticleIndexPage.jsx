import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaFilter, FaInfoCircle, FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { systemAction } from "../../../redux/slices/systemSlice";
import { articleService } from "../../../services/articleService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import AUpdateArticlePage from "./AUpdateArticlePage";
import ACreateArticlePage from "./ACreateArticlePage";
import AArticleDetailPage from "./AArticleDetailPage";
import ConfirmModalPage from "../../commonpage/ModalPage/ConfirmModalPage";
import Paging from "../../../common/components/Paging/Paging";
import Table from "../../../common/components/Table/Table";
import { CApprovalType, ApprovalTypeDescriptions } from "../../../enum/approvalTypeEnum";
import { CArticleType, CArticleTypeDescriptions } from "../../../enum/articleTypeEnum";
import PropTypes from "prop-types";

const AArticleIndexPage = () => {
  const initColumn = [
    { label: "Ảnh", row: "thumbnail", sortable: false },
    { label: "Tiêu đề", row: "title", sortable: true },
    { label: "Loại bài viết", row: "type", sortable: true },
    { label: "Ngày tạo", row: "createdDate", sortable: true },
    { label: "Trạng thái duyệt", row: "approved", sortable: true },
    { label: "Tác giả", row: "author", sortable: true },
    { label: "Chủ bài viết", row: "ownerProperty", sortable: false },
    { label: "Hành động", row: "actions", sortable: false },
  ];

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [errorList, setErrorList] = useState([]);
  const [dataArticles, setDataArticles] = useState([]);
  const [pagingData, setPagingData] = useState({
    currentPage: 1,
    total: 1,
    pageSize: 10,
  });
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filter, setFilter] = useState({
    articleType: null,
    approvalType: null,
    fromDate: null,
    toDate: null,
  });

  const fetchData = useCallback(async (paging = 1, query = "", filter = {}, sort = {}) => {
    dispatch(systemAction.enableLoading());
    try {
      const result = await articleService.getWithPagingAdmin({
        pageNumber: paging,
        pageSize: 10,
        searchQuery: query,
        filterProperty: filter,
        sorterProperty: sort,
      });

      if (result && result.success) {
        setDataArticles(result.data.items);
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

  const handleDeleteArticle = (articleId) => {
    setDataArticles(prevArticles => prevArticles.filter(article => article.articleId !== articleId));
  };

  const handleOpenUpdateModal = (articleId) => {
    setSelectedArticleId(articleId);
    setShowUpdateModal(true);
  };

  const handleArticleUpdated = () => {
    fetchData();
  };

  const handleArticleCreated = () => {
    fetchData();
    setShowCreateModal(false);
  };

  const handleOpenDetailModal = (articleId) => {
    setSelectedArticleId(articleId);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedArticleId(null);
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
        <Button 
          variant="warning" 
          className="text-white" 
          onClick={() => setShowCreateModal(true)}
        >
          Tạo Bài Viết
        </Button>
        <Form className="d-flex gap-1" onSubmit={handleSubmit(handleSubmitSearch)}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm bài viết"
            {...register("searchQuery")}
          />
          <Button type="submit" variant="warning">
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
        items={dataArticles}
        template={<TableRowTemplate onDelete={handleDeleteArticle} onEdit={handleOpenUpdateModal} onOpenDetail={handleOpenDetailModal} />}
        onSort={handleSort}
      />

      <Paging
        data={pagingData}
        classActive={"bg-success text-white"}
        onChange={(page) => fetchData(page)} />

      <AUpdateArticlePage
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        articleId={selectedArticleId}
        onArticleUpdated={handleArticleUpdated}
      />

      <ACreateArticlePage
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onArticleCreated={handleArticleCreated}
      />

      {selectedArticleId && (
        <AArticleDetailPage
          show={showDetailModal}
          articleId={selectedArticleId}
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

  const handleDelete = async (articleId) => {
    const result = await articleService.deleteArticleById(articleId);
    if (result && result.success) {
      toast.success(result.data.message);
      onDelete(articleId);
    } else if (result.errors) {
      toast.error(result.errors.join(", "));
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
      <tr>
        <td>
          {data.thumbnail ? (
            <img
              src={data.thumbnail}
              alt={data.title}
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
              {data.title.charAt(0)}
            </div>
          )}
        </td>
        <td>{data.title}</td>
        <td>{CArticleTypeDescriptions[data.articleType]}</td>
        <td>{new Date(data.createdDate).toLocaleDateString("vi-VN")}</td>
        <td>{renderApprovalStatus(data.approvalType)}</td>
        <td>{data.author}</td>
        <td>{renderOwner(data.ownerProperty)}</td>
        <td>
          <Button
            variant="outline-info"
            size="sm"
            className="ms"
            onClick={() => onOpenDetail(data.articleId)}
            title="Xem chi tiết"
          >
            <FaInfoCircle />
          </Button>
          <Button
            variant="outline-warning"
            size="sm"
            className="ms-2"
            title="Cập nhật"
            onClick={() => onEdit(data.articleId)}
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
        onConfirm={() => handleDelete(data.articleId)}
        onCancel={() => setShowConfirmDeleteModal(false)}
      />
    </>
  );
};

const FilterSidebar = ({ show, onClose, onApplyFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({
    articleType: null,
    approvalType: null,
    fromDate: null,
    toDate: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: ['articleType', 'approvalType'].includes(name)
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
      articleType: null,
      approvalType: null,
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
          <Form.Group className="mb-3" controlId="articleType">
            <Form.Label>Loại bài viết</Form.Label>
            <Form.Control
              as="select"
              name="articleType"
              value={filters.articleType || ""}
              onChange={handleChange}
            >
              <option value="">Chọn loại bài viết</option>
              {Object.keys(CArticleType).map((key) => {
                const value = CArticleType[key];
                return (
                  <option key={value} value={value}>
                    {CArticleTypeDescriptions[value]}
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

FilterSidebar.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default AArticleIndexPage;
