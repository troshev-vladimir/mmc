import { QuestionInterface } from "@/interfaces/questions";
import fetchWrapper from "./fetchWrapper";
import { vxm } from "@/vuex";

export default class QuestionsMethods {
  public async getQuestion(
    name: string
  ): Promise<QuestionInterface.Question | undefined> {
    let question = await fetchWrapper<any>(
      "/api/Question/GetQuestions",
      { name },
      "GET"
    );
    question =
      vxm.user.lang === "ru" ? question.questionRu : question.questionEn;
    return question;
  }

  public async saveUserAnswer(
    questionName: string,
    answer: string
  ): Promise<undefined> {
    return await fetchWrapper(
      "/api/Question/SaveUserAnswer",
      undefined,
      "POST",
      {
        questionGroupName: questionName,
        answer,
      }
    );
  }
}
