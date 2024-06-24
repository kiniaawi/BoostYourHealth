import axios from "axios";

axios.defaults.withCredentials = true;

export default axios.create({
  baseURL: "http://localhost:44313",
  //baseURL: 'http://localhost/api/public'
});
