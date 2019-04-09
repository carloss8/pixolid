import React from "react";
import { mount } from "enzyme";
import ImageDetailContainer from "./image-detail-modal-container";
import Modal from "react-responsive-modal";
import {
  ImageDetailWrapper,
  ImageStyle,
  ImageInfoWrapper,
  UserImageStyle,
  UserNameStyle,
  DateStyle,
  DescriptionStyle,
  LikeWrapper,
  LikeCountStyle,
  LikeButtonStyle,
  CommentsWrapper,
  CommentAreaWrapper,
  CommentTextareaStyle
} from "./image-detail-modal.style";
import "@testSetup";

describe("ImageDetail Component", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <ImageDetailContainer
        image=""
        appFolder=""
        creator=""
        open={false}
        onClose={() => {}}
      />
    );
  })
  
  test("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });

  test("renders with a modal component", () => {
    expect(wrapper.find(Modal)).toBeTruthy();
  });

  test("renders with styled components", () => {
    expect(wrapper.find(ImageDetailWrapper)).toBeTruthy();
    expect(wrapper.find(ImageStyle)).toBeTruthy();
    expect(wrapper.find(ImageInfoWrapper)).toBeTruthy();
    expect(wrapper.find(UserImageStyle)).toBeTruthy();
    expect(wrapper.find(UserNameStyle)).toBeTruthy();
    expect(wrapper.find(DateStyle)).toBeTruthy();
    expect(wrapper.find(DescriptionStyle)).toBeTruthy();
    expect(wrapper.find(LikeWrapper)).toBeTruthy();
    expect(wrapper.find(LikeCountStyle)).toBeTruthy();
    expect(wrapper.find(LikeButtonStyle)).toBeTruthy();
    expect(wrapper.find(CommentsWrapper)).toBeTruthy();
    expect(wrapper.find(CommentAreaWrapper)).toBeTruthy();
    expect(wrapper.find(CommentTextareaStyle)).toBeTruthy();
  });
});
