import { useState } from "react";
import MenuSide from "../common/components/MenuSide/MenuSide";
import Navbar from "../common/components/Navbar/Navbar";

const MenuSideLayout = ({ items, children }) => {
  const [statusMenuside, setStatusMenuside] = useState(true);

  return (
    <div className={`m-0 p-0 container-fluid`}>
      <Navbar className={"container-fluid"} />
      <div
        className="container-fluid bg-light px-0"
        style={{
          paddingTop: "50px",
        }}
      >
        <div
          className="content container-fluid w-100 m-0 p-0 d-grid"
          style={
            statusMenuside
              ? {
                  gridTemplateColumns: "250px 1fr",
                  gridTemplateRows: "calc(100vh - 50px)",
                }
              : {
                  gridTemplateColumns: "50px 1fr",
                  gridTemplateRows: "calc(100vh - 50px)",
                }
          }
        >
          <MenuSide
            items={items}
            status={statusMenuside}
            onChangeStatus={() => setStatusMenuside((pre) => !pre)}
          />
          <div className="overflow-hidden" style={{ marginLeft: "10px" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSideLayout;
