import '../css/styles.css';
import '../css/gallery.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createGallery } from './markup';
import { PixabayAPI } from './PixabayAPI';
import { refs } from './refs';

const pixabay = new PixabayAPI();

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);
const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
async function handleSubmit(evt) {
  evt.preventDefault();

  const {
    elements: { searchQuery },
  } = evt.target;
  const valueSearchQuery = searchQuery.value.trim().toLowerCase();
  if (!valueSearchQuery) {
    Notify.failure('Enter data to search!');
    return;
  }
  pixabay.resetPages();
  refs.boxGallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
  pixabay.query = valueSearchQuery;
  try {
    const { hits, totalHits } = await pixabay.getPhoto();
    if (totalHits === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notify.success(`Hooray! We found ${totalHits} images!`);
    const markup = createGallery(hits);
    refs.boxGallery.insertAdjacentHTML('beforeend', markup);
    lightBox.refresh();
    pixabay.calculateTotalPages(totalHits);
    if (pixabay.isShowLoadMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtn() {
  pixabay.incrementPage();
  if (!pixabay.isShowLoadMore) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.classList.add('is-hidden');
  }
  try {
    const { hits } = await pixabay.getPhoto();
    const markup = createGallery(hits);
    refs.boxGallery.insertAdjacentHTML('beforeend', markup);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    lightBox.refresh();
  } catch (error) {
    console.log(error);
  }
}
