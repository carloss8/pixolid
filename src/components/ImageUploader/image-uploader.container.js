import React, { Component } from "react";
import ImageUploader from "./image-uploader.component";
import { withWebId } from "@inrupt/solid-react-components";
import SolidBackend from "../../services/solidBackend";

/**
 * Container component for the ImageUploader component,
 * handles selecting images, setting access rights,
 * and uploading new images.
 */
class ImageUploaderContainer extends Component<Props> {
  constructor(props) {
    super(props);
    this.selectedImage = this.selectedImage.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.selectedShareOptions = this.selectedShareOptions.bind(this);
    this.publicChanged = this.publicChanged.bind(this);
    this.setAvailableShareOptions = this.setAvailableShareOptions.bind(this);
    this.state = {
      image: "",
      description: "",
      availableShareOptions: [],
      selectedShareOptions: [],
      public: true
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.public !== prevState.public && this.state.public === false && this.state.availableShareOptions.length === 0) {
      this.setAvailableShareOptions();
    }
  }

  /**
   * Saves the selected image to the component's state.
   * @param {FileList} image A file list containing the image.
   */
  selectedImage(image) {
    this.setState({ image: image });
  }

  /**
   * Saves the current description value to the component's state.
   * @param {Event} event An event triggering the description change.
   */
  descriptionChanged(event) {
    this.setState({ description: event.target.value });
  }

  /**
   * Initiates the upload of a new image, while saving it into the
   * component's state.
   */
  async uploadImage() {
    const imageUrl = await SolidBackend.uploadImage(this.state.image.fileList[0],
                                                    this.state.description,
                                                    this.props.webId,
                                                    this.props.appFolder,
                                                    this.state.public,
                                                    this.state.selectedShareOptions.map(option => option.value));
    this.props.addImage(imageUrl);
    this.setState({ image: "", description: "", selectedShareOptions: [], public: true });
  }

  /**
   * Saves the current selected share options to the component's state.
   * @param {*} selectedShareOptions Selected users to share the image with.
   */
  selectedShareOptions(selectedShareOptions) {
    this.setState({ selectedShareOptions });
  }

  /**
   * Saves the current public toggle state to the component's state.
   * @param {Event} event An event triggering the public change.
   */
  publicChanged(event) {
    this.setState({ public: event.target.checked });
  }

  /**
   * Initiates fetching the user's friends for the sharing options,
   * saving them into the component's state.
   */
  async setAvailableShareOptions() {
    const friends = await SolidBackend.getFriends(this.props.webId);
    const options = friends.map(friend => { return { value: friend.webId, label: friend.name, image: friend.image } });
    this.setState({ availableShareOptions: options });
  }

  render() {
    return (
      <ImageUploader
        image={this.state.image.base64}
        description={this.state.description}
        onImageSelection={this.selectedImage}
        onDescriptionChange={this.descriptionChanged}
        onUploadClick={this.uploadImage}
        shareValue={this.state.selectedShareOptions}
        shareOptions={this.state.availableShareOptions}
        onSelectedShareOptions={(this.selectedShareOptions)}
        public={this.state.public}
        onPublicChanged={this.publicChanged}
      />
    );
  }
}

export default withWebId(ImageUploaderContainer);