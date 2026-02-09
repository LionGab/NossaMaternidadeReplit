import { renderHook, waitFor } from "@testing-library/react-native";
import { createWrapper } from "./test-utils";
import { useCycleData } from "../useCycleData";

jest.mock("@/api/cycle", () => ({
  fetchCycleData: jest.fn(),
}));

const { fetchCycleData } = jest.requireMock("@/api/cycle") as {
  fetchCycleData: jest.Mock;
};

describe("useCycleData", () => {
  beforeEach(() => {
    fetchCycleData.mockReset();
  });

  it("retorna dados do ciclo", async () => {
    fetchCycleData.mockResolvedValue({
      logs: [],
      settings: {
        cycle_length: 28,
        last_period_start: "2026-01-10",
        period_length: 5,
      },
    });

    const { result } = renderHook(() => useCycleData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.settings?.cycle_length).toBe(28);
  });

  it("retorna erro quando fetch falha", async () => {
    fetchCycleData.mockRejectedValue(new Error("Cycle fetch failed"));

    const { result } = renderHook(() => useCycleData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Cycle fetch failed");
  });
});

