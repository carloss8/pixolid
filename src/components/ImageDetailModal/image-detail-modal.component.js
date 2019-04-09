import React from "react";
import Modal from "react-responsive-modal";
import {
  ImageStyle, UserImageStyle, ImageInfoWrapper, DateStyle, DescriptionStyle,
  UserNameStyle, LikeCountStyle, LikeWrapper, LikeButtonStyle, ImageDetailWrapper,
  CommentsWrapper, CommentStyle, CommentAreaWrapper, CommentTextareaStyle,
  CommentUserImageStyle, CommentUserNameStyle, CommentTextStyle, CommentDateStyle
} from "./image-detail-modal.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "glamor";

/**
 * Image Detail Modal component.
 * @param {Props} props Given props.
 */
export const ImageDetailModal = (props: Props) => {
  const thumbIcon = props.isLikedByUser ? ["fas", "thumbs-up"] : ["far", "thumbs-up"];
  const dateOption = { year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
  const customOverlay = css({
    background: "rgba(128, 128, 128, 0.5)"
  });
  const customModal = css ({
    maxWidth: "none"
  })

  return (
    <Modal
      open={props.open}
      onClose={props.onCloseModal}
      closeOnEsc={true}
      closeOnOverlayClick={true}
      showCloseIcon={true}
      center
      classNames={{
        modal: `${customModal}`,
        overlay: `${customOverlay}`
      }}
    >
      {props.image && (
        <ImageDetailWrapper>
          <ImageStyle src={props.image.image} alt="" />
          <ImageInfoWrapper>
            <UserImageStyle src={props.creator.image} />
            <UserNameStyle>
              {props.creator.name}
            </UserNameStyle>
            <DateStyle>
              {props.image.createdAt.toLocaleString("en-GB", dateOption)}
            </DateStyle>
          </ImageInfoWrapper>
          <ImageInfoWrapper>
            <DescriptionStyle>
              {props.image.description}
            </DescriptionStyle>
            <LikeWrapper>
              <LikeCountStyle>
                {props.likeCount}
              </LikeCountStyle>
              <LikeButtonStyle onClick={props.onLike}>
                <FontAwesomeIcon icon={thumbIcon} />
              </LikeButtonStyle>
            </LikeWrapper>
          </ImageInfoWrapper>
          <CommentsWrapper>
            {props.comments &&
              props.comments.map(comment => {
                let creator = props.users.get(comment.creator);
                return (
                  <CommentStyle key={comment.url}>
                    <ImageInfoWrapper>
                      <CommentUserImageStyle src={creator.image}>
                      </CommentUserImageStyle>
                      <CommentUserNameStyle>
                        {creator.name}
                      </CommentUserNameStyle>
                      <CommentDateStyle>
                        {comment.createdAt.toLocaleString("en-GB", dateOption)}
                      </CommentDateStyle>
                    </ImageInfoWrapper>
                    <ImageInfoWrapper>
                      <CommentTextStyle>
                        {comment.content}
                      </CommentTextStyle>
                    </ImageInfoWrapper>
                  </CommentStyle>
            )})}
          </CommentsWrapper>
          <CommentAreaWrapper>
            <CommentTextareaStyle
              type="text"
              placeholder="Type a comment..."
              value={props.comment}
              onChange={props.onCommentChange}
            />
            <button
              className="ids-link-filled ids-link-filled--primary"
              onClick={props.onAddComment}
              disabled={!props.comment}
            >
              Add
            </button>
          </CommentAreaWrapper>
        </ImageDetailWrapper>
      )}
    </Modal>
  );
};

export default ImageDetailModal;