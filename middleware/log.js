import axios from "axios";

const LOG_API="http://20.244.56.144/evaluation-service/logs";

export async function log(stack,level,pkg,message) {
  try {
    await axios.post(LOG_API,{stack,level,package:pkg,message });
  } catch (error) {
    console.error("Log service error:",error.message);
  }
}
export function loggingMiddleware(req, res, next) {
  log("backend","info", "middleware", `${req.method} ${req.originalUrl}`);
  next();
}
