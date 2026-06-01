import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import * as altchaLib from "altcha-lib";

vi.mock("altcha-lib", () => ({
  solveChallenge: vi.fn(() => ({
    promise: Promise.resolve({ number: 42 }),
  })),
}));

vi.mock("../../src/api/apiConfig", () => ({
  API_URL: "http://localhost:3000",
}));

const fetchMock = vi.fn();

describe("useAltcha", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches challenge on mount", async () => {
    const { useAltcha } = await import("../../src/hooks/useAltcha");

    const challengeData = {
      algorithm: "SHA-256",
      challenge: "test-challenge",
      salt: "test-salt",
      signature: "test-signature",
    };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => challengeData,
    });

    const { result } = renderHook(() => useAltcha());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.challenge).toEqual(challengeData);
    expect(result.current.error).toBeNull();
  });

  it("sets error when fetch fails", async () => {
    const { useAltcha } = await import("../../src/hooks/useAltcha");

    fetchMock.mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => useAltcha());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toContain("Error al obtener challenge");
  });

  it("returns null when solving without challenge", async () => {
    const { useAltcha } = await import("../../src/hooks/useAltcha");

    fetchMock.mockRejectedValueOnce(new Error("no challenge"));

    const { result } = renderHook(() => useAltcha());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const solution = await act(() => result.current.solveAltcha());

    expect(solution).toBeNull();
  });

  it("solves challenge and returns base64 payload", async () => {
    const { useAltcha } = await import("../../src/hooks/useAltcha");

    const challengeData = {
      algorithm: "SHA-256",
      challenge: "test-challenge",
      salt: "test-salt",
      signature: "test-signature",
    };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => challengeData,
    });

    const { result } = renderHook(() => useAltcha());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.challenge).not.toBeNull());

    const solution = await act(() => result.current.solveAltcha());

    expect(solution).not.toBeNull();
    expect(typeof solution).toBe("string");
  });

  it("handles solveChallenge failure", async () => {
    const { useAltcha } = await import("../../src/hooks/useAltcha");

    const challengeData = {
      algorithm: "SHA-256",
      challenge: "test-challenge",
      salt: "test-salt",
      signature: "test-signature",
    };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => challengeData,
    });

    vi.mocked(altchaLib.solveChallenge).mockImplementationOnce(() => ({
      promise: Promise.reject(new Error("solve failed")),
    }));

    const { result } = renderHook(() => useAltcha());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.challenge).not.toBeNull());

    const solution = await act(() => result.current.solveAltcha());

    expect(solution).toBeNull();
  });

  it("returns null when solution is undefined", async () => {
    const { useAltcha } = await import("../../src/hooks/useAltcha");

    const challengeData = {
      algorithm: "SHA-256",
      challenge: "test-challenge",
      salt: "test-salt",
      signature: "test-signature",
    };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => challengeData,
    });

    vi.mocked(altchaLib.solveChallenge).mockImplementationOnce(() => ({
      promise: Promise.resolve(undefined),
    }));

    const { result } = renderHook(() => useAltcha());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.challenge).not.toBeNull());

    const solution = await act(() => result.current.solveAltcha());

    expect(solution).toBeNull();
  });
});
