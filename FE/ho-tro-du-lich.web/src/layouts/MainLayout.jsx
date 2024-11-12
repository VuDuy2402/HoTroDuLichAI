import Navbar from "../common/components/Navbar/Navbar";
import Footer from "../common/components/Footer/Footer";

const MainLayout = ({ children, containerFluid }) => {
  return (
    <div
      className={`m-0 p-0 container-fluid d-flex flex-column`}
      style={{ minHeight: "100vh" }}
    >
      <Navbar className={!containerFluid ? "container" : "container-fluid"} />
      <div
        className="container-fluid bg-white px-0 h-100 d-flex flex-column"
        style={{ paddingTop: "50px", flex: 1 }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
