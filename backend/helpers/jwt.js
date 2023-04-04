import { expressjwt } from "express-jwt";

function authJwt(req, res, next) {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;
  console.log(secret);
  return expressjwt({ secret, algorithms: ["HS256"] }).unless({
    path: [
      {
        url: `${api}/products`,
        methods: ["GET", "OPTIONS"],
      },
      `${api}/products//get/featured`,
      `${api}/users/login`,
      `${api}api/v1/users/register`,
    ],
  });
}

export default authJwt;
