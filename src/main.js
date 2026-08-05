import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { searchPhoto } from "./js/pixabay-api";
import { galleryRender } from "./js/render-functions";
import { clearGallery } from "./js/render-functions";
import { showLoader } from "./js/render-functions";
import { hideLoader } from "./js/render-functions";

//Обработка значения инпута (пустая или нет)
function checkValue(value) {
    const trimedValue = value.trim();
    if (trimedValue === '') {
        const error = new Error();
        error.code = 'EMPTY_FIELD';
        throw error;
    } return trimedValue;
}

const searchForm = document.querySelector("form");
const searchInput = document.querySelector('input');

//Проверка основных функций на ошибки

const mainFunction = async () => {
    try {
        const query = checkValue(searchInput.value);
        const photos = await searchPhoto(query);
        galleryRender(photos);
    } catch (error) {
        switch (error.code) {
            case "EMPTY_FIELD":
                iziToast.error({
                    message: "Field can't be empty."
                });
                break;
            
            case 'NO_IMAGES':
                iziToast.error({
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                });
                break;

            default:
                iziToast.error({
                    message: "Something went wrong. Please try again later."
                });
                console.error(error);
        }
    } finally {
        hideLoader();
    }
};

//Обработка сабмита
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    clearGallery();
    showLoader();
    mainFunction();
});