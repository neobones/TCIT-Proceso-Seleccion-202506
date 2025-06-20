export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export class ResultUtil {
  static success<T>(data: T): Result<T, never> {
    return { success: true, data };
  }

  static failure<E>(error: E): Result<never, E> {
    return { success: false, error };
  }

  static fromPromise<T>(promise: Promise<T>): Promise<Result<T, Error>> {
    return promise
      .then(data => ResultUtil.success(data))
      .catch(error => ResultUtil.failure(error));
  }
} 