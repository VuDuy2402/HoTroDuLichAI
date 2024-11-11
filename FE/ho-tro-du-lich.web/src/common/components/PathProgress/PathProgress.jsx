import { useNavigate } from "react-router-dom";
import styles from "./PathProgress.module.scss";
/**
 *
 * @param items [{label:string,url:string}]
 * @returns
 */
const PathProgress = ({ items, stepActive }) => {
  const navigate = useNavigate();  
  return (
    <div
      className="frame-step-progress d-flex p-3 bg-white justify-content-center"
      style={{ minWidth: "100px", width: "100px", height: "fit-content" }}
    >
      <div
        className="frame-step-line d-flex flex-column align-items-start bg-warning rounded-pill gap-5"
        style={{ maxWidth: "3px" }}
      >
        {items &&
          items.map((step, idx) => (
            <button
              key={idx}
              className={`step btn bg-white d-flex flex-column align-items-center overflow-hidden p-1`}
              style={{
                marginLeft: "-48px",
                width: "100px",
                height: "fit-content",
                maxHeight: "100px",
                maxWidth: "100px",
              }}
              onClick={() => step.url && navigate(step.url)}
            >
              <p
                className={`m-0 rounded-pill d-flex align-items-center justify-content-center ${styles.roundedStep} 
                ${
                  stepActive === idx + 1
                    ? "bg-warning text-white"
                    : "border border-warning bg-white text-warning"
                }`}
              >
                {idx + 1}
              </p>
              <p className={`title-step m-0 text-warning ${styles.stepText}`}>
                {step.label}
              </p>
            </button>
          ))}
      </div>
    </div>
  );
};

export default PathProgress;