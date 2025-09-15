import httpInstance from "../httpInstance";
import { ApiResponseSingle, Student } from "../types";

export const readStudentById = async (studentId: string, token?: string) => {
    let res;
    const endpoint = `rental/students/${studentId}/`;

    await httpInstance
        .get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then((response) => {
            res = {
                data: response.data,
                status: response.status,
            };
        })
        .catch((error) => {
            throw new Error(error.response?.data?.detail || "Request failed");
        });
    return res || {} as ApiResponseSingle<Student>;
};