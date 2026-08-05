import SimpleLightboxModule from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const SimpleLightbox =
  SimpleLightboxModule.default ?? SimpleLightboxModule;

const galleryForm = document.querySelector(".gallery");
const gallery = new SimpleLightbox(".gallery a");

export function galleryRender(galleryItems) {
    const markup = galleryItems.map((galleryItem) =>
        `<li class="galleryItemForm">
            <a class="gallery-link" href = "${galleryItem.largeImageURL}">    
                <img
                    src= "${galleryItem.webformatURL}"
                    alt= "${galleryItem.tags}"/>
                <ul class="galleryItemData">
                    <li>
                        <p> Likes </p>
                        <p>${galleryItem.likes}</p>
                    </li>
                    <li>
                        <p> Views</p>
                        <p>${galleryItem.views}</p>
                    </li>
                    <li>
                        <p> Comments </p>
                        <p>${galleryItem.comments}</p>
                    </li>
                    <li>
                        <p>Downloads</p>
                        <p>${galleryItem.downloads}</p>
                    </li>
                </ul>
            </a>
        </li> `
    ).join("");
    galleryForm.insertAdjacentHTML("afterbegin", markup);

    // сообщаем SimpleLightbox о новых ссылках
    gallery.refresh();
}

export function clearGallery() {
    galleryForm.innerHTML = "";
};

const loader = document.querySelector(".loader");
export function showLoader() {
    loader.style.display = "block";
};

export function hideLoader() {
    loader.style.display = "none";
}