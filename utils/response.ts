import { Status } from "@oak/oak";
import { ForbiddenException, NotFoundException } from "../common/exceptions.ts";

// deno-lint-ignore no-explicit-any
export const ApiResponse = (ctx: any) => {
  return {
    // deno-lint-ignore no-explicit-any
    success: (data: any, status?: Status) => {
      ctx.response.status = status || Status.OK;
      ctx.response.body = {
        success: true,
        data,
      };
    },
    // deno-lint-ignore no-explicit-any
    error: (err: any) => {
      if (err instanceof ForbiddenException) {
        ctx.response.status = Status.Forbidden;
        ctx.response.body = {
          success: false,
          message: err.message,
        };
      } else if (err instanceof NotFoundException) {
        ctx.response.status = err.code;
        ctx.response.body = {
          success: false,
          message: err.message,
        };
      } else {
        ctx.response.status = Status.InternalServerError;
        ctx.response.body = {
          success: false,
          message: "Internal Server Error",
        };
      }
    },
  };
};
