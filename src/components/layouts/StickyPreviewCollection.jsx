import Avatar from "./Avatar";
import LazyLoadImage from "./LazyLoadImage";
import { useSelector } from "react-redux";

const StickyPreviewCollection = () => {
  const user = useSelector((state) => state.user);
  const form = useSelector((state) => state.form["create-collection"]);
  const values = form?.values;

  return (
    <div>
      <h4 className="title-list-item">Preview Collection</h4>
      <div className="sc-card-collection collection-card">
        <LazyLoadImage
          height="200px"
          className="collection-img-featured"
          src={values?.featured_image && URL.createObjectURL(values?.featured_image)}
          key={values?.featured_image ?? "featuredNull"}
        />
        <LazyLoadImage
          className="collection-img-logo ps-abs-mdl"
          src={values?.logo_image && URL.createObjectURL(values?.logo_image)}
          key={values?.logo_image ?? "logoNull"}
        />
        <div className="card-bottom" style={{ height: "200px" }}>
          <div className="author collection-details">
            <div className="sc-author-box style-2">
              <div className="author-avatar">
                <Avatar creator={user} size={64} nolink />
                <div className="badge">
                  <i className="ripple"></i>
                </div>
              </div>
            </div>
            <div className="content">
              <h4>{values?.name ?? "Unnamed Collection"}</h4>
              <div className="info">
                <span>Created by </span>
                <span className="name">{user.display_name ?? "Unknown"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyPreviewCollection;
