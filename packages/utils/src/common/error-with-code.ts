export abstract class ErrorWithCode<
  TCode extends Lowercase<string>,
> extends Error {
  public abstract readonly code: TCode
}
