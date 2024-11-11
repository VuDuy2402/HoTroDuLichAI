import IntroduceCol from "./Introduce";

const listIntroduce = [
  {
    title: "About",
    items: [
      { text: "About", url: "/" },
      { text: "Submit an issue", url: "/" },
      { text: "Github repo", url: "/" },
      { text: "Slack", url: "/" },
    ],
  },
  {
    title: "GETTING STARTED",
    items: [
      { text: "Introduce", url: "/" },
      { text: "Documentation", url: "/" },
      { text: "Usage", url: "/" },
      { text: "Globals", url: "/" },
      { text: "Elements", url: "/" },
      { text: "Collections", url: "/" },
      { text: "Themes", url: "/" },
    ],
  },
  {
    title: "RESOURCES",
    items: [
      { text: "API", url: "/" },
      { text: "Form ValidationsProduct", url: "/" },
      { text: "Visibility", url: "/" },
      { text: "Accessibility", url: "/" },
    ],
  },
];

const Footer = () => {
  return (
    <div className="container-fluid footer m-0 pt-3 bg-white">
      <div className="container">
        <div className="footer__header">
          <p>COURSE WEBSITE</p>
        </div>
        <div className="footer__body d-flex gap-2 justify-content-between">
          {listIntroduce.map((introduce, idx) => (
            <IntroduceCol
              key={idx}
              title={introduce.title}
              items={introduce.items}
            />
          ))}
        </div>
        <div className="footer__end border-1 border-top mt-3">
          <p className="m-0">COURSE WEBSITE</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
