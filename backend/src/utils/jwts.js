/**
 * @param {import('express').Request} req
 * @param {('access'|'refresh'|'all')} type
 * @returns {{access: string|null, refresh: string|null}}
 */
function getJwtFromRequest(req, type) {
  const tokens = tryGetTokensFromCookie(req, type);
  return tokens !== null
    ? tokens
    : tryGetTokensFromAuthorisationHeader(req, type);
}

/**
 * @param {import('express').Request} req
 * @param {('access'|'refresh'|'all')} type
 * @returns {{access: string|null, refresh: string|null}}
 */
function tryGetTokensFromCookie(req, type) {
  const { accessToken, refreshToken } = req.cookies;
  return type === "all"
    ? !accessToken || !refreshToken
      ? null
      : { access: accessToken, refresh: refreshToken }
    : type === "access" && accessToken
      ? { access: accessToken, refresh: null }
      : refreshToken
        ? { access: null, refresh: refreshToken }
        : null;
}

/**
 * @param {import('express').Request} req
 * @param {('access'|'refresh'|'all')} type
 * @returns {{access: string|null, refresh: string|null}}
 */
function tryGetTokensFromAuthorisationHeader(req, type) {
  // TODO: I did not think about how I'd handle refresh tokens in the header.
  // I'll figure that out.
  if (type === "refresh") {
    return null;
  }
  let accessToken;
  const accessTokenHeader = req.headers.authorization;
  if (accessTokenHeader && accessTokenHeader.startsWith("Bearer ")) {
    accessToken = accessTokenHeader.substring(7);
  }
  if (!accessToken) {
    return null;
  }
  return { access: accessToken, refresh: null };
}

module.exports = getJwtFromRequest;
