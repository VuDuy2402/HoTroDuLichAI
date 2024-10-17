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
          height: `100vh`,
        }}
      >
        <div className="content container-fluid m-0 p-0 d-flex h-100 overflow-hidden">
          <MenuSide
            items={items}
            status={statusMenuside}
            onChangeStatus={() => setStatusMenuside((pre) => !pre)}
          />
          <div className="w-100" style={{ marginLeft: "10px" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSideLayout;
