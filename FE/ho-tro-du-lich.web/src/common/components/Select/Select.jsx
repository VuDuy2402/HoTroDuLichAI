/**
 *
 * @param items : [{label:string, value:any}]
 * @param {callback}onChange
 * @returns
 */

import { useEffect, useRef, useState } from "react";

const Select = ({
  label,
  id,
  items,
  register,
  name,
  onChange,
  onLoadData,
  defaultOption,
  ...otherProps
}) => {
  const selectRef = useRef(null);
  const handleOnChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (selectRef.current) {
  //       const { scrollTop, scrollHeight, clientHeight } = selectElement;
  //       if (scrollTop + clientHeight >= scrollHeight) {
  //       }
  //     }
  //   };
  //   if (selectRef.current) {
  //     selectRef.current.addEventListener("scroll", handleScroll);
  //   }
  //   return () => {
  //     if (selectRef.current) {
  //       selectRef.current.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, []);

  return (
    <div>
      {label && (
        <label className="fw-bold" htmlFor={id}>
          {label}
        </label>
      )}
      {register && (
        <select
          ref={selectRef}
          id={id}
          className="form-select"
          value={otherProps.value}
          {...register(name, {
            onChange: (e) => handleOnChange(e),
          })}
          {...otherProps}
        >
          {defaultOption && <option value=""></option>}
          {items &&
            items.map((item, idx) => (
              <option key={idx} value={item.value}>
                {item.label}
              </option>
            ))}
        </select>
      )}
      {!register && (
        <select
          ref={selectRef}
          id={id}
          className="form-select"
          value={otherProps.value}
          onChange={(e) => handleOnChange(e)}
          {...otherProps}
        >
          {defaultOption && <option value=""></option>}
          {items &&
            items.map((item, idx) => (
              <option key={idx} value={item.value}>
                {item.label}
              </option>
            ))}
        </select>
      )}
    </div>
  );
};

export default Select;
