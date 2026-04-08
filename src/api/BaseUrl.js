import axios from "axios";
// export const urlWeb = "http://127.0.0.1:8080";
export const urlWeb = process.env.REACT_APP_BASE_URL;
const baseUrl = axios.create({ baseURL: urlWeb });

export default baseUrl;
