import { expressjwt } from "express-jwt";

function authJwt(req, res, next) {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;
  console.log(secret);
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevok,
  }).unless({
    path: [
      {
        url: /\/api\/v1\/products(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/categories(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      ,
      `${api}/users/login`,
      `${api}api/v1/users/register`,
    ],
  });
}

const isRevok = (req, payload, done) => {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
};

export default authJwt;
