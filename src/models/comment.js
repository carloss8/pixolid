/**
 * Model class for storing comment information.
 */
export default class Comment {
  /** An URL of the comment RDF Turtle (.ttl) file. */
  url: string;
  /** A text of the comment */
  content: string;
  /** An URL of the object the comment is replying to. */
  inReplyTo: string;
  /** A WebID of the creator of the comment. */
  creator: string;
  /** A date of the creation of the comment. */
  createdAt: Date;

  constructor(url: string, content: string, inReplyTo: string, creator: string, createdAt: Date) {
    this.url = url;
    this.content = content;
    this.inReplyTo = inReplyTo;
    this.creator = creator;
    this.createdAt = createdAt;
  }
}