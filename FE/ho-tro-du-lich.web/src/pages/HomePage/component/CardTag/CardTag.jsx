/**
 * Component for Home Page
 * @param {*} param0
 * @returns
 */
const CardTag = ({ title, description }) => {
  return (
    <div className="card-tag bg-secondary-subtle rounded-2 w-100 h-100 p-2">
      <div className="w-100 h-100 p-1" style={{ overflow: "hidden" }}>
        <h5>{title}</h5>
        <p>{description}</p>
      </div>
    </div>
  );
};
export default CardTag;
