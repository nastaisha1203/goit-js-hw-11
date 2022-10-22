import axios from 'axios';

export class PixabayAPI {
  #query = '';
  #page = 1;
  #totalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      image_type: 'photo',
      safesearch: true,
      orientation: 'horizontal',
      per_page: 40,
    },
  };

  async getPhoto() {
    const url = `https://pixabay.com/api/?key=30762698-4d5459f286765aeda4039727d&q=${
      this.#query
    }&page=${this.#page}`;
    const { data } = await axios.get(url, this.#params);
    return data;
  }
  set query(newQuery) {
    this.#query = newQuery;
  }
  get query() {
    return this.#query;
  }
  incrementPage() {
    this.#page += 1;
  }
  calculateTotalPages(totalHits) {
    this.#totalPages = Math.ceil(totalHits / this.#perPage);
  }
  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }
  resetPages() {
    this.#page = 1;
  }
}
