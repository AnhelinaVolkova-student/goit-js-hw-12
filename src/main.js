import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { searchPhoto } from "./js/pixabay-api";
import { galleryRender } from "./js/render-functions";
import { clearGallery } from "./js/render-functions";
import { showLoader } from "./js/render-functions";
import { hideLoader } from "./js/render-functions";
import axios from "axios";



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

const mainFunction = async (pageNumber) => {
    try {
        const query = checkValue(searchInput.value);
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

const loadButton = document.querySelector('[type="button"]');
loadButton.style.display = "none";

const showGallery = async(page) => {
    
    showLoader();
    const galleryData = await mainFunction(page);
    const totalImages = galleryData.totalHits;
    const imagesPerPage = galleryData.per_page;
    const maxPages = Math.floor(totalImages / 15);
    if (maxPages <= page) {
        loadButton.style.display = "none";
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
        loadButton.style.display = "";
    }
}

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
    pageNumber = 1;
    showGallery(pageNumber);
});


