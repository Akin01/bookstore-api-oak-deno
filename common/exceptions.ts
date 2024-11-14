import { Status } from "@oak/oak";

class NotFoundException extends Error {
  code: Status;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
    this.code = Status.NotFound;
  }
}

class ForbiddenException extends Error {
  code: Status;

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenException";
    this.code = Status.Forbidden;
  }
}

export { ForbiddenException, NotFoundException };
