import { Application } from "@oak/oak/application";
import { BookRouter } from "./routes/book.ts";
import { Book, Books } from "./data/books.ts";
import { config } from "./common/config.ts";
import { Router, Status } from "@oak/oak";
import { Database } from "./db/index.ts";
import { BOOKS_KEY } from "./constant.ts";

const app = new Application();
const bookDb = new Database<Book>(BOOKS_KEY);
const rootRouter = new Router();
const bookRouter = new BookRouter(bookDb).build();

rootRouter.get("/", (context) => {
  context.response.status = Status.OK;
  context.response.body = "Hello World!";
});

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());
app.use(bookRouter.routes());
app.use(bookRouter.allowedMethods());

if (import.meta.main) {
  bookDb.seed(Books);

  console.log(
    `%cServer is running on http://localhost:${config.PORT}`,
    "color: green",
  );
  await app.listen({ port: config.PORT || 8000 });
}
