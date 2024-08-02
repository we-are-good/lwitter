export interface TweetType {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
  bookMarkUserIds: Array<string>;
}

export type bookMarks = {
  userId: string;
  bookMarks: Array<string>;
};
