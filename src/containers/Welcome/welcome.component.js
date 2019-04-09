import React from "react";
import { LogoutButton } from "@inrupt/solid-react-components";
import isLoading from "@hocs/isLoading";
import {
  WelcomeWrapper,
  WelcomeCard,
  WelcomeLogo,
  WelcomeProfile,
  WelcomeDetail,
  ImageContainer,
  ImageWrapper,
  AppFolderStyle,
  AppFolderLabel
} from "./welcome.style";

/**
 * Welcome/Profile component.
 * @param {Props} props Given props.
 */
const WelcomePageContent = props => {
  return (
    <WelcomeWrapper>
      <WelcomeCard className="card">
        <WelcomeLogo>
          <img src="/img/pixolid.svg" alt="Pixolid" />
          {props.appFolder && (
            <AppFolderStyle>
              <AppFolderLabel>Application Folder: </AppFolderLabel>
              <AppFolderLabel>{props.appFolder}</AppFolderLabel>
              <button onClick={props.onChangeAppFolderClick}>Change Folder</button>
            </AppFolderStyle>
          )}
        </WelcomeLogo>
        <WelcomeProfile>
          <h3>
            Welcome, <span>{props.name}</span>
          </h3>
          <ImageWrapper>
            {props.image && (
              <ImageContainer
                image={props.image}
              />
            )}
          </ImageWrapper>
          <p>
            All Done ? <LogoutButton />
          </p>
        </WelcomeProfile>
      </WelcomeCard>
      <WelcomeCard className="card">
        <WelcomeDetail>
          <h3>
            Welcome to Pixolid!
          </h3>
          <p>
            Here you can publish your photos and view what your friends posted.
          </p>
        </WelcomeDetail>
      </WelcomeCard>
    </WelcomeWrapper>
  );
};

export default isLoading(WelcomePageContent);
