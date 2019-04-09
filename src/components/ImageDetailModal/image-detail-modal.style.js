import styled from "styled-components";

export const LabelStyle = styled.label`
  display: block;
`;

export const DateStyle = styled.label`
  display: block;
  margin-left: auto;
  margin-right: 0;
`;

export const ImageStyle = styled.img`
  max-width: 50vw;
  max-height: 50vh;
  width: auto;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
  margin-bottom: 10px;
  display: block;
`;

export const ImageInfoWrapper = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  flex-direction: row !important;
  max-width: 50vw;
`;

export const UserNameStyle = styled.label`
  display: block;
  margin-left: 5px;
`;

export const DescriptionStyle = styled.label`
  display: block;
  max-height: 3em;
  overflow-y: auto;
  margin-top: 10px;
`;

export const UserImageStyle = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
`;

export const LikeCountStyle = styled.label`
  display: block;
  margin-right: 5px;
`;

export const LikeButtonStyle = styled.div`
  display: block;
  cursor: pointer;

  &:hover {
    filter:brightness(1.7);
  }
`;

export const LikeWrapper = styled.div`;
  margin-left: auto;
  margin-right: 0;
  display: flex;
  justify-content: right;
  align-items: center;
  flex-direction: row !important;
`;

export const ImageDetailWrapper = styled.div`
  max-width: 90vw;
  max-height: 90vh;
`;

export const CommentsWrapper = styled.div`
  max-width: 50vw;
  max-height: 20vh;
  width: auto;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  overflow-y: auto;
  opacity:0.8;
`;

export const CommentStyle = styled.div`
  margin-top: 10px;
  height: auto;
  max-height: 10em;
  background: #eee;
`;

export const CommentAreaWrapper = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row !important;

  button {
    margin-left: 5px;
    width: 15%;
    height: 3em;
    margin-bottom: 0;
  }
`;

export const CommentTextareaStyle = styled.textarea`
  resize: none;
  width: 85%;
  height: 2em;
`;

export const CommentUserNameStyle = styled.label`
  display: block;
  margin-left: 5px;
`;

export const CommentTextStyle = styled.label`
  margin-left: 10px;
  display: block;
  margin-top: 10px;
`;

export const CommentUserImageStyle = styled.img`
  margin-left: 10px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
`;

export const CommentDateStyle = styled.label`
  display: block;
  margin-left: auto;
  margin-right: 10px;
`;