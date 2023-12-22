import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import config from "./config.js";
import User from "../models/user.js";
import Shop from "../models/shop.js";

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_SECRET,
      algorithms: "HS256",
    },
    async (jwtPayload, done) => {
      console.log(jwtPayload)
      try {
        let entity;
        if (jwtPayload.type === "User") {
          entity = await User.findById(jwtPayload.sub);
        } else if (jwtPayload.type === "Seller") {
          entity = await Shop.findById(jwtPayload.sub);
        } else {
          return done(null, false);
        }
        return done(null, entity);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
