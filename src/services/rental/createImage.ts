import httpInstance from "../httpInstance";
import { ApiResponseSingle, Image } from "../types";
import { convertImageToModernFormat } from "../../utils/convertImageToModernFormat";

export const createImage = async ( token: string, image: File ): Promise<ApiResponseSingle<Image>> => {

    let res;
    const endpoint = `rental/images/`;
    const optimizedImage = await convertImageToModernFormat(image);

    const requestBody = new FormData();
    requestBody.append('image', optimizedImage);

    await httpInstance
        .post(endpoint, requestBody, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            res = {
                data: response.data,
                status: response.status,
              };
        })
        .catch((error) => {
            throw new Error(error.response.data.detail);
        });
        
    return res || {} as ApiResponseSingle<Image>;
};