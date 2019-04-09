import React from "react";

import { NavBar } from "@components";

import { NavBarProfile } from "./children";

const navigation = [
  {
    id: "friends-images",
    icon: "/img/people.svg",
    label: "Friends' Images",
    to: "/friends/images"
  },
  {
    id: "user-images",
    icon: "/img/icon/things.svg",
    label: "My Images",
    to: "/user/images"
  },
  {
    id: "upload-image",
    icon: "/img/icon/files.svg",
    label: "Upload Image",
    to: "/user/upload"
  },
  {
    id: "profile",
    icon: "/img/icon/apps.svg",
    label: "Profile",
    to: "/user/profile"
  }
];

const AuthNavBar = props => {
  return (
    <NavBar
      navigation={navigation}
      toolbar={[
        {
          component: () => <NavBarProfile {...props} />,
          label: "Profile",
          id: "profile"
        }
      ]}
    />
  );
};

export default AuthNavBar;
