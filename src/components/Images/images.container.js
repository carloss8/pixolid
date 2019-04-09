import React, { Component } from "react";
import { withWebId } from "@inrupt/solid-react-components";
import Images from "./images.component";
import { ImageDetailModal } from "@components";

/**
 * Container component for the Images component,
 * handles showing image previews, and initiation
 * of showing the image detail.
 */
class ImagesContainer extends Component<Props> {
  constructor(props) {
    super(props);
    this.onImageClick = this.onImageClick.bind(this);
    this.onImageDetailClose = this.onImageDetailClose.bind(this);
    this.state = {
      selectedImage: null,
      imageDetailOpen: false
    };
  }
  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
  }

  /**
   * Saves the selected image to the component's state,
   * and triggers showing of the image detail.
   * @param {Image} image A selected image.
   */
  onImageClick(image) {
    this.setState({ selectedImage: image, imageDetailOpen: true });
  }
  
  /**
   * Saves the closed state of the image detail into
   * the component's state.
   */
  onImageDetailClose() {
    this.setState({ imageDetailOpen: false });
  }

  render() {
    return (
      <div>
        <Images
          headline={this.props.headline}
          images={this.props.images}
          users={this.props.users}
          onClick={this.onImageClick}
          isLoading={this.props.isLoading}
        />
        <ImageDetailModal
          image={this.state.selectedImage}
          appFolder={this.props.appFolder}
          creator={this.state.selectedImage ? this.props.users.get(this.state.selectedImage.creator) : null}
          open={this.state.imageDetailOpen}
          onClose={this.onImageDetailClose}
        />
      </div>
    );
  }
}

export default withWebId(ImagesContainer);
