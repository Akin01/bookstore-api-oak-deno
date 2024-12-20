import { Database } from "../db/index.ts";
import { Book } from "../data/books.ts";
import { ApiResponse } from "../utils/response.ts";
import { ForbiddenException, NotFoundException } from "../common/exceptions.ts";
import { Router } from "@oak/oak/router";
import { Status } from "@oak/oak";

export class BookRouter {
  private readonly db: Database<Book>;
  private readonly router: Router;

  constructor(db: Database<Book>) {
    this.router = new Router({ prefix: "/api/books" });
    this.db = db;
  }

  build() {
    this.router
      .get("/", (context) => {
        console.log("%cGET /books", "color: green");
        try {
          const books = this.db.findAll();
          if (!books) {
            ApiResponse(context).success("No books found");
            return;
          }
          return ApiResponse(context).success(books);
        } catch (e) {
          ApiResponse(context).error(e);
        }
      })
      .get("/:id", (context) => {
        console.log(
          `%cGET /books/${context.params.id}`,
          "color: green",
        );
        try {
          const id = context.params.id;
          const book = this.db.findOne(id);
          if (!book) {
            ApiResponse(context).error(
              new NotFoundException(
                `Book with id ${id} not found`,
              ),
            );
            return;
          }
          return ApiResponse(context).success(book);
        } catch (e) {
          ApiResponse(context).error(e);
        }
      })
      .post("/", async (context) => {
        console.log("%cPOST /books", "color: green");
        try {
          const requestBody = context.request.body;
          const newBook = <Book> await requestBody.json();
          if (!newBook) {
            ApiResponse(context).error(
              new ForbiddenException("Invalid book data"),
            );
            return;
          }

          if (!newBook.title || !newBook.author) {
            ApiResponse(context).error(
              new ForbiddenException(
                "Title and author are required",
              ),
            );
            return;
          }
          const createdBook = this.db.insertOne(newBook);
          ApiResponse(context).success(createdBook, Status.Created);
        } catch (e) {
          ApiResponse(context).error(e);
        }
      })
      .put("/:id", async (context) => {
        console.log(
          `%cPUT /books/${context.params.id}`,
          "color: green",
        );
        try {
          const id = context.params.id;
          const requestBody = context.request.body;
          const newBookPayload: Book = await requestBody
            .json();

          if (!newBookPayload) {
            ApiResponse(context).error(
              new ForbiddenException("Invalid book data"),
            );
            return;
          }

          const book = this.db.findOne(id);
          if (!book) {
            ApiResponse(context).error(
              new NotFoundException(
                `Book with id ${id} not found`,
              ),
            );
            return;
          }

          if (newBookPayload.title && newBookPayload.author) {
            book.title = newBookPayload.title;
            book.author = newBookPayload.author;
          } else if (newBookPayload.title) {
            book.title = newBookPayload.title;
          } else if (newBookPayload.author) {
            book.author = newBookPayload.author;
          }

          const bookUpdated = this.db.updateOne(id, book);
          ApiResponse(context).success(bookUpdated, Status.Created);
        } catch (e) {
          ApiResponse(context).error(e);
        }
      })
      .delete("/:id", (context) => {
        console.log(
          `%cDELETE /books/${context.params.id}`,
          "color: green",
        );
        try {
          const id = context.params.id;
          const book = this.db.findOne(id);

          if (!book) {
            ApiResponse(context).error(
              new NotFoundException(
                `Book with id ${id} not found`,
              ),
            );
            return;
          }

          this.db.deleteOne(id);
          ApiResponse(context).success(`Book with id ${id} deleted`);
        } catch (e) {
          ApiResponse(context).error(e);
        }
      });
    return this.router;
  }
}
