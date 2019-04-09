import React, { Component } from "react";
import { withWebId } from "@inrupt/solid-react-components";
import { Images, FolderModal } from "@components";
import { SolidBackend } from "@services";
import { ImagesWrapper } from "../../components/Images/images.style";

/**
 * Container component for the User Images page,
 * handles fetching and showing user's images.
 */
class UserImagesComponent extends Component<Props> {
  constructor(props) {
    super(props);
    this.setAppFolder = this.setAppFolder.bind(this);
    this.waitingForFolder = this.waitingForFolder.bind(this);
    this.getImageData = this.getImageData.bind(this);
    this.state = {
      images: [],
      users: [],
      isLoading: true,
      appFolder: ""
    };
  }
  componentDidMount() {
    if (this.props.webId && this.props.appFolder) {
      this.getImageData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.webId && this.state.appFolder !== prevState.appFolder) {
      this.getImageData();
    }
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

  /**
   * Initiates fetching user's images, while saving them
   * into the component's state.
   */
  async getImageData() {
    this.setState({ isLoading: true });
    const images = await SolidBackend.getImages(this.props.webId, this.state.appFolder);
    const me = await SolidBackend.getPerson(this.props.webId);
    this.setState({ images, users: new Map([[this.props.webId, me]]), isLoading: false });
  }

  render() {
    return (
      <ImagesWrapper>
        <Images
          headline="My Images"
          images={this.state.images}
          users={this.state.users}
          appFolder={this.state.appFolder}
          isLoading={this.state.isLoading}
        />
        <FolderModal
          setAppFolder={this.setAppFolder}
          onWaitingForFolder={this.waitingForFolder}
        />
      </ImagesWrapper>
    );
  }
}

export default withWebId(UserImagesComponent);
