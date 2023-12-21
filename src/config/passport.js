import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import config from "./config.js";
import User from "../models/user.js";

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_SECRET,
      algorithms: "HS256",
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.sub);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(err, false);
      }
    }
  )
);

export default passport;
