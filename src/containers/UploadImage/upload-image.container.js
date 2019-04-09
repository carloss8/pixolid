import React, { Component } from "react";
import { withWebId } from "@inrupt/solid-react-components";
import { Utils } from "utils";
import { FolderModal, ImageUploader } from "@components";
import { Image } from "@models";
import { UploadImageWrapper } from "./upload-image.style";
import { withToastManager } from "react-toast-notifications";

/**
 * Container component for the Upload Image page,
 * handles showing the upload component.
 */
class UploadImageComponent extends Component<Props> {
  constructor(props) {
    super(props);
    this.addImage = this.addImage.bind(this);
    this.setAppFolder = this.setAppFolder.bind(this);
    this.waitingForFolder = this.waitingForFolder.bind(this);

    this.state = {
      appFolder: ""
    };
    this.baseUrl = Utils.getBaseUrl(this.props.webId);
  }
  componentDidMount() {
    if (this.props.webId && this.props.appFolder) {

    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.webId && this.state.appFolder !== prevState.appFolder) {

    }
  }

  /**
   * Shows a notification after an image was uploaded.
   * @param {Image} image An uploaded image.
   */
  addImage(image: Image) {
    this.props.toastManager.add("Image Added", { appearance: "success" });
  }

  /**
   * Saves a given folder into the component's state.
   * @param {String} folder A folder to be saved.
   */
  setAppFolder(folder) {
    this.setState({ appFolder: folder });
  }

  /**
   * Sets the loading state to false, while waiting for
   * an application folder.
   */
  waitingForFolder() {
    this.setState({ isLoading: false });
  }

  render() {
    return (
      <UploadImageWrapper>
        <ImageUploader
          addImage={this.addImage}
          appFolder={this.state.appFolder}
        />
        <FolderModal
          setAppFolder={this.setAppFolder}
          onWaitingForFolder={this.waitingForFolder}
        />
      </UploadImageWrapper>
    );
  }
}

export default withToastManager(withWebId(UploadImageComponent));
