# Pixolid

Pixolid is a Web application built to support the Solid framework.
Its purpose is to manage, upload, comment, and like images via the Solid POD storage.

This project was bootstrapped with [Solid React Application Generator](https://github.com/inrupt/generator-solid-react).

## Functionality
A user can sign into the application with his WebID.

The application supports uploading images with descriptions to the user's Solid POD.
The user can also set access rights for newly uploaded images to either be public or private.
In the private mode, it is possible to select multiple users (user's friends from the user's profile), which will be allowed to access and view the image via the application.

The application supports viewing user's images.
The user can also view images posted by his friends (gathered from the user's profile) via the application.

The application also supports showing the image detail.
The detail shows the image with its description, author, and date of posting.

The application enables users to post comments to the images, as well as like images.
The individual comments and likes are shown in the image detail.

Every image, comment, and like is stored in the Solid POD of the user who posted it.
The application gathers all the content from the PODs of individual users.

## Installing

You can install the application by executing:

```
npm install
```
or
```
yarn install
```

## Running

You can run the application by executing:

```
npm start
```
or
```
yarn start
```

The application is then available at [http://localhost:3000](http://localhost:3000) which you can view in the browser.

## Testing

You can start the testing environment by executing:

```
npm test
```
or
```
yarn test
```

## Building

You can build the application for deployment by executing:

```
npm run build
```
or
```
yarn build
```

You can find the built application in the `build` folder.