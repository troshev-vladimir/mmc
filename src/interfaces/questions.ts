export namespace QuestionInterface {
  export interface Question {
    text: string;
    answers: Answer[];
  }

  export interface Answer {
    text: string;
  }
}
