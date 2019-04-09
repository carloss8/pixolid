import React from "react";
import { mount } from "enzyme";
import ImagesContainer from "./images.container";
import {
  ImagesCard,
  ImagesDetail,
  NoImagesLabelStyle
} from "./images.style";
import "@testSetup";

describe("Images Component", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <ImagesContainer
        headline="Images"
        images={[]}
        users={[]}
        appFolder=""
        isLoading={false}
      />
    );
  })
  
  test("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });

  test("renders with styled components", () => {
    expect(wrapper.find(ImagesCard)).toBeTruthy();
    expect(wrapper.find(ImagesDetail)).toBeTruthy();
    expect(wrapper.find(NoImagesLabelStyle)).toBeTruthy();
  });
});
