import { Errors } from "./mmc-store";
import { NewsInterface } from "@/interfaces/news";
import fetchWrapper from "./fetchWrapper";

interface FeedBackBody {
  message: string;
  slug: string;
  lang: string;
  email: string;
}

export default class NewMethods {
  public async item(
    id: number | string,
    lang: string
  ): Promise<NewsInterface.New | undefined> {
    let query;
    if (typeof id === "number") {
      query = {
        newsId: id,
        lang,
      };
    } else {
      query = {
        slug: id,
        lang,
      };
    }
    return await fetchWrapper<NewsInterface.New>(`/api/News/Get`, query);
  }

  public async get(params: GetParams): Promise<NewsInterface.News | undefined> {
    return await fetchWrapper<NewsInterface.News>(
      "/api/News/List",
      {},
      "POST",
      params
    );
  }

  public async subscribe(email: string, lang: string): Promise<unknown> {
    return await fetchWrapper(
      "/api/News/Subscribe",
      {
        email,
        lang,
      },
      "POST",
      undefined
    );
  }

  public async feedback(body: FeedBackBody | FormData): Promise<unknown> {
    return await fetchWrapper("/api/News/Feedback", {}, "POST", body);
  }
}

interface GetParams {
  newsId?: number;
  slug?: string;
  publishedFrom?: string;
  publishedTo?: string;
  newsType?: string[];
  includeHtml?: boolean;
  lang?: string;
  searchPattern?: string;
  orderBy?: string;
  skip?: number;
  take?: number;
  IsDeleted?: boolean;
}
