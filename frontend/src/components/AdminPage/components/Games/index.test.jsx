import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as hookGet from "../../hooks/useGetData";
import * as hookPost from "../../hooks/usePostData";
import { TabContext } from "../../contexts";
import Games from ".";

describe("Games", () => {
  let setGamesCountMock;
  let addDataMock;

  beforeEach(() => {
    vi.spyOn(hookGet, "useGetData").mockReturnValue({
      data: {
        data: [],
      },
      isLoading: false,
      isError: false,
    });

    addDataMock = vi.fn(() => {});
    setGamesCountMock = vi.fn();

    vi.spyOn(hookPost, "usePostData").mockReturnValue({
      addData: addDataMock,
      isLoading: false,
    });
  });

  const renderComponent = (
    component,
    value = { setGamesCount: setGamesCountMock }
  ) =>
    <TabContext.Provider value={value}>{component}</TabContext.Provider>;

  it("renders the component", () => {
    const { container } = render(renderComponent(<Games />));
    expect(container).toMatchSnapshot();
  });

  describe("when the data has games", () => {
    beforeEach(() => {
      vi.spyOn(hookGet, "useGetData").mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              date: "22/10/2022",
              name: "Name",
              image: "url",
              team: {
                visitor: "visitor",
                home: "home",
              },
            },
          ],
        },
        isLoading: false,
        isError: false,
      });
    });

    it("should call setGamesCount with correct value", () => {
      render(renderComponent(<Games />));
      expect(setGamesCountMock).toHaveBeenCalledWith(1);
    });
  });

  describe("when is loading games", () => {
    beforeEach(() => {
      vi.spyOn(hookGet, "useGetData").mockReturnValue({
        data: {
          data: [],
        },
        isLoading: true,
        isError: false,
      });
    });

    it("renders the component with loading", () => {
      render(renderComponent(<Games />));
      expect(screen.getByText("Is Loading")).toBeInTheDocument();
    });
  });

  describe("when an error occurs", () => {
    beforeEach(() => {
      vi.spyOn(hookGet, "useGetData").mockReturnValue({
        data: {
          data: [],
        },
        isLoading: false,
        isError: true,
      });
    });

    it("renders the component with error", () => {
      render(renderComponent(<Games />));
      expect(screen.getByText("UPPSSSSS")).toBeInTheDocument();
    });
  });

  describe("when is posting", () => {
    beforeEach(() => {
      vi.spyOn(hookPost, "usePostData").mockReturnValue({
        addData: () => {},
        isLoading: true,
      });
    });

    it("renders the component with loading during post", () => {
      render(renderComponent(<Games />));
      expect(screen.getByText("is Loading")).toBeInTheDocument();
    });
  });

  describe("when filling all inputs", () => {
    it("renders the component with inputs filled", async () => {
      render(renderComponent(<Games />));

      userEvent.type(
        screen.getByRole("textbox", { name: /name/i }),
        "Game Porto"
      );
      expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue(
        "Game Porto"
      );

      userEvent.clear(screen.getByTestId("date"));
      userEvent.type(screen.getByTestId("date"), "2020-01-02");
      expect(screen.getByTestId("date")).toHaveValue("2020-01-02");

      userEvent.type(screen.getByRole("textbox", { name: /image/i }), "url");
      expect(screen.getByRole("textbox", { name: /image/i })).toHaveValue("url");

      userEvent.type(screen.getByLabelText(/Visitor/i), "Porto");
      expect(screen.getByLabelText(/Visitor/i)).toHaveValue("Porto");

      userEvent.type(screen.getByLabelText(/Home/i), "home");
      expect(screen.getByLabelText(/Home/i)).toHaveValue("home");
    });

    it("should call addData with correct values", async () => {
      render(renderComponent(<Games />));

      userEvent.type(
        screen.getByRole("textbox", { name: /name/i }),
        "Game Porto"
      );
      userEvent.clear(screen.getByTestId("date"));
      userEvent.type(screen.getByTestId("date"), "2020-01-02");
      userEvent.type(screen.getByRole("textbox", { name: /image/i }), "url");
      userEvent.type(screen.getByLabelText(/Home/i), "home");

      expect(screen.getByTestId("submitButton")).toBeInTheDocument();
      userEvent.click(screen.getByTestId("submitButton"));

      await waitFor(() => {
        expect(addDataMock).toHaveBeenCalled();
        expect(addDataMock).toHaveBeenCalledWith(
          expect.objectContaining({
            date: "2020-01-02",
            name: "Game Porto",
            image: "url",
            home: "home",
            visitor: "",
          })
        );
      });
    });
  });
});
