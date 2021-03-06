import { ControllerResponse } from '../consts';
import { HttpStatus } from '@nestjs/common';

export class HttpResponse {
  public static error(
    status: number,
    message: string,
    data: any = {},
  ): ControllerResponse {
    return {
      status,
      message,
      data,
    };
  }

  public static successCreated(data: any = {}): ControllerResponse {
    return {
      status: HttpStatus.CREATED,
      message: 'Created successfully',
      data,
    };
  }

  public static successMessage(message: string): ControllerResponse {
    return HttpResponse.success(message);
  }

  public static successData(data: any = {}): ControllerResponse {
    return HttpResponse.success(undefined, data);
  }

  public static successUpdated(data: any = {}): ControllerResponse {
    return HttpResponse.success('Updated successfully', data);
  }

  public static successDeleted(data: any = {}): ControllerResponse {
    return HttpResponse.success('Deleted successfully', data);
  }

  private static success(message?: string, data: any = {}): ControllerResponse {
    return { status: HttpStatus.OK, message, data };
  }
}
