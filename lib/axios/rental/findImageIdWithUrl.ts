import { Image } from "../types";

export function findImageIdWithUrl(images: Image[], url: string) {
    const image = images.find((image) => image.image === url);
    return image?.id;
}
