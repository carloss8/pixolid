import React, { Fragment } from "react";
import { PrivateLayout, PublicLayout, NotLoggedInLayout } from "@layouts";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

import {
  Login,
  Register,
  PageNotFound,
  Welcome,
  RegistrationSuccess,
  UserImages,
  FriendsImages,
  UploadImage
} from "./containers";

const privateRoutes = [
  {
    id: "profile",
    path: "/user/profile",
    component: Welcome
  },
  {
    id: "user-images",
    path: "/user/images",
    component: UserImages
  },
  {
    id: "friends-images",
    path: "/friends/images",
    component: FriendsImages
  },
  {
    id: "upload-image",
    path: "/user/upload",
    component: UploadImage
  }
];

const Routes = () => (
  <Router>
    <Fragment>
      <Switch>
        <NotLoggedInLayout component={Login} path="/login" exact />
        <NotLoggedInLayout component={Register} path="/register" exact />
        <NotLoggedInLayout
          path="/register/success"
          component={RegistrationSuccess}
          exact
        />
        <PublicLayout path="/404" component={PageNotFound} exact />
        <Redirect from="/" to="/friends/images" exact />
        <PrivateLayout path="/" routes={privateRoutes} />
        <Redirect to="/404" />
      </Switch>
    </Fragment>
  </Router>
);

export default Routes;
