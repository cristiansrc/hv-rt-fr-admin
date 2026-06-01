import { describe, it, expect, vi, beforeEach } from "vitest";
import { createImage, deleteImage } from "../../src/api/imageProvider";
import { axiosClient } from "../../src/api/axiosClient";

vi.mock("../../src/api/axiosClient", () => ({
  axiosClient: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("imageProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an image successfully", async () => {
    const payload = {
      url: "https://example.com/image.jpg",
      alt: "Test image",
    };
    vi.mocked(axiosClient.post).mockResolvedValueOnce({ status: 201 });

    const result = await createImage(payload);

    expect(result.status).toBe(201);
    expect(axiosClient.post).toHaveBeenCalledWith("/image-url", payload);
  });

  it("deletes an image successfully", async () => {
    vi.mocked(axiosClient.delete).mockResolvedValueOnce({ status: 204 });

    const result = await deleteImage(42);

    expect(result.status).toBe(204);
    expect(axiosClient.delete).toHaveBeenCalledWith("/image-url/42");
  });
});
