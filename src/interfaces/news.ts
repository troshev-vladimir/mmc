export namespace NewsInterface {
  export interface News {
    itemsCount: number;
    items: Array<New>;
  }
  export interface New {
    newsId: number;
    newsSlug: string;
    newsType: string;
    published: string;
    name: string;
    text: string;
    title: string;
    html: string;
    description: string;
    slug: string;
    image: string;
    isDeleted: boolean;
  }
}
