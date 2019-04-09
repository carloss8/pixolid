import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import FriendsImages from "./friends-images.container";
import "@testSetup";

describe.only("FriendsImages", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <FriendsImages providers={[]} />
      </Router>
    );
  });

  test("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });
});
