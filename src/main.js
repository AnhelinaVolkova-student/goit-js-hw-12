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
let pageNumber = 1;

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
});

//Обработка значения инпута (пустая или нет)
function checkValue(value) {
    const trimedValue = value.trim();
    if (trimedValue === '') {
        const error = new Error();
        error.code = 'EMPTY_FIELD';
        throw error;
    } return trimedValue;
}

//Загрузка галереи с значением из инпута
function loadGallery(pageNumber) {
    const query = checkValue(searchInput.value);
    showGallery(query, pageNumber)
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
}

//Проверка основных функций (рендер и поиск фото) на ошибки
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

//Добавляем зависимость галереи от страницы и колличества результатов
const showGallery = async(query, page) => { 
    showLoader();
    hideLoadBtn();
    const galleryData = await mainFunction(query, page)
        .then(data => {
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
        })
        .catch(error => {
            iziToast.error({
                message: "Something went wrong. Please try again later."
            });
            console.error(error);
        });
}








