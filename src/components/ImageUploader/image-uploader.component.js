import React from "react";
import ReactFileReader from "react-file-reader";
import Select from "react-select";
import { components } from "react-select";
import {
  ImageUploaderCard, ImageUploaderDetail, ImageWrapper, ImgStyle, ButtonStyle, ShareStyle,
  FriendImageStyle, FriendOptionWrapper, FriendNameStyle, FriendWebIdStyle
} from "./image-uploader.style";

/**
 * Custom style option for the react-select input,
 * showing the user's image, name, and webId.
 * @param {Props} props Given props.
 */
const Option = (props) => {
  const {data} = props;
  return (
    <components.Option {...props}>
      <FriendOptionWrapper>
        <FriendImageStyle src={data.image} alt="image" />
        <FriendNameStyle>
          {data.label}
        </FriendNameStyle>
        <FriendWebIdStyle>
          ({data.value})
        </FriendWebIdStyle>
      </FriendOptionWrapper>
    </components.Option>
  );
};

/**
 * Image Uploader component.
*/
export const ImageUploader = (props: Props) => {
  return (
    <ImageUploaderCard className="card">
      <ImageUploaderDetail>
        <h4>
          Upload Image
        </h4>
        <div className="input-wrap">
          <label>
            Image description:
          </label>
          <textarea
            rows="3"
            type="text"
            placeholder="Image description..."
            value={props.description}
            onChange={props.onDescriptionChange}
          />
        </div>
        <ImageWrapper>
          {props.image && (
            <ImgStyle src={props.image} alt="image" />
          )}
        </ImageWrapper>
        <label>
          Public:
        </label>
        <label className="switch">
          <input
            type="checkbox"
            onChange={props.onPublicChanged}
            checked={props.public}
          />
          <span className="slider round"></span>
        </label>  
        {props.public === false && (
          <ShareStyle>
            <label>
            Share with:
            </label>
            <Select
              value={props.shareValue}
              onChange={props.onSelectedShareOptions}
              options={props.shareOptions}
              isMulti
              placeholder="Select friends to share..."
              components={{ Option }}
            />
          </ShareStyle>
        )}
        <ReactFileReader
          fileTypes={[".png",".jpg",".jpeg"]}
          base64={true}
          multipleFiles={false}
          handleFiles={props.onImageSelection}
        >
          <ButtonStyle
            type="button"
            className="ids-link-filled ids-link-filled--secondary"
          >
            Select Image
          </ButtonStyle>
        </ReactFileReader>
        <ButtonStyle
          type="button"
          className="ids-link-filled ids-link-filled--primary"
          disabled={!props.image}
          onClick={props.onUploadClick}
        >
          Upload Image
        </ButtonStyle>
      </ImageUploaderDetail>
    </ImageUploaderCard>
  );
};

export default ImageUploader;