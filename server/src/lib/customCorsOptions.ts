import { CorsOptions } from "cors";
const dotenv = require("dotenv");

dotenv.config();

const customCorsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS as string;
    if (allowedOrigins != origin) {
      callback(null, true);
    } else {
      callback(new Error("Request from unauthorized origin"));
    }
  },
};

export default customCorsOptions;
