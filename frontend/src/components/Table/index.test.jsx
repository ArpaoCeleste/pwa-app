import React from "react";
import { render } from "@testing-library/react";
import Table from ".";

describe.skip("Table", () => {
  let columns;
  let rows;
  let props;

  beforeEach(() => {
    columns = ["name", "age"];

    rows = {
      data: [
        {
          name: "Chris",
          age: "14",
        },
        {
          name: "Heitor",
          age: "15",
        },
      ],
    };

    props = {
      columns,
      rows,
    };
  });

  it("renders the component", () => {
    const { container } = render(<Table {...props} />);
    expect(container).toMatchSnapshot();
  });

  describe("when dont exists data", () => {
    beforeEach(() => {
      rows = {
        data: [],
      };

      props = {
        ...props,
        rows,
      };
    });

    it("renders the component", () => {
      const { container } = render(<Table {...props} />);
      expect(container).toMatchSnapshot();
    });
  });
});
