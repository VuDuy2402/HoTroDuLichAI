const IconInfo = ({ icon, text }) => {
  return (
    <div className="d-flex align-items-center gap-1">
      {icon}
      <p className="m-0">{text}</p>
    </div>
  );
};

export default IconInfo;
