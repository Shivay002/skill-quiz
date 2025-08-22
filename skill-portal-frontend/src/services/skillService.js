import axiosInstance from "../api/axiosInstance";

export async function getAllSkills() {
  const response = await axiosInstance.get("/skills");
  return response.data;
}
