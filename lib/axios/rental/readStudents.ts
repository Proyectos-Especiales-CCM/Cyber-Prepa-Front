import httpInstance from "../httpInstance";
import { ApiResponse, Student } from "../types";

export const readStudents = async (access_token: string): Promise<ApiResponse<Student>> => {
    let res;
    const endpoint = `rental/students/`;

    await httpInstance
        .get(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
        })
        .then((response) => {
            res = {
                data: response.data,
                status: response.status,
            }
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
    return res || {} as ApiResponse<Student>;
};
