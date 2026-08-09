import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

//импорт функций из файлов
import { searchPhoto } from "./js/pixabay-api";
import { galleryRender } from "./js/render-functions";
import { clearGallery } from "./js/render-functions";
import { showLoader } from "./js/render-functions";
import { hideLoader } from "./js/render-functions";
import { showLoadBtn } from "./js/render-functions";
import { hideLoadBtn } from "./js/render-functions";

//добавление "базовых" элементов
const searchForm = document.querySelector("form");
const searchInput = document.querySelector('input');
const loadButton = document.querySelector('.loadMoreButton');

//началльные параметры
hideLoadBtn();
let pageNumber;

//Обработка сабмита
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    clearGallery();
    hideLoadBtn();
    pageNumber = 1;
    loadGallery(pageNumber);
});

//обработка кнопки
loadButton.addEventListener("click", event => {
    event.preventDefault();
    pageNumber += 1;
    loadGallery(pageNumber);
    hideLoadBtn();
});


const loadGallery = async (pageNumber) => {
    /*
    Check Value (EMPTY_FIELD)
    Serch photo (NO_IMAGES)
    Page Scroll
        1. totalHits < 15
            весь результат на первой страничке, дальше не грузим
        2. все результаты показаны (MAX_PAGES)
        3. грузим дальше с прокруткой
    Gallery Render (data.hits)
     */
    try {
        showLoader();
        hideLoadBtn();
        const currentQuery = await checkValue(searchInput.value);
        const photoDatas = await searchPhoto(currentQuery, pageNumber);
        const resultPhotos = await scrollPhotos(photoDatas, pageNumber);
        //galleryRender(resultPhotos);
    }
    catch (error) {
        switch (error.code) {
            case "EMPTY_FIELD":
                iziToast.error({
                    message: "Field can't be empty."
                });
                console.error(error);
                break;
            
            case "NO_IMAGES":
                iziToast.error({
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                });
                console.error(error);
                break;
            
            case "MAX_PAGES":
                iziToast.error({
                    message: "We're sorry, but you've reached the end of search results."
                });
                console.error(error);
                break;
            
            default:
                iziToast.error({
                    message: "Something went wrong. Please try again later."
                });
                console.error(error);
                break;
        }
    }
    finally {
        hideLoader();
    };
};

const scrollPhotos = async(data, page) => {
    const totalHitsValue = data.totalHits;
    const imagesPerPage = data.per_page;
    const maxPages = Math.floor(totalHitsValue / imagesPerPage);
    if (page === 1) {
        galleryRender(data.hits);
        showLoadBtn();
    } else if (maxPages < page && page!=1) {
        hideLoadBtn();
        const error = new Error();
        error.code = 'MAX_PAGES';
        throw error;
    } else {
        galleryRender(data.hits);
        const galleryItem = document.querySelector(".gallery-link");
        const galleryItemParams = galleryItem.getBoundingClientRect();
        const itemHeight = galleryItemParams.height;
        const scrollValue = itemHeight * 2;
        window.scrollBy({
            top: scrollValue,
            behavior: "smooth",
        });
        showLoadBtn();
    }
};

//Обработка значения инпута (пустая или нет)
const checkValue = async(value) => {
    const trimedValue = value.trim();
    if (trimedValue === '') {
        const error = new Error();
        error.code = 'EMPTY_FIELD';
        throw error;
    } return trimedValue;
};