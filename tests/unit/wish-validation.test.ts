import { describe, expect, it } from "vitest";
import { localizedAnonymous } from "@/lib/constants";
import { moderateWish } from "@/lib/moderation/moderate";
import { wishSchema } from "@/lib/validation/wish";

describe("wish validation", () => {
  it("accepts valid input", () => {
    const result = wishSchema.safeParse({
      wishText: "I wish for peace.",
      color: "blue",
      language: "en"
    });

    expect(result.success).toBe(true);
  });

  it("rejects over max length", () => {
    const result = wishSchema.safeParse({
      wishText: "a".repeat(121),
      color: "blue",
      language: "en"
    });

    expect(result.success).toBe(false);
  });

  it("uses localized anonymous labels", () => {
    expect(localizedAnonymous.en).toBe("Anonymous");
    expect(localizedAnonymous.ja).toBe("匿名");
    expect(localizedAnonymous.my.length).toBeGreaterThan(0);
  });

  it("flags repeated spam pattern", () => {
    const result = moderateWish({
      wishText: "aaaaaaaaa",
      nickname: "",
      color: "red",
      language: "en"
    });

    expect(result.approved).toBe(false);
  });
});
