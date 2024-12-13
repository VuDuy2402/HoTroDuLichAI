import useDocumentTitle from "../../../common/js/useDocumentTitle";

const BHomePage = () => {
  useDocumentTitle('Doanh nghiệp');
  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
      <h4 className="text-success">
        Chào mừng đến với trang quản lý vai trò Business
      </h4>
      <p className="fw-bold">Vui lòng chọn chức năng ở thanh menu bên trái</p>
    </div>
  );
};

export default BHomePage;
