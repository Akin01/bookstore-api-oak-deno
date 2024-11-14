import { Application } from "@oak/oak/application";
import { BookRouter } from "./routes/book.ts";
import { Database } from "./db/index.ts";
import { BOOKS_KEY } from "./constant.ts";
import { Book, Books } from "./data/books.ts";
import { config } from "./common/config.ts";
import { Router, Status } from "@oak/oak";

const app = new Application();
const rootRouter = new Router();

const bookDb = new Database<Book>(BOOKS_KEY);
const bookRouter = new BookRouter(bookDb).compile();

rootRouter.get("/", (context) => {
  context.response.status = Status.OK;
  context.response.body = "Hello World!";
});

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());
app.use(bookRouter.routes());
app.use(bookRouter.allowedMethods());

bookDb.seed(Books);

console.log(
  `%cServer is running on http://localhost:${config.PORT}`,
  "color: green",
);
await app.listen({ port: config.PORT || 8000 });
