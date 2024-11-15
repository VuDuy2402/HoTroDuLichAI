import { Modal } from "react-bootstrap";
import { FiBell } from "react-icons/fi";

const NotificationBtn = ()=>{
    return (
      <div>
        <button className="btn btn-light rounded-0">
          <FiBell size={20} />
        </button>
        
      </div>
    );
}

export default NotificationBtn;