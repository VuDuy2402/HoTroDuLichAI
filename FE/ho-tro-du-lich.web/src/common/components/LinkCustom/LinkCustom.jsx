import { Link } from "react-router-dom";

const LinkCustom = ({ title, url, className, ...otherProps }) => {
  return (
    <div className="p-1 text-white">
      <Link to={url} style={{ textDecoration: "none" }}>
        <p className={`m-0 ${className}`} {...otherProps}>
          {title}
        </p>
      </Link>
    </div>
  );
};

export default LinkCustom;
