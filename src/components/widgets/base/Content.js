import PropTypes from 'prop-types';

export default function Content({ children, ...rest }) {
  return children ? children(rest) : null;
}

Content.propTypes = {
  code: PropTypes.string.isRequired,
  editor: PropTypes.func.isRequired,
  view: PropTypes.func.isRequired,
  compact: PropTypes.func.isRequired,
  onSave: PropTypes.func
};
