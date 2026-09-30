import PropTypes from 'prop-types'

export function User({ username }) {
  return <strong>{username}</strong>
}

User.propTypes = {
  username: PropTypes.string.isRequired,
}
