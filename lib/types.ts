export type WishColor = "red" | "blue" | "green" | "yellow" | "purple";
export type WishLanguage = "en" | "ja" | "my";
export type WishStatus = "pending" | "approved" | "rejected";

export type Wish = {
  id: string;
  wishText: string;
  nickname: string;
  nicknameIsDefault: boolean;
  color: WishColor;
  language: WishLanguage;
  status: WishStatus;
  createdAt: string;
};
