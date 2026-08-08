import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { searchPhoto } from "./js/pixabay-api";
import { galleryRender } from "./js/render-functions";
import { clearGallery } from "./js/render-functions";
import { showLoader } from "./js/render-functions";
import { hideLoader } from "./js/render-functions";
import { showLoadBtn } from "./js/render-functions";
import { hideLoadBtn } from "./js/render-functions";



//Обработка значения инпута (пустая или нет)
function checkValue(value) {
    const trimedValue = value.trim();
    if (trimedValue === '') {
        const error = new Error();
        error.code = 'EMPTY_FIELD';
        throw error;
    } return trimedValue;
}

let pageNumber = 1;

const searchForm = document.querySelector("form");
const searchInput = document.querySelector('input');

//Проверка основных функций на ошибки

const mainFunction = async (query, pageNumber) => {
    try {
        const photos = await searchPhoto(query, pageNumber);
        galleryRender(photos.hits);
        return photos;
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



const showGallery = async(query, page) => {
    
    showLoader();
    hideLoadBtn();
    try {
        const galleryData = await mainFunction(query, page);
    } catch (error) {
        iziToast.error({
            message: "Something went wrong. Please try again later."
        });
        console.error(error);
    }
    const totalImages = galleryData.totalHits;
    const imagesPerPage = galleryData.per_page;
    const maxPages = Math.floor(totalImages / 15);
    if (maxPages <= page || totalHits < 15) {
        hideLoadBtn();
        const error = new Error();
        error.code = 'MAX_PAGES';
        throw error;
    } else if (page>1) {
        const galleryItem = document.querySelector(".gallery-link");
        const galleryItemParams = galleryItem.getBoundingClientRect();
        const itemHeight = galleryItemParams.height;
        const scrollValue = itemHeight * 2;
        window.scrollBy({
            top: scrollValue,
            behavior: "smooth",
        });
    }else {
        showLoadBtn();
    }
}

const loadButton = document.querySelector('[type="button"]');
hideLoadBtn();
loadButton.addEventListener("click", event => {
    event.preventDefault();
    pageNumber += 1;
    showGallery(pageNumber)
        .then()
        .catch(error => {
            if (error.code === 'MAX_PAGES') {
                iziToast.error({
                    message: "We're sorry, but you've reached the end of search results."
                });
                console.error(error);
            } else {
                iziToast.error({
                    message: "Something went wrong. Please try again later."
                });
                console.error(error);
            }
        });
});

//Обработка сабмита
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    clearGallery();
    hideLoadBtn();
    const query = checkValue(searchInput.value);
    pageNumber = 1;
    showGallery(pageNumber)
        .then()
        .catch(error => {
            if (error.code === 'MAX_PAGES') {
                iziToast.error({
                    message: "We're sorry, but you've reached the end of search results."
                });
                console.error(error);
            } else {
                iziToast.error({
                    message: "Something went wrong. Please try again later."
                });
                console.error(error);
            }
        });
});


