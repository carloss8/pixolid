import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import UserImages from "./user-images.container";
import "@testSetup";

describe.only("UserImages", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <UserImages providers={[]} />
      </Router>
    );
  });

  test("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });
});
