/**
 * Bug Condition Exploration Test — Property 1
 *
 * Validates: Requirements 1.1, 1.3
 *
 * PURPOSE: This test MUST FAIL on unfixed code.
 * Failure confirms the bug: ImageCropModal is placed outside the JSX return root
 * in ProfilePage.tsx, so React silently drops it and it never mounts.
 *
 * EXPECTED OUTCOME (unfixed code): FAIL
 * EXPECTED OUTCOME (fixed code):   PASS
 *
 * Counterexample documented:
 *   "After file selection, ImageCropModal is not in the DOM even though cropSrc
 *    state is set — JSX outside the return root is silently dropped."
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import React from "react";

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mock next/navigation (used by useAuth → useRouter)
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/admin/account",
}));

// Mock next/link — render as a plain <a>
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

// Mock useAuth — return controlled values
const mockUploadProfilePhoto = vi.fn().mockResolvedValue("https://example.com/photo.jpg");
const mockLogout = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    name: "Test User",
    email: "test@example.com",
    role: "EMPLOYEE",
    userId: "42",
    profilePhoto: null,
    uploadProfilePhoto: mockUploadProfilePhoto,
    logout: mockLogout,
  }),
}));

// Mock userService — return a minimal profile so the component doesn't hang
vi.mock("@/services/userService", () => ({
  userService: {
    getProfile: vi.fn().mockResolvedValue({
      id: 42,
      name: "Test User",
      email: "test@example.com",
      role: "EMPLOYEE",
      status: "ACTIVE",
      profilePhoto: null,
      createdAt: "2024-01-01T00:00:00.000Z",
    }),
  },
}));

// Mock react-easy-crop — avoid canvas/WebGL issues in jsdom
vi.mock("react-easy-crop", () => ({
  default: ({ image }: { image: string }) =>
    React.createElement("div", { "data-testid": "mock-cropper", "data-image": image }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeImageFile(name = "photo.jpg", type = "image/jpeg"): File {
  const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]); // minimal JPEG header
  return new File([bytes], name, { type });
}

// ── Test ─────────────────────────────────────────────────────────────────────

describe("Bug Condition — Crop Modal Not Rendered After File Selection (Property 1)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Stub FileReader so readAsDataURL fires onload with a data-URL
    const mockDataUrl = "data:image/jpeg;base64,/9j/4AAQ";
    const MockFileReader = vi.fn().mockImplementation(function (this: any) {
      this.readAsDataURL = vi.fn().mockImplementation(function (this: any) {
        // Trigger onload asynchronously (mimics real FileReader)
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: mockDataUrl } } as any);
          }
        }, 0);
      });
      this.result = mockDataUrl;
    });
    vi.stubGlobal("FileReader", MockFileReader);
  });

  it(
    "should mount ImageCropModal in the DOM after a file is selected via the camera button",
    async () => {
      /**
       * **Validates: Requirements 1.1, 1.3**
       *
       * This test asserts the EXPECTED (correct) behavior:
       *   After selecting a file, ImageCropModal must be present in the DOM.
       *
       * On UNFIXED code the modal is placed outside the JSX return root, so
       * React silently drops it → this assertion FAILS → bug is confirmed.
       *
       * Counterexample: "After file selection, ImageCropModal is not in the DOM
       * even though cropSrc state is set — JSX outside the return root is
       * silently dropped."
       */

      const { ProfilePage } = await import("@/components/common/ProfilePage");

      render(
        React.createElement(ProfilePage, {
          topBar: React.createElement("div", { "data-testid": "top-bar" }, "TopBar"),
        })
      );

      // Wait for the profile to load (userService.getProfile resolves)
      await waitFor(() => {
        expect(screen.queryByText("Test User")).toBeInTheDocument();
      });

      // Find the hidden camera <input type="file">
      const cameraInput = document.querySelector(
        'input[type="file"][accept="image/*"]'
      ) as HTMLInputElement;
      expect(cameraInput).not.toBeNull();

      // Simulate selecting a file on the hidden input by firing a change event
      const imageFile = makeImageFile();
      // jsdom doesn't support DataTransfer, so we stub files directly
      const fileList = {
        0: imageFile,
        length: 1,
        item: (i: number) => (i === 0 ? imageFile : null),
        [Symbol.iterator]: function* () { yield imageFile; },
      };
      Object.defineProperty(cameraInput, "files", {
        value: fileList,
        configurable: true,
      });

      await act(async () => {
        cameraInput.dispatchEvent(new Event("change", { bubbles: true }));
        // Allow FileReader stub's setTimeout to fire
        await new Promise(r => setTimeout(r, 50));
      });

      // Wait for cropSrc state to update and ImageCropModal to mount
      await waitFor(
        () => {
          // ImageCropModal renders a "Crop Photo" heading and the mock-cropper div.
          const cropHeading = screen.queryByText("Crop Photo");
          const mockCropper = screen.queryByTestId("mock-cropper");

          // ASSERTION: ImageCropModal MUST be present in the DOM.
          // On unfixed code this will be null → test FAILS → bug confirmed.
          const modalPresent = cropHeading !== null || mockCropper !== null;
          expect(modalPresent).toBe(true);
        },
        { timeout: 2000 }
      );
    }
  );
});
