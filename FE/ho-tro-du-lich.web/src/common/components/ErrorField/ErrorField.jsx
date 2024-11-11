import { useEffect, useState } from "react";

const ErrorField = ({ errorList, field, className }) => {
  const findField = errorList && errorList.find((err) => err.field === field);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (findField) {
      setIsVisible(true);
      // Set a timer to hide the alert after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000); // 10000 milliseconds = 10 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    } else {
      setIsVisible(false); // Hide alert if no form summary error
    }
  }, [findField]);
  return (
    findField &&
    isVisible && (
      <p className={`text-danger m-0 ${className}`}>{findField.error}</p>
    )
  );
};

export default ErrorField;
