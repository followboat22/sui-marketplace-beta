import { useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";

const CreateButton = ({
  icon,
  title,
  description,
  link,
  disabled,
  className,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = (to) => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <div className={className}>
      <button
        className="createButton"
        type="button"
        disabled={disabled}
        onClick={() => handleClick(link)}
      >
        <div className="createButtonWrapper">
          <img alt="" className="pb-20" src={icon} />
          <h4 className="createButtonText pb-20">{title}</h4>
          <span className="createButtonText">{description}</span>
        </div>
      </button>
    </div>
  );
};

export default CreateButton;
