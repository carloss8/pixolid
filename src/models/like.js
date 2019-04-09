/**
 * Model class for storing like information.
 */
export default class Like {
  /** An URL of the like RDF Turtle (.ttl) file. */
  url: string;
  /** An URL of the object the like is referring to. */
  object: string;
  /** A WebID of the creator of the like. */
  creator: string;
  /** A date of the creation of the like. */
  createdAt: Date;

  constructor(url: string, object: string, creator: string, createdAt: Date) {
    this.url = url;
    this.object = object;
    this.creator = creator;
    this.createdAt = createdAt;
  }
}