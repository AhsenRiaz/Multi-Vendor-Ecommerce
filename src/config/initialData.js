import User from "../models/user.js";
import logger from "./logger.js";

async function initialData() {
  try {
    const countUsers = await User.estimatedDocumentCount();
    if (countUsers === 0) {
      await User.create({
        name: "admin",
        email: "admin@gmail.com",
        password: "@dmin1234",
        role: "Admin",
        avatar: {
          public_id: "avatars/fnbwiht8dmd9qcatonqe",
          url: "https://res.cloudinary.com/de189mgmt/image/upload/v1703165345/avatars/fnbwiht8dmd9qcatonqe.png",
        },
      });
    }
  } catch (error) {
    logger.error(error);
  }
}

export default initialData;
