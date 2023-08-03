import React from "react";

const PageHeader = ({ children }) => {
  return (
    <section className="flat-title-page inner">
      <div className="themesflat-container">
        <div className="col-md-12">
          {children && <div className="page-title-subheading">{children}</div>}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
