import * as ReactTooltip from 'react-tooltip';

const Tooltip = ({ id, children }) => (
  <>
    <ReactTooltip id={id} place="top" type="dark" effect="solid" delayShow={150}>
      <span>{children[0]}</span>
    </ReactTooltip>
    <a data-tip data-for={id}>
      {children.filter((a, i) => i !== 0)}
    </a>
  </>
);

export default Tooltip;
