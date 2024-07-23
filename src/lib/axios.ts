import axios from "axios";

export const api = axios.create({
  baseURL: "https://plann-er-api.onrender.com",
});
