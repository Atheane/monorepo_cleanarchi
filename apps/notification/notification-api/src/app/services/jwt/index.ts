import * as jwt from 'jsonwebtoken';

/**
 * Method to verify a token
 * returns the token payload if the token is valid
 * else throws an error
 *
 * @param {string} token
 * @return {object} payload or error
 */
export function verifyToken(token, secret): any {
  return jwt.verify(token, secret);
}

/**
 * Decode token
 *
 * @param {string} token
 * @return {object}
 */
export function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Check if a token is expired
 *
 * @param {string} token
 * @return {boolean}
 */
export function isExpiredToken(token) {
  const payload = jwt.decode(token);
  return Date.now() >= payload['exp'] * 1000;
}
