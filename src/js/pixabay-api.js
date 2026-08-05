import axios from "axios";

//Поиск фото
const fetchPhotos = async (query) => {
    const response = await
        axios.get("https://pixabay.com/api/", {
            params: {
                key: "56969779-79703cf16e75705543728b96e",
                q: query,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: "true",
                per_page: 15
            }
        });
    return response.data.hits;
};

//Обработка результатов
export async function searchPhoto(query) {
    const photos = await fetchPhotos(query);
    if (!photos.length) {
        const error = new Error();
        error.code = 'NO_IMAGES';
        throw error;
    } else {
        return photos;
    };
};