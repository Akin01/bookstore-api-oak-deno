import { assertEquals, assertExists } from "@std/assert";
import { Status } from "@oak/oak";
import { config } from "./common/config.ts";
import { Book, Books } from "./data/books.ts";
import { Database } from "./db/index.ts";
import { BOOKS_KEY } from "./constant.ts";

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
    const response = await fetch(`http://localhost:${config.PORT}`);
    const body = await response.text();
    assertEquals(body, "Hello World!");
    assertEquals(response.status, Status.OK);
  },
});

Deno.test({
  name: "Get All Books",
  async fn() {
    const response = await fetch(
      `http://localhost:${config.PORT}${endpoint.getAllBooks}`,
    );
    const books = <{ success: boolean; data: Book[] }> await response
      .json();
    assertEquals(response.status, Status.OK);
    assertEquals(books.data.length, Books.length);
    assertEquals(books.data, Books);
  },
});

Deno.test({
  name: "Get a Book",
  async fn() {
    const bookId = "3f70a922-ccac-4524-97b1-80bee584e609";
    const response = await fetch(
      `http://localhost:${config.PORT}${endpoint.getBook(bookId)}`,
    );

    const book = <{ success: boolean; data: Book }> await response
      .json();
    assertEquals(response.status, Status.OK);

    const bookDb = new Database<Book>(BOOKS_KEY);
    const bookFound = bookDb.findOne(book.data.id);
    assertExists(bookFound);
    assertEquals(bookFound.title, book.data.title);
  },
});

Deno.test({
  name: "Create a Book",
  async fn() {
    const response = await fetch(
      `http://localhost:${config.PORT}${endpoint.createBook}`,
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

    const bookCreated = <{ success: boolean; data: Book }> await response
      .json();
    assertEquals(response.status, Status.Created);

    const bookDb = new Database<Book>(BOOKS_KEY);
    const books = bookDb.findOne(bookCreated.data.id);
    assertExists(books);
    assertEquals(books.id, bookCreated.data.id);
  },
});

Deno.test({
  name: "Update a Book",
  async fn() {
    const bookId = "0371b001-981c-4325-ad0b-faba4c5241d3";
    const response = await fetch(
      `http://localhost:${config.PORT}${endpoint.updateBook(bookId)}`,
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

    const bookUpdated = <{ success: boolean; data: Book }> await response
      .json();
    assertEquals(response.status, Status.Created);

    const bookDb = new Database<Book>(BOOKS_KEY);
    const books = bookDb.findOne(bookUpdated.data.id);
    assertExists(books);
    assertEquals(books.title, bookUpdated.data.title);
  },
});

Deno.test({
  name: "Delete a Book",
  async fn() {
    const bookId = "ee3b2fdc-1177-49b2-90e7-74f273eac8f7";
    const response = await fetch(
      `http://localhost:${config.PORT}${endpoint.deleteBook(bookId)}`,
      {
        method: "DELETE",
      },
    );

    assertEquals(response.status, Status.OK);

    await response.body?.cancel();

    const bookDb = new Database<Book>(BOOKS_KEY);
    const books = bookDb.findOne(bookId);
    assertEquals(books, undefined);
  },
});
