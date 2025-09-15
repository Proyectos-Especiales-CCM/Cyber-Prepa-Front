import httpInstance from "../httpInstance";
import { ApiResponse, Play } from "../types";

export const readPlays = async (
  token: string,
  page?: number,
  student?: string
): Promise<ApiResponse<Play>> => {
  let res;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const params: Record<string, any> = {};
  if (page !== undefined) params.page = page;
  if (student) params.student = student;

  await httpInstance
    .get("rental/plays/", {
      headers,
      params,
    })
    .then((response) => {
      res = {
        data: response.data.results,
        status: response.status,
      };
    })
    .catch((error) => {
      throw new Error(error.response?.data?.detail || "Request failed");
    });

  return res || ({} as ApiResponse<Play>);
};
