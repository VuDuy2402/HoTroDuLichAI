/* eslint-disable react/prop-types */
const TabCustom = ({
  items,
  selectedItem,
  classTab,
  classActiveTab,
  onChange,
}) => {
  return (
    <div className="w-100 d-flex border-1">
      {items &&
        items.map((item, idx) => (
          <button
            key={items.id || idx}
            type="button"
            onClick={() => onChange && onChange(item)}
            className={`${
              classTab
                ? classTab
                : "btn btn-light rounded-0 w-100 text-center border-0"
            } ${
              (item.id && selectedItem === item.id) ||
              (!item.id && selectedItem === idx)
                ? classActiveTab
                  ? classActiveTab
                  : "border-2 border-bottom border-success text-success"
                : ""
            }`}
          >
            {item.label}
          </button>
        ))}
    </div>
  );
};

export default TabCustom;
