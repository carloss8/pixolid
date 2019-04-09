import styled from 'styled-components';

export const ImageUploaderWrapper = styled.section`
  width: 100%;
  height: 100%;
  background-image: url('/img/concentric-hex-pattern_2x.png');
  background-repeat: repeat;
  padding: 10px 0;

  h3 {
    color: #666666;
    span {
      font-weight: bold;
    }
    a {
      font-size: 1.9rem;
    }
  }
`;

export const ImageUploaderCard = styled.div`
  background-color: #fff;
  margin: 10px auto;

  //Overriding the style guide card flexbox settings
  max-width: 80% !important;
  flex-direction: row !important;
  padding: 10px 0 !important; //temporary fix to a style guide bug

  align-items: center;

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ImageUploaderDetail = styled.div`
  padding: 1rem 3.5rem;
  width: 100%;

  p,
  li {
    color: #666666;
  }
  ul {
    list-style: disc;
    margin: 0 18px;
  }
`;

export const ImageWrapper = styled.div`
  text-align: center;
`;

export const ImgStyle = styled.img`
  border-radius: 50%;
  width: 128px;
  height: 128px;
`;

export const ButtonStyle = styled.button`
  margin-top: 10px;
`;

export const ShareStyle = styled.div`
  margin-bottom: 10px;
`;

export const FriendOptionWrapper = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  flex-direction: row !important;
`;

export const FriendNameStyle = styled.div`
  margin-left: 5px;
`;

export const FriendWebIdStyle = styled.div`
  opacity: 0.5;
  margin-left: 5px;
`;

export const FriendImageStyle = styled.img`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin: 5px;
`;

