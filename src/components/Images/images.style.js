import styled from "styled-components";

export const ImagesWrapper = styled.section`
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

export const ImagesCard = styled.div`
  background-color: #fff;
  margin: 30px auto;

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

export const ImageWrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-bottom: 1em;
`

export const ImageContainer =  styled.div`
  background-image: ${({image}) => image ? `url(${image})`: '#cccccc'};
  background-size: cover;
  border-radius: 50%;
  width: 8em;
  height: 8em;
  
  &:hover {
    filter:brightness(1.3);
    transition:.1s;
  }

  `;

export const ImagesDetail = styled.div`
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

export const GridItem = styled.div`
  cursor: pointer;
`;

export const CreatorLabel = styled.p`
  opacity:0.7;
  text-align: center;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  word-break: break-all;
  :hover{
    overflow: visible; 
    white-space: normal;
    height:auto;  /* just added this line */
  }
`;

export const NoImagesLabelStyle = styled.label`
  text-align: center;
`;