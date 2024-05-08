let apiRoot = "";

// Môi trường Dev sẽ chạy localhost với port 8017
if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017/v1/";
}

// Môi trường Production sẽ cần api endpoint chuẩn của các bạn
if (process.env.BUILD_MODE === "production") {
  apiRoot = "";
}
// console.log('🚀 ~ file: constants.js:7 ~ apiRoot:', apiRoot)
export const API_ROOT = apiRoot;
