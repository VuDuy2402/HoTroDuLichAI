import styles from "./CardImageCustom.module.scss";
const CardImageCustom = ({ img, templateInfo, name, style }) => {
  return (
    <div
      className={`new-place-frame d-flex flex-column p-2 border p-2 ${styles.card}`}
      style={{
        height: "400px",
        backgroundImage: `url(${img})`,
        backgroundPosition: "center",
        cursor: "pointer",
        ...style,
      }}
    >
      <div className="new-place-frame__content w-100 h-100 d-flex justify-content-center align-items-end">
        <div
          className={`content-place w-100 p-2 d-flex flex-column align-items-center justify-content-center ${styles.contentPlace}`}
        >
          <p
            className="text-center fw-bold fs-4 overflow-hidden m-0 d-flex gap-2 align-items-center justify-content-center"
            style={{ height: "72px" }}
          >
            {name}
          </p>
          <div
            className={`more-detail overflow-hidden w-100 ${styles.moreDetail}`}
          >
            {templateInfo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardImageCustom;
