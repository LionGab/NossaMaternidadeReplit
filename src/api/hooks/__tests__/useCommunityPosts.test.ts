import { renderHook, waitFor } from "@testing-library/react-native";
import { createWrapper } from "./test-utils";
import { useCommunityPosts } from "../useCommunityPosts";

jest.mock("@/api/community", () => ({
  fetchPosts: jest.fn(),
}));

const { fetchPosts } = jest.requireMock("@/api/community") as {
  fetchPosts: jest.Mock;
};

describe("useCommunityPosts", () => {
  beforeEach(() => {
    fetchPosts.mockReset();
  });

  it("retorna posts com sucesso", async () => {
    fetchPosts.mockResolvedValue({
      data: [{ id: "1", content: "Post 1" }],
      error: null,
    });

    const { result } = renderHook(() => useCommunityPosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  it("retorna erro quando API falha", async () => {
    fetchPosts.mockResolvedValue({
      data: [],
      error: new Error("Network error"),
    });

    const { result } = renderHook(() => useCommunityPosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Network error");
  });
});

