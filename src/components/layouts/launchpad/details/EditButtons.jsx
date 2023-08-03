import { useNavigate } from "react-router-dom";

const EditButtons = ({ id }) => {
  const navigate = useNavigate();
  const handleGoToDetails = () => {
    navigate(`/edit-mintpad/${id}`);
  };
  const handleGoToCollection = () => {
    navigate(`/edit-collection/${id}`);
  };
  return (
    <div className="flex justify-content-between mint-buttons-wrapper fullWidth">
      <button className="mint-button launchpad-card-button" onClick={handleGoToDetails}>
        <span>Edit Mintpad</span>
      </button>
      <button
        className="mint-button-secondary launchpad-card-button"
        onClick={handleGoToCollection}
      >
        <span>Edit Collection</span>
      </button>
    </div>
  );
};

export default EditButtons;
