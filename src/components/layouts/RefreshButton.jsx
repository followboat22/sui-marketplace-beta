const RefreshButton = ({ refreshHandler }) => {
  return (
    <button className="refresh-button" onClick={refreshHandler}>
      <i className="fas fa-redo-alt" />
    </button>
  );
};

export default RefreshButton;
