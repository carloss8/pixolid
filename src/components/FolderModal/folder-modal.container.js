import React, { Component } from "react";
import FolderModal from "./folder-modal.component";
import { withWebId } from "@inrupt/solid-react-components";
import { SolidBackend } from "@services";
import { Utils } from "utils";

/**
 * Container component for the FolderModal component,
 * handles setting of the application folder.
 */
class FolderModalContainer extends Component<Props> {
  constructor(props) {
    super(props);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.folderChanged = this.folderChanged.bind(this);
    this.folderConfirm = this.folderConfirm.bind(this);
    this.baseUrl = Utils.getBaseUrl(this.props.webId);
    this.state = {
      open: false,
      userRequested: false,
      folder: "",
      invalid: null
    };
  }

  /**
   * Opens the image detail modal.
   */
  onOpenModal() {
    this.setState({ open: true });
  }
 
  /**
   * Closes the image detail modal.
   */
  onCloseModal() {
    this.setState({ open: false, userRequested: false });
    if (this.props.onClose) this.props.onClose();
  }

  /**
   * Saves the current folder value to the component's state.
   * @param {Event} event An event triggering the folder change.
   */
  folderChanged(event) {
    const value = event.target.value;
    const folder = Utils.trimSlashes(value);
    this.setState({ folder: value });
    if (!Utils.isValidFolder("/" + folder + "/")) {
      this.setState({ invalid: "true" });
    } else {
      this.setState({ invalid: null });
    }
  }

  /**
   * Initiates creation of the user entered application folder.
   */
  async folderConfirm(){
    const folder = Utils.trimSlashes(this.state.folder);
    if (!Utils.isValidFolder("/" + folder + "/")) {
      this.setState({ invalid: "true" });
      alert("Enter a valid folder path.");
      return;
    }
    const folderUrl = this.baseUrl + folder + "/";
    await SolidBackend.createAppFolders(this.props.webId, folderUrl).then(created => {
      if (created) {
        this.props.setAppFolder(folderUrl);
        this.onCloseModal();
      } else {
        alert("Error creating app folders, try again.");
      }
    });
  }

  /**
   * Handles getting the application folder, and shows
   * the folder modal, if needed.
   */
  handleAppFolder = async () => {
    await SolidBackend.getValidAppFolder(this.props.webId).then(folder => {
      if (folder) {
        this.props.setAppFolder(folder);
      }
    }).catch(err => {
      this.setState({ open: true });
      this.props.onWaitingForFolder();
    })
  };

  componentDidMount() {
    if (this.props.webId) {
      this.handleAppFolder();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.open !== this.props.open) {
      if (this.props.open === true) {
        this.onOpenModal();
        this.setState({ userRequested: true });
      }
    }
  }

  render() {
    return (
      <FolderModal
        invalid={this.state.invalid}
        open={this.state.open}
        folder={this.state.folder}
        onCloseModal={this.onCloseModal}
        onFolderChange={this.folderChanged}
        onFolderConfirm={this.folderConfirm}
        baseUrl={Utils.getBaseUrl(this.props.webId)}
        userRequested={this.state.userRequested}
      />
    );
  }
}

export default withWebId(FolderModalContainer);