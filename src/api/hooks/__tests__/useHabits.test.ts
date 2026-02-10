import { renderHook, waitFor } from "@testing-library/react-native";
import { createWrapper } from "./test-utils";
import { useHabits } from "../useHabits";

jest.mock("@/api/habits", () => ({
  fetchHabits: jest.fn(),
  toggleHabit: jest.fn(),
}));

const { fetchHabits } = jest.requireMock("@/api/habits") as {
  fetchHabits: jest.Mock;
};

describe("useHabits", () => {
  beforeEach(() => {
    fetchHabits.mockReset();
  });

  it("retorna lista de hábitos", async () => {
    fetchHabits.mockResolvedValue([{ id: "h1", title: "Água" }]);

    const { result } = renderHook(() => useHabits(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  it("retorna erro quando API falha", async () => {
    fetchHabits.mockRejectedValue(new Error("Habits failed"));

    const { result } = renderHook(() => useHabits(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Habits failed");
  });
});
