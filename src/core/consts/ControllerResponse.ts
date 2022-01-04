import { HttpStatus } from "@nestjs/common";

export type ControllerResponse = {
  status: HttpStatus;
  message?: string;
  data: any;
};
