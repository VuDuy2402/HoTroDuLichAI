import { useEffect, useState } from "react";
import { placeService } from "../../../services/placeService";
import Table from "../../../common/components/Table/Table";
import { Link } from "react-router-dom";
import { PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import { FaRegTrashAlt } from "react-icons/fa";
import { ApprovalTypeDescriptions } from "../../../enum/approvalTypeEnum";
import Paging from "../../../common/components/Paging/Paging";

const initColumn = [
  { label: "Tên địa điểm" },
  { label: "Loại địa điểm" },
  { label: "Người gửi" },
  { label: "Trạng thái" },
];

const ARequestNewPlacePage = () => {
  const [dataRequest, setDataRequest] = useState([]);
  const [dataFilter, setDataFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
    searchQuery: "",
    filterProperty: {},
    sortProperty: {},
  });
  const [pagingData, setPagingData] = useState({
    currentPage: 1,
    total: 1,
    pageSize: 10,
  });
  const handleGetDataRequestPlace = async (data) => {
    const result = await placeService.requestNewPlacePaging(data);
    if (result) {
      if (result.success) {
        setDataRequest(result.data.items);
        setPagingData({
          currentPage: result.data.currentPage,
          total: result.data.totalPages,
          pageSize: result.data.pageSize,
        });
      }
    }
  };
  useEffect(() => {
    handleGetDataRequestPlace(dataFilter);
  }, [dataFilter]);
  return (
    <div className="request-new-place p-2">
      <h4>Danh sách đơn yêu cầu</h4>
      <Table
        columns={initColumn}
        items={dataRequest}
        template={<TableRowTemplate />}
      />
      <Paging
        classActive={"bg-success text-white"}
        data={pagingData}
        onChange={(page) =>
          setDataFilter((pre) => ({ ...pre, pageNumber: page }))
        }
      />
    </div>
  );
};

const TableRowTemplate = ({ data }) => {
  return (
    <tr>
      <td className="fw-bold">
        <Link to={"/admin/requestnewplace/detail/" + data.placeId}>
          {data.name}
        </Link>
      </td>
      <td>{PlaceTypeDescriptions[data.placeType]}</td>
      <td>{data.ownerProperty?.fullName}</td>
      <td>{ApprovalTypeDescriptions[data.approvalType]}</td>
    </tr>
  );
};

export default ARequestNewPlacePage;
