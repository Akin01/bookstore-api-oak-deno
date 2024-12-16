import { assertEquals, assertExists } from "@std/assert";
import { Status } from "@oak/oak";
import { config } from "./common/config.ts";
import { Book, Books } from "./data/books.ts";

const baseURL = `http://localhost:${config.PORT}`;
const endpoint = {
  getAllBooks: "/api/books",
  createBook: "/api/books",
  updateBook: (id: string) => `/api/books/${id}`,
  getBook: (id: string) => `/api/books/${id}`,
  deleteBook: (id: string) => `/api/books/${id}`,
};

Deno.test({
  name: "Healthcheck",
  async fn() {
    const response = await fetch(baseURL);
    const body = await response.text();
    assertEquals(body, "Hello World!");
    assertEquals(response.status, Status.OK);
  },
});

Deno.test({
  name: "Get All Books",
  async fn() {
    const url = new URL(endpoint.getAllBooks, baseURL);
    const response = await fetch(url.href);
    const books: { success: boolean; data: Array<Book & { id: string }> } =
      await response
        .json();

    assertEquals(response.status, Status.OK);
    assertEquals(books.data.length, Books.length);
  },
});

Deno.test({
  name: "Get a Book",
  async fn() {
    const getAllBooksUrl = new URL(endpoint.getAllBooks, baseURL);
    const getAllBooksResponse = await fetch(getAllBooksUrl.href);
    const books: { success: boolean; data: Array<Book & { id: string }> } =
      await getAllBooksResponse
        .json();

    assertExists(books);

    const bookSample = books.data[0];
    const getBookUrl = new URL(endpoint.getBook(bookSample.id), baseURL);
    const getBookResponse = await fetch(getBookUrl.href);

    const book: { success: boolean; data: Book & { id: string } } =
      await getBookResponse.json();

    assertEquals(getBookResponse.status, Status.OK);
    assertEquals(book.data.title, bookSample.title);
  },
});

Deno.test({
  name: "Create a Book",
  async fn() {
    const createBookUrl = new URL(endpoint.createBook, baseURL);
    const createBookResponse = await fetch(
      createBookUrl.href,
      {
        method: "POST",
        body: JSON.stringify({
          "title": "Madilog",
          "author": "Tan Malaka",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const bookCreated: { success: boolean; data: Book & { id: string } } =
      await createBookResponse
        .json();

    assertEquals(createBookResponse.status, Status.Created);
    assertExists(bookCreated);

    const getBookUrl = new URL(endpoint.getBook(bookCreated.data.id), baseURL);
    const getBookResponse = await fetch(getBookUrl.href);

    assertEquals(getBookResponse.status, Status.OK);

    const book: { success: boolean; data: Book & { id: string } } =
      await getBookResponse.json();

    assertExists(book.data);
    assertEquals(book.data.id, bookCreated.data.id);
  },
});

Deno.test({
  name: "Update a Book",
  async fn() {
    const getAllBooksUrl = new URL(endpoint.getAllBooks, baseURL);
    const getAllBooksResponse = await fetch(getAllBooksUrl.href);
    const books: { success: boolean; data: Array<Book & { id: string }> } =
      await getAllBooksResponse
        .json();

    assertExists(books);

    const bookSample = books.data[0];
    const updateBookUrl = new URL(endpoint.updateBook(bookSample.id), baseURL);
    const updateBookResponse = await fetch(
      updateBookUrl.href,
      {
        method: "PUT",
        body: JSON.stringify({
          "title": "Lord of the Rings",
          "author": "J.R.R. Tolkien",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const bookUpdated: { success: boolean; data: Book & { id: string } } =
      await updateBookResponse
        .json();

    assertEquals(updateBookResponse.status, Status.Created);
    assertExists(bookUpdated.data);

    const getBookUrl = new URL(endpoint.getBook(bookUpdated.data.id), baseURL);
    const getBookResponse = await fetch(getBookUrl.href);

    assertEquals(getBookResponse.status, Status.OK);

    const book: { success: boolean; data: Book & { id: string } } =
      await getBookResponse.json();

    assertExists(book.data);
    assertEquals(book.data.title, bookUpdated.data.title);
  },
});

Deno.test({
  name: "Delete a Book",
  async fn() {
    const getAllBooksUrl = new URL(endpoint.getAllBooks, baseURL);
    const getAllBooksResponse = await fetch(getAllBooksUrl.href);
    const books: { success: boolean; data: Array<Book & { id: string }> } =
      await getAllBooksResponse
        .json();

    assertExists(books);

    const bookSample = books.data[0];
    const deleteBookUrl = new URL(endpoint.deleteBook(bookSample.id), baseURL);
    const response = await fetch(
      deleteBookUrl.href,
      {
        method: "DELETE",
      },
    );

    assertEquals(response.status, Status.OK);

    await response.body?.cancel();

    const getBookUrl = new URL(endpoint.getBook(bookSample.id), baseURL);
    const getBookResponse = await fetch(getBookUrl.href);

    assertEquals(getBookResponse.status, Status.NotFound);

    await getBookResponse.body?.cancel();
  },
});
