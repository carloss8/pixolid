/**
 * Model class for storing image information.
 */
export default class Image {
  /** An URL of the image RDF Turtle (.ttl) file. */
  url: string;
  /** An URL of the image (.jpeg/.png) file. */
  image: string;
  /** A text of the image's description */
  description: string;
  /** A WebID of the creator of the image. */
  creator: string;
  /** A date of the creation of the image. */
  createdAt: Date;

  constructor(url: string, image: string, description: string, creator: string, createdAt: Date) {
    this.url = url;
    this.image = image;
    this.description = description;
    this.creator = creator;
    this.createdAt = createdAt;
  }
}