import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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

const ANewPlaceRequestPagingPage = () => {
  const [errorList, setErrorList] = useState([]);
  const [dataPlaces, setDataPlaces] = useState([]);
  const [pagingData, setPagingData] = useState({ currentPage: 1, total: 1, pageSize: 10 });
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filter, setFilter] = useState({ approvalType: null, placeType: null, fromDate: null, toDate: null });

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const fetchData = async (paging = 1, query = "", filter = {}, sort = {}) => {
    dispatch(systemAction.enableLoading());
    try {
      const result = await placeService.getWithPagingRequestNewPlaceAdmin({
        pageNumber: paging,
        pageSize: 10,
        searchQuery: query,
        filterProperty: filter,
        sortProperty: sort,
      });

      if (result?.success) {
        setDataPlaces(result.data.items);
        setPagingData({
          currentPage: result.data.currentPage,
          total: result.data.totalPages,
          pageSize: result.data.pageSize,
        });
      } else if (result?.errors) {
        setErrorList(result.errors);
      } else {
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

  const handleSubmitSearch = (data) => fetchData(1, data.searchQuery, filter);

  const handleSort = (key, direction) => fetchData(1, "", filter, { key, direction });

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
      <div className="d-flex justify-content-end">
        <Form className="d-flex gap-1" onSubmit={handleSubmit(handleSubmitSearch)}>
          <Form.Control type="text" placeholder="Tìm kiếm địa điểm" {...register("searchQuery")} />
          <Button type="submit" variant="success"><FaSearch /></Button>
          <Button variant="outline-secondary" onClick={() => setShowFilterSidebar(true)} className="ms-2">
            <FaFilter />
          </Button>
        </Form>
      </div>

      <Table
        columns={[
          { label: "Ảnh", row: "thumbnail" },
          { label: "Tên địa điểm", row: "name", sortable: true },
          { label: "Loại địa điểm", row: "placeType", sortable: true },
          { label: "Ngày tạo", row: "createdDate", sortable: true },
          { label: "Trạng thái duyệt", row: "approvalType", sortable: true },
          { label: "Số lượt xem", row: "totalView", sortable: true },
          { label: "Chủ sở hữu", row: "ownerProperty.fullName", sortable: true },
          { label: "Hành động", row: "actions" },
        ]}
        items={dataPlaces}
        template={<TableRowTemplate />}
        onSort={handleSort}
      />

      <Paging
        data={pagingData}
        classActive={"bg-success text-white"}
        onChange={(page) => fetchData(page)}
      />

      <FilterSidebar
        show={showFilterSidebar}
        onClose={() => setShowFilterSidebar(false)}
        onApplyFilters={handleApplyFilter}
        onClearFilters={handleClearFilter}
      />
    </div>
  );
};

const TableRowTemplate = ({ data }) => {
  const renderApprovalStatus = (approvalType) => {
    const status = ApprovalTypeDescriptions[approvalType] || "Không xác định";
    const color = approvalType === CApprovalType.Accepted ? "success"
      : approvalType === CApprovalType.Rejected ? "danger"
      : approvalType === CApprovalType.PendingAprroval ? "warning" : "secondary";
    return (
      <div className="d-flex align-items-center">
        <div className={`rounded-circle bg-${color}`} style={{ width: "10px", height: "10px" }}></div>
        <span className="ms-2">{status}</span>
      </div>
    );
  };

  const renderOwner = (owner) => {
    const initials = owner.fullName.split(" ")[0].charAt(0).toUpperCase();
    const avatar = owner.avatar ? (
      <img src={owner.avatar} alt={owner.fullName} style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
    ) : (
      <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#007bff", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
        {initials}
      </div>
    );

    return (
      <OverlayTrigger placement="top" overlay={<Tooltip>{`${owner.fullName} (${owner.email})`}</Tooltip>}>
        {avatar}
      </OverlayTrigger>
    );
  };

  return (
    <tr>
      <td>
        {data.thumbnail ? <img src={data.thumbnail} alt={data.name} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
          : <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#007bff", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
            {data.name.charAt(0).toUpperCase()}
          </div>}
      </td>
      <td className="fw-bold">{data.name}</td>
      <td>{PlaceTypeDescriptions[data.placeType] || "Không xác định"}</td>
      <td>{new Date(data.createdDate).toLocaleDateString("vi-VN")}</td>
      <td>{renderApprovalStatus(data.approvalType)}</td>
      <td>{data.totalView}</td>
      <td>{renderOwner(data.ownerProperty)}</td>
      <td>
        <Button variant="outline-info" size="sm" onClick={() => {}} title="Xem chi tiết">
          <Link to={`/quantri/xacnhan/diadiem/${data.placeId}`}><FaInfoCircle /></Link>
        </Button>
      </td>
    </tr>
  );
};

const FilterSidebar = ({ show, onClose, onApplyFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({ approvalType: null, placeType: null, fromDate: null, toDate: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value || null }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({ approvalType: null, placeType: null, fromDate: null, toDate: null });
    onClearFilters();
    onClose();
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton><Offcanvas.Title>Bộ lọc</Offcanvas.Title></Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control as="select" name="approvalType" value={filters.approvalType || ""} onChange={handleChange}>
              <option value="">Chọn trạng thái duyệt</option>
              {Object.keys(CApprovalType).map((key) => (
                <option key={key} value={CApprovalType[key]}>
                  {ApprovalTypeDescriptions[CApprovalType[key]]}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Loại địa điểm</Form.Label>
            <Form.Control as="select" name="placeType" value={filters.placeType || ""} onChange={handleChange}>
              <option value="">Chọn loại địa điểm</option>
              {Object.keys(CPlaceType).map((key) => (
                <option key={key} value={CPlaceType[key]}>
                  {PlaceTypeDescriptions[CPlaceType[key]]}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Từ ngày</Form.Label>
            <Form.Control type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Đến ngày</Form.Label>
            <Form.Control type="date" name="toDate" value={filters.toDate} onChange={handleChange} />
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

export default ANewPlaceRequestPagingPage;
