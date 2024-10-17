/**
 *
 * @param {[label:string,value:any]} items
 * @param {callback}onChange
 * @returns
 */

const Select = ({ items, value, onChange, ...otherProps }) => {
  const handleOnChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <select
      className="form-select"
      value={value}
      onChange={handleOnChange}
      {...otherProps}
    >
      {items.map((item, idx) => (
        <option key={idx} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
