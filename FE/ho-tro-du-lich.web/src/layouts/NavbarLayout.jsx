import Navbar from "../common/components/Navbar/Navbar";

const NavbarLayout = ({ children }) => {
  return (
    <div className={`m-0 p-0 container-fluid`}>
      <Navbar className={"container-fluid"} />
      <div
        className="container-fluid bg-light px-0"
        style={{
          paddingTop: "50px",
          minHeight: `100vh`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default NavbarLayout;
