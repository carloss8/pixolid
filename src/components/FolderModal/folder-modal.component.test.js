import React from "react";
import { mount } from "enzyme";
import FolderModalContainer from "./folder-modal.container";
import Modal from "react-responsive-modal";
import "@testSetup";

describe("FolderModal Component", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <FolderModalContainer
        setAppFolder={() => {}}
        onWaitingForFolder={() => {}}
      />
    );
  })
  
  test("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });

  test("renders with a modal component", () => {
    expect(wrapper.find(Modal)).toBeTruthy();
  });
});
