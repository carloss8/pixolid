import React, { Component } from "react";
import { withWebId } from "@inrupt/solid-react-components";
import { Utils } from "utils";
import { Images, FolderModal } from "@components";
import { SolidBackend } from "@services";
import { Image } from "@models";
import { ImagesWrapper } from "../../components/Images/images.style";

/**
 * Container component for the Friends' Images page,
 * handles fetching and showing friends' images.
 */
class FriendsImagesComponent extends Component<Props> {
  constructor(props) {
    super(props);
    this.setAppFolder = this.setAppFolder.bind(this);
    this.waitingForFolder = this.waitingForFolder.bind(this);
    this.getImageData = this.getImageData.bind(this);
    this.state = {
      images: "",
      users: "",
      isLoading: false,
      appFolder: ""
    };
    this.baseUrl = Utils.getBaseUrl(this.props.webId);
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
   * Adds a given image into the component's state.
   * @param {Image} image An image to be added.
   */
  addImage(image: Image) {
    const images = [ image ].concat(this.state.images);
    this.setState({ images: images });
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
    //this.setState({ isLoading: false });
  }

  /**
   * Initiates fetching friends' images, while saving them
   * into the component's state.
   */
  async getImageData() {
    this.setState({ isLoading: true });
    const images = await SolidBackend.getFriendsImages(this.props.webId);
    const friends = await SolidBackend.getFriends(this.props.webId);
    const friendsMap = new Map();
    friends.forEach(friend => { friendsMap.set(friend.webId, friend) });
    this.setState({ images, users: friendsMap, isLoading: false });
  }

  render() {
    return (
      <ImagesWrapper>
        <Images
          headline="Friends' Images"
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

export default withWebId(FriendsImagesComponent);
