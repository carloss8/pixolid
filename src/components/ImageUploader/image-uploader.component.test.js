import React from "react";
import { mount } from "enzyme";
import ImageUploaderContainer from "./image-uploader.container";
import {
  ImageUploaderCard,
  ImageUploaderDetail,
  ImageWrapper,
  ImgStyle,
  ButtonStyle,
  ShareStyle,
  FriendImageStyle,
  FriendOptionWrapper,
  FriendNameStyle,
  FriendWebIdStyle
} from "./image-uploader.style";
import "@testSetup";

describe("ImageUploader Component", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <ImageUploaderContainer
        addImage={() => {}}
        appFolder=""
      />
    );
  })
  
  test("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });

  test("renders with styled components", () => {
    expect(wrapper.find(ImageUploaderCard)).toBeTruthy();
    expect(wrapper.find(ImageUploaderDetail)).toBeTruthy();
    expect(wrapper.find(ImageWrapper)).toBeTruthy();
    expect(wrapper.find(ImgStyle)).toBeTruthy();
    expect(wrapper.find(ButtonStyle)).toBeTruthy();
    expect(wrapper.find(ShareStyle)).toBeTruthy();
    expect(wrapper.find(FriendImageStyle)).toBeTruthy();
    expect(wrapper.find(FriendOptionWrapper)).toBeTruthy();
    expect(wrapper.find(FriendNameStyle)).toBeTruthy();
    expect(wrapper.find(FriendWebIdStyle)).toBeTruthy();
  });
});
