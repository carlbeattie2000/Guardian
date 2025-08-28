class CriticalError extends Error {
  constructor(message) {
    super(message);
  }
}

const INTERNAL_UNAUTHORIZED_STATE = new CriticalError(
  "Authorization guard failed: no user identity found for protected route.",
);

module.exports = {
  CriticalError,
  INTERNAL_UNAUTHORIZED_STATE,
};
