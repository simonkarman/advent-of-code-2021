interface Answers<Result> {
  exampleA: Result;
  a: Result;
  exampleB: Result
  b: Result;
}

export interface Day<Input, Result> {
  transformInput(input: string[]): Input;
  getAnswers(): Answers<Result>;
  solutionA(input: Input): Result;
  solutionB(input: Input): Result;
}
export interface ClassicDay<Input> extends Day<Input[], number> {}
