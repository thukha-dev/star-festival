import type { Wish } from "@/lib/types";

export type WishRow = {
  id: string;
  wish_text: string;
  nickname: string;
  nickname_is_default: boolean;
  color: Wish["color"];
  language: Wish["language"];
  status: Wish["status"];
  created_at: string;
};

export function mapWishRow(row: WishRow): Wish {
  return {
    id: row.id,
    wishText: row.wish_text,
    nickname: row.nickname,
    nicknameIsDefault: row.nickname_is_default,
    color: row.color,
    language: row.language,
    status: row.status,
    createdAt: row.created_at
  };
}
