import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://recipe-snap-api.vercel.app/api",
});

export default apiClient;
