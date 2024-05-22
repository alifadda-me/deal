import { FORBIDDEN } from 'http-status';

export default (roles: string[]) => {
  return (req, _res, next) => {
    const userRole = req.decodedToken.user.role;
    if (userRole === 'ADMIN') {
      return next();
    }

    if (roles.includes(userRole)) {
      return next();
    }

    return next({ msg: 'Access denied.', statusCode: FORBIDDEN });
  };
};
