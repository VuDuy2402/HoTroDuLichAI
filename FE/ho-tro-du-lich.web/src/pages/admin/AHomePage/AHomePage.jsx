import useDocumentTitle from "../../../common/js/useDocumentTitle";

const AHomePage = () => {
  useDocumentTitle('Quản trị');
  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h4 className="text-success">
          Chào mừng đến với trang quản lý vai trò Admin
        </h4>
        <p className="fw-bold">Vui lòng chọn chức năng ở thanh menu bên trái</p>
      </div>
      <div className="func"></div>
    </div>
  );
};
export default AHomePage;
