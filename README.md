# Bookstore API in Oak Deno.

A simple API to manage a bookstore created in lightweight Oak framework in Deno.
The API uses localStorage to store the data. The Properties of the book are:

- `id` (UUID): Unique identifier of the book.
- `title` (String): Title of the book.
- `author` (String): Author of the book.

## Features

- Add a book
- Get all books
- Get a book
- Update a book
- Delete a book

## Instructions

1. Clone the repository
2. Run the server using `deno run -NER main.ts` or `deno task dev`.
3. Use the API endpoints to manage the bookstore.
4. Test the API using Postman or any other API testing tool (You can use HTTP
   Test in `httptest` folder).
5. Run the tests using `deno test main_test.ts` or `deno task test`.

## API Endpoints

`bookApi` is the base URL for the API. You can set the port in the `.env` file.

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | `{{bookApi}}`      | Get all books     |
| GET    | `{{bookApi}}/{id}` | Get a book by Id  |
| PUT    | `{{bookApi}}/{id}` | Update a book     |
| POST   | `{{bookApi}}`      | Create a new book |
| DELETE | `{{bookApi}}/{id}` | Delete a book     |

## Dependencies

- [Oak Middleware](https://jsr.io/@oak/oak)
- localStorage API (Web API supported by Deno)
- [Deno dotenv](https://jsr.io/@std/dotenv)
- UUID (generated under `crypto` libs in Deno)
- [Deno assert](https://jsr.io/@std/assert)

## License

This project is licensed under the MIT License.

## Author

[Ainul Yaqin](https://github.com/akin01)
