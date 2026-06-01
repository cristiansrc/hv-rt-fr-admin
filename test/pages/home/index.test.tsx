import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Home } from "../../../src/pages/home";
import * as refineCore from "@refinedev/core";
import * as basicDataProvider from "../../../src/api/basicDataProvider";
import { MemoryRouter } from "react-router-dom";

vi.mock("@refinedev/core");
vi.mock("../../../src/api/basicDataProvider");
vi.mock("../../../src/pages/home/HomePage", () => ({
  HomePage: () => <div data-testid="home-page" />,
}));
vi.mock("../../../src/pages/label/LabelPage", () => ({
  LabelPage: () => <div data-testid="label-page" />,
}));
vi.mock("../../../src/pages/video/VideoPage", () => ({
  VideoPage: () => <div data-testid="video-page" />,
}));
vi.mock("../../../src/pages/image/ImagePage", () => ({
  ImagePage: () => <div data-testid="image-page" />,
}));

// Mock antd Menu to render items as clickable buttons for testing
vi.mock("antd", async () => {
  const actual: any = await vi.importActual("antd");
  const React = await import("react");

  const TestMenu = ({ items, selectedKeys, onSelect }: any) => {
    const renderItems = (menuItems: any[]) => {
      return menuItems.flatMap((item: any) => {
        if (item.children) {
          return [
            React.createElement("button", {
              key: item.key,
              "data-submenu": item.key,
              "data-testid": `submenu-${item.key}`,
            }, item.label),
            ...item.children.map((child: any) =>
              React.createElement("button", {
                key: child.key,
                "data-menuitem": child.key,
                "data-testid": `menuitem-${child.key}`,
                className: selectedKeys?.includes(child.key) ? "selected" : "",
                onClick: () => onSelect?.({ key: child.key }),
              }, child.label)
            ),
          ];
        }
        return React.createElement("button", {
          key: item.key,
          "data-menuitem": item.key,
          onClick: () => onSelect?.({ key: item.key }),
        }, item.label);
      });
    };
    return React.createElement("div", { "data-testid": "menu" }, renderItems(items ?? []));
  };

  const TestDropdown = ({ children, overlay }: any) => {
    return React.createElement("div", null,
      children,
      React.createElement("div", { "data-testid": "dropdown-content" }, overlay)
    );
  };

  return {
    ...actual,
    Menu: TestMenu,
    Dropdown: TestDropdown,
  };
});

const logoutMutation = vi.fn();

const basicDataMock = {
  id: "1",
  firstName: "Juan",
  othersName: "Carlos",
  firstSurName: "Reyes",
  othersSurName: "Martínez",
  dateBirth: "2000-01-01",
  located: "Bogotá",
  locatedEng: "Bogotá",
  startWorkingDate: "2020-01-02",
  greeting: "Hola",
  greetingEng: "Hello",
  email: "correo@example.com",
  instagram: "https://instagram.com/test",
  linkedin: "https://linkedin.com/in/test",
  x: "https://x.com/test",
  github: "https://github.com/test",
  description: "Descripción",
  descriptionEng: "Description",
  wrapper: ["Reconocimiento 1", "Reconocimiento 2"],
  wrapperEng: ["Recognition 1", "Recognition 2"],
  descriptionPdf: ["Descripción PDF 1", "Descripción PDF 2"],
  descriptionPdfEng: ["PDF Description 1", "PDF Description 2"],
};

const clickMenuItem = async (label: string | RegExp) => {
  const user = userEvent.setup();
  const button = screen.getByRole("button", { name: label });
  await user.click(button);
};

describe("Home page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (refineCore.useLogout as unknown as vi.Mock).mockReturnValue({
      mutate: logoutMutation,
      isLoading: false,
    });
    (refineCore.useNotification as unknown as vi.Mock).mockReturnValue({
      open: vi.fn(),
      close: vi.fn(),
    });

    (basicDataProvider.getBasicData as unknown as vi.Mock).mockResolvedValue(
      basicDataMock,
    );
    (basicDataProvider.updateBasicData as unknown as vi.Mock).mockResolvedValue({
      data: basicDataMock,
      status: 204,
    });
  });

  it(
    "renders the header title and the Datos Básicos menu option",
    async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/currículum vitae cristhiam reina/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /datos básicos/i }),
    ).toBeInTheDocument();

    await clickMenuItem(/datos básicos/i);
    expect(
      await screen.findByRole("heading", { level: 3, name: /datos básicos/i }),
    ).toBeInTheDocument();
    },
    10000,
  );

  it("calls logout when the dropdown logout button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await user.click(screen.getByLabelText(/abrir menú de usuario/i));
    await user.click(screen.getByRole("button", { name: /salir/i }));

    expect(logoutMutation).toHaveBeenCalled();
  });

  it("only fetches the basic data once when opening the form", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await clickMenuItem(/datos básicos/i);
    await waitFor(() =>
      expect(basicDataProvider.getBasicData).toHaveBeenCalledTimes(1),
    );
  });

  it("renders the BasicDataForm when clicking the menu item", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await clickMenuItem(/datos básicos/i);

    expect(
      await screen.findByRole("heading", { level: 3, name: /datos básicos/i }),
    ).toBeInTheDocument();
  });

  it("shows alternate content when another menu option is selected", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await clickMenuItem(/datos básicos/i);

    expect(
      await screen.findByRole("heading", { level: 3, name: /datos básicos/i }),
    ).toBeInTheDocument();

    await clickMenuItem(/home/i);

    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
  }, 10000);

  it("renders the label page when the label menu option is selected", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await clickMenuItem(/labels/i);

    expect(await screen.findByTestId("label-page")).toBeInTheDocument();
  });

  it("renders the video page when the video menu option is selected", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await clickMenuItem(/videos/i);

    expect(await screen.findByTestId("video-page")).toBeInTheDocument();
  });

  it("renders the image page when the images menu option is selected", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await clickMenuItem(/imágenes/i);

    expect(await screen.findByTestId("image-page")).toBeInTheDocument();
  });
});
