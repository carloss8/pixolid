import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import UploadImage from "./upload-image.container";
import {
  UploadImageWrapper
} from "./upload-image.style";
import "@testSetup";

describe.only("UploadImage", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <UploadImage providers={[]} />
      </Router>
    );
  });

  test("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });

  test("renders with styled components", () => {
    expect(wrapper.find(UploadImageWrapper)).toBeTruthy();
  });
});
