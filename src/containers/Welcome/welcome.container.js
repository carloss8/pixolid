import React, { Component } from "react";
import WelcomePageContent from "./welcome.component";
import { withWebId } from "@inrupt/solid-react-components";
import { SolidBackend } from "@services";
import { FolderModal } from "@components";

/**
 * Container component for the Profile/Welcome page,
 * handles showing the user's information, along
 * with application folder.
 */
class WelcomeComponent extends Component<Props> {
  constructor(props) {
    super(props);
    this.setAppFolder = this.setAppFolder.bind(this);
    this.onChangeAppFolderClick = this.onChangeAppFolderClick.bind(this);
    this.appFolderChanged = this.appFolderChanged.bind(this);

    this.state = {
      name: "",
      image: "",
      appFolder: "",
      open: false,
      isLoading: false
    };
  }
  componentDidMount() {
    if (this.props.webId) {
      this.getProfileData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.webId && this.props.webId !== prevProps.webId) {
      this.getProfileData();
    }
  }

  /**
   * Initiates fetching currently signed user's profile data.
   */
  getProfileData = async () => {
    this.setState({ isLoading: true });
    const me = await SolidBackend.getPerson(this.props.webId);
    this.setState({ name: me.name, image: me.image, isLoading: false });
  };

  /**
   * Saves a given folder into the component's state.
   * @param {String} folder A folder to be saved.
   */
  setAppFolder(folder) {
    this.setState({ appFolder: folder });
  }

  /**
   * Initiates showing of the change application folder modal.
   */
  onChangeAppFolderClick() {
    this.setState({ open: true });
  }

  /**
   * Initiates closing of the change application folder modal.
   */
  appFolderChanged() {
    this.setState({ open: false });
  }

  render() {
    const { name, image, isLoading } = this.state;
    return (
      <div>
        <WelcomePageContent
          name={name}
          image={image}
          isLoading={isLoading}
          onChangeAppFolderClick={this.onChangeAppFolderClick}
          appFolder={this.state.appFolder}
        />
        <FolderModal
          setAppFolder={this.setAppFolder}
          onWaitingForFolder={() => {}}
          open={this.state.open}
          onClose={this.appFolderChanged}
        />
      </div>
    );
  }
}

export default withWebId(WelcomeComponent);
