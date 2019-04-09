import SolidBackend from "./solidBackend";
import { Person, Image, Comment, Like } from "@models";
import { Utils } from "@utils";
import * as $rdf from "rdflib";
import * as fs from "fs";
import "@testSetup";

const fileClient = require.requireMock("solid-file-client");
jest.mock("solid-file-client", () => {
  return {
    createFile: jest.fn(async (url, content, contentType) => { return contentType ? url + "." + contentType : url }),
    updateFile: jest.fn(async (url, content, contentType) => { return contentType ? url + "." + contentType : url }),
    createFolder: jest.fn(async (url) => { return url })
  }
});

function loadFile(file: String): String {
  const mocks = __dirname + "/../../test/__mockData__/";
  return fs.readFileSync(`${mocks}${file}`, "utf8");
}

function parse(doc: String, url: String) {
  $rdf.parse(doc, SolidBackend.store, url);
}

function removeAdd(del: $rdf.Statement[], ins: $rdf.Statement[]) {
  SolidBackend.store.removeStatements(del);
  SolidBackend.store.addAll(ins);
}

const AS = $rdf.Namespace("https://www.w3.org/ns/activitystreams#");
const XSD = $rdf.Namespace("http://www.w3.org/2001/XMLSchema#");
const RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const SIOC = $rdf.Namespace("http://rdfs.org/sioc/ns#");
const FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
const DCT = $rdf.Namespace("http://purl.org/dc/terms/");
const ACL = $rdf.Namespace("http://www.w3.org/ns/auth/acl#");
const SOLID = $rdf.Namespace("http://www.w3.org/ns/solid/terms#");
const TIME = XSD("dateTime");
const LIKE = AS("Like");
const CONTROL = ACL("Control");
const READ = ACL("Read");
const WRITE = ACL("Write");
const APPEND = ACL("Append");

describe.only("SolidBackend creating", () => {
  beforeEach(() => {

  });
  beforeAll(() => {
   
  });

  test("creates an activity record statement", () => {
    const likeUrl = "http://bob.example.org/pixolid/likes/12345.ttl";
    const imageUrl = "http://tom.example.org/pixolid/images/56789.ttl";
    const likeType = LIKE;

    const recordStatement = SolidBackend.createActivityRecordStatement(likeUrl, imageUrl, likeType);
    const likeStatement = recordStatement[0];

    expect(recordStatement.length).toBe(1);
    expect(likeStatement.subject).toEqual($rdf.sym(likeUrl));
    expect(likeStatement.predicate).toEqual(AS("type"));
    expect(likeStatement.object).toEqual($rdf.sym(likeType));
    expect(likeStatement.graph).toEqual($rdf.sym(imageUrl));
  });

  test("creates a comment statement", () => {
    const userId = "http://bob.example.org/profile/card#me";
    const commentUrl = "http://bob.example.org/pixolid/comments/12345.ttl";
    const commentContent = "What an amazing picture!";
    const published = new Date(2019, 1, 5, 15, 35, 30);
    const imageUrl = "http://tom.example.org/pixolid/images/56789.ttl";

    const commentStatement = SolidBackend.createCommentStatement(commentUrl, commentContent, imageUrl, userId, published);

    const doc = $rdf.sym(commentUrl);
    expect(commentStatement.length).toBe(5);
    expect(commentStatement[0]).toEqual($rdf.st(doc, AS("type"), AS("Note"), doc));
    expect(commentStatement[1]).toEqual($rdf.st(doc, AS("content"), $rdf.lit(commentContent), doc));
    expect(commentStatement[2]).toEqual($rdf.st(doc, AS("actor"), $rdf.sym(userId), doc));
    expect(commentStatement[3]).toEqual($rdf.st(doc, AS("inReplyTo"), $rdf.sym(imageUrl), doc));
    expect(commentStatement[4]).toEqual($rdf.st(doc, AS("published"), $rdf.lit(published.toISOString(), null, TIME), doc));
  });

  test("creates a like statement", () => {
    const userId = "http://bob.example.org/profile/card#me";
    const likeUrl = "http://bob.example.org/pixolid/likes/12345.ttl";
    const published = new Date(2019, 1, 5, 15, 35, 30);
    const imageUrl = "http://tom.example.org/pixolid/images/56789.ttl";

    const likeStatement = SolidBackend.createLikeStatement(likeUrl, imageUrl, userId, published);

    const doc = $rdf.sym(likeUrl);
    expect(likeStatement.length).toBe(4);
    expect(likeStatement[0]).toEqual($rdf.st(doc, AS("type"), AS("Like"), doc));
    expect(likeStatement[1]).toEqual($rdf.st(doc, AS("actor"), $rdf.sym(userId), doc));
    expect(likeStatement[2]).toEqual($rdf.st(doc, AS("object"), $rdf.sym(imageUrl), doc));
    expect(likeStatement[3]).toEqual($rdf.st(doc, AS("published"), $rdf.lit(published.toISOString(), null, TIME), doc));
  });


  test("creates an image statement", () => {
    const userId = "http://bob.example.org/profile/card#me";
    const imageFileUrl = "http://bob.example.org/pixolid/images/12345.ttl";
    const imageUrl = "http://bob.example.org/pixolid/images/12345.jpeg";
    const description = "Check out the stunning view.";
    const published = new Date(2019, 1, 5, 15, 35, 30);

    const imageStatement = SolidBackend.createUploadImageStatement(imageFileUrl, imageUrl, description, userId, published);

    const doc = $rdf.sym(imageFileUrl);
    expect(imageStatement.length).toBe(5);
    expect(imageStatement[0]).toEqual($rdf.st(doc, RDF("type"), SIOC("Post"), doc));
    expect(imageStatement[1]).toEqual($rdf.st(doc, FOAF("depiction"), $rdf.sym(imageUrl), doc));
    expect(imageStatement[2]).toEqual($rdf.st(doc, DCT("description"), $rdf.lit(description), doc));
    expect(imageStatement[3]).toEqual($rdf.st(doc, DCT("creator"), $rdf.sym(userId), doc));
    expect(imageStatement[4]).toEqual($rdf.st(doc, DCT("created"), $rdf.lit(published.toISOString(), null, TIME), doc));
  });

  test("creates a public file access list statement", () => {
    const userId = "http://bob.example.org/profile/card#me";
    const imageFileUrl = "http://bob.example.org/pixolid/images/12345.ttl";
    const isPublic = true;

    const aclStatement = SolidBackend.createFileAccessList(userId, imageFileUrl, [READ, APPEND], isPublic, []);

    const doc = $rdf.sym(imageFileUrl + ".acl");
    const owner = $rdf.sym(imageFileUrl + ".acl#owner");
    const publicGroup = $rdf.sym(imageFileUrl + ".acl#public");
    expect(aclStatement.length).toBe(11);
    expect(aclStatement[0]).toEqual($rdf.st(owner, RDF("type"), ACL("Authorization"), doc));
    expect(aclStatement[1]).toEqual($rdf.st(owner, ACL("accessTo"), $rdf.sym(imageFileUrl), doc));
    expect(aclStatement[2]).toEqual($rdf.st(owner, ACL("agent"), $rdf.sym(userId), doc));
    expect(aclStatement[3]).toEqual($rdf.st(owner, ACL("mode"), CONTROL, doc));
    expect(aclStatement[4]).toEqual($rdf.st(owner, ACL("mode"), READ, doc));
    expect(aclStatement[5]).toEqual($rdf.st(owner, ACL("mode"), WRITE, doc));
    expect(aclStatement[6]).toEqual($rdf.st(publicGroup, RDF("type"), ACL("Authorization"), doc));
    expect(aclStatement[7]).toEqual($rdf.st(publicGroup, ACL("accessTo"), $rdf.sym(imageFileUrl), doc));
    expect(aclStatement[8]).toEqual($rdf.st(publicGroup, ACL("agentClass"), FOAF("Agent"), doc));
    expect(aclStatement[9]).toEqual($rdf.st(publicGroup, ACL("mode"), READ, doc));
    expect(aclStatement[10]).toEqual($rdf.st(publicGroup, ACL("mode"), APPEND, doc));
  });

  test("creates a private file access list statement", () => {
    const userId = "http://bob.example.org/profile/card#me";
    const imageFileUrl = "http://bob.example.org/pixolid/images/12345.ttl";
    const isPublic = false;
    const allowedUsers = ["http://tom.example.org/profile/card#me"];

    const aclStatement = SolidBackend.createFileAccessList(userId, imageFileUrl, [READ, APPEND], isPublic, allowedUsers);

    const doc = $rdf.sym(imageFileUrl + ".acl");
    const owner = $rdf.sym(imageFileUrl + ".acl#owner");
    const userGroup = $rdf.sym(imageFileUrl + ".acl");
    expect(aclStatement.length).toBe(11);
    expect(aclStatement[0]).toEqual($rdf.st(owner, RDF("type"), ACL("Authorization"), doc));
    expect(aclStatement[1]).toEqual($rdf.st(owner, ACL("accessTo"), $rdf.sym(imageFileUrl), doc));
    expect(aclStatement[2]).toEqual($rdf.st(owner, ACL("agent"), $rdf.sym(userId), doc));
    expect(aclStatement[3]).toEqual($rdf.st(owner, ACL("mode"), CONTROL, doc));
    expect(aclStatement[4]).toEqual($rdf.st(owner, ACL("mode"), READ, doc));
    expect(aclStatement[5]).toEqual($rdf.st(owner, ACL("mode"), WRITE, doc));
    expect(aclStatement[6]).toEqual($rdf.st(userGroup, RDF("type"), ACL("Authorization"), doc));
    expect(aclStatement[7]).toEqual($rdf.st(userGroup, ACL("accessTo"), $rdf.sym(imageFileUrl), doc));
    expect(aclStatement[8]).toEqual($rdf.st(userGroup, ACL("agent"), $rdf.sym(allowedUsers[0]), doc));
    expect(aclStatement[9]).toEqual($rdf.st(userGroup, ACL("mode"), READ, doc));
    expect(aclStatement[10]).toEqual($rdf.st(userGroup, ACL("mode"), APPEND, doc));
  });

  test("creates a public folder access list statement", () => {
    const userId = "http://bob.example.org/profile/card#me";
    const folderUrl = "http://bob.example.org/pixolid/";
    const isPublic = true;

    const aclStatement = SolidBackend.createFolderAccessList(userId, folderUrl, [READ, APPEND], isPublic, []);

    const doc = $rdf.sym(folderUrl + ".acl");
    const owner = $rdf.sym(folderUrl + ".acl#owner");
    const publicGroup = $rdf.sym(folderUrl + ".acl#public");
    expect(aclStatement.length).toBe(13);
    expect(aclStatement[0]).toEqual($rdf.st(owner, RDF("type"), ACL("Authorization"), doc));
    expect(aclStatement[1]).toEqual($rdf.st(owner, ACL("accessTo"), $rdf.sym(folderUrl), doc));
    expect(aclStatement[2]).toEqual($rdf.st(owner, ACL("agent"), $rdf.sym(userId), doc));
    expect(aclStatement[3]).toEqual($rdf.st(owner, ACL("mode"), CONTROL, doc));
    expect(aclStatement[4]).toEqual($rdf.st(owner, ACL("mode"), READ, doc));
    expect(aclStatement[5]).toEqual($rdf.st(owner, ACL("mode"), WRITE, doc));
    expect(aclStatement[6]).toEqual($rdf.st(owner, ACL("defaultForNew"), $rdf.sym(folderUrl), doc));
    expect(aclStatement[7]).toEqual($rdf.st(publicGroup, RDF("type"), ACL("Authorization"), doc));
    expect(aclStatement[8]).toEqual($rdf.st(publicGroup, ACL("accessTo"), $rdf.sym(folderUrl), doc));
    expect(aclStatement[9]).toEqual($rdf.st(publicGroup, ACL("agentClass"), FOAF("Agent"), doc));
    expect(aclStatement[10]).toEqual($rdf.st(publicGroup, ACL("mode"), READ, doc));
    expect(aclStatement[11]).toEqual($rdf.st(publicGroup, ACL("mode"), APPEND, doc));
    expect(aclStatement[12]).toEqual($rdf.st(publicGroup, ACL("defaultForNew"), $rdf.sym(folderUrl), doc));
  });

  test("creates a private folder access list statement", () => {
    const userId = "http://bob.example.org/profile/card#me";
    const folderUrl = "http://bob.example.org/pixolid/images/12345.ttl";
    const isPublic = false;
    const allowedUsers = ["http://tom.example.org/profile/card#me"];

    const aclStatement = SolidBackend.createFolderAccessList(userId, folderUrl, [READ, APPEND], isPublic, allowedUsers);

    const doc = $rdf.sym(folderUrl + ".acl");
    const owner = $rdf.sym(folderUrl + ".acl#owner");
    const userGroup = $rdf.sym(folderUrl + ".acl");
    expect(aclStatement.length).toBe(13);
    expect(aclStatement[0]).toEqual($rdf.st(owner, RDF("type"), ACL("Authorization"), doc));
    expect(aclStatement[1]).toEqual($rdf.st(owner, ACL("accessTo"), $rdf.sym(folderUrl), doc));
    expect(aclStatement[2]).toEqual($rdf.st(owner, ACL("agent"), $rdf.sym(userId), doc));
    expect(aclStatement[3]).toEqual($rdf.st(owner, ACL("mode"), CONTROL, doc));
    expect(aclStatement[4]).toEqual($rdf.st(owner, ACL("mode"), READ, doc));
    expect(aclStatement[5]).toEqual($rdf.st(owner, ACL("mode"), WRITE, doc));
    expect(aclStatement[6]).toEqual($rdf.st(owner, ACL("defaultForNew"), $rdf.sym(folderUrl), doc));
    expect(aclStatement[7]).toEqual($rdf.st(userGroup, RDF("type"), ACL("Authorization"), doc));
    expect(aclStatement[8]).toEqual($rdf.st(userGroup, ACL("accessTo"), $rdf.sym(folderUrl), doc));
    expect(aclStatement[9]).toEqual($rdf.st(userGroup, ACL("agent"), $rdf.sym(allowedUsers[0]), doc));
    expect(aclStatement[10]).toEqual($rdf.st(userGroup, ACL("mode"), READ, doc));
    expect(aclStatement[11]).toEqual($rdf.st(userGroup, ACL("mode"), APPEND, doc));
    expect(aclStatement[12]).toEqual($rdf.st(userGroup, ACL("defaultForNew"), $rdf.sym(folderUrl), doc));
  });
});

describe.only("SolidBackend getting", () => {
  beforeEach(() => {
    SolidBackend.store = $rdf.graph();
  });
  beforeAll(() => {
    
  });

  test("gets an application folder", async () => {
    const profileDoc = loadFile("bobProfile.ttl");
    const profileUrl = "http://bob.example.org/profile/card";
    const userId = profileUrl + "#me";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => parse(profileDoc, profileUrl));

    const folder = await SolidBackend.getAppFolder(userId);
    expect(load.mock.calls.length).toBe(1);
    expect(folder).toEqual("http://bob.example.org/public/pixolid/");
    load.mockClear();
  });

  test("gets a no application folder exception", async () => {
    const userId = "http://tom.example.org/profile/card#me";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => {});

    expect.assertions(2);
    try {
      await SolidBackend.getAppFolder(userId);
    } catch (err) {
      expect(err).toEqual(new Error("No application folder."));
    }
    expect(load.mock.calls.length).toBe(1);
    load.mockClear();
  });

  test("checks a valid application folder", async () => {
    const appFolderDoc = loadFile("validAppFolder.ttl");
    const appFolderUrl = "http://bob.example.org/public/pixolid/";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => parse(appFolderDoc, appFolderUrl));
    const registerChanges = jest.spyOn(SolidBackend, "registerChanges");
    registerChanges.mockImplementation((doc: $rdf.NamedNode) => {});

    const valid = await SolidBackend.isValidAppFolder(appFolderUrl);
    expect(valid).toBe(true);
    expect(load.mock.calls.length).toBe(1);
    expect(registerChanges.mock.calls.length).toBe(1);
    load.mockClear();
    registerChanges.mockClear();
  });

  test("gets a valid application folder", async () => {
    const appFolderDoc = loadFile("validAppFolder.ttl");
    const appFolderUrl = "http://bob.example.org/public/pixolid/";
    const profileDoc = loadFile("bobProfile.ttl");
    const profileUrl = "http://bob.example.org/profile/card";
    const userId = profileUrl + "#me";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === profileUrl) parse(profileDoc, profileUrl);
      else if (doc.uri === appFolderUrl) parse(appFolderDoc, appFolderUrl);
      else { }
    });
    const registerChanges = jest.spyOn(SolidBackend, "registerChanges");
    registerChanges.mockImplementation((doc: $rdf.NamedNode) => {});

    const valid = await SolidBackend.getValidAppFolder(userId);
    expect(valid).toEqual(appFolderUrl);
    expect(load.mock.calls.length).toBe(2);
    expect(registerChanges.mock.calls.length).toBe(1);
    load.mockClear();
    registerChanges.mockClear();
  });

  test("gets a no valid application folder exception", async () => {
    const appFolderDoc = loadFile("invalidAppFolder.ttl");
    const appFolderUrl = "http://bob.example.org/public/pixolid/";
    const profileDoc = loadFile("bobProfile.ttl");
    const profileUrl = "http://bob.example.org/profile/card";
    const userId = profileUrl + "#me";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === profileUrl) parse(profileDoc, profileUrl);
      else if (doc.uri === appFolderUrl) parse(appFolderDoc, appFolderUrl);
      else { }
    });
    const registerChanges = jest.spyOn(SolidBackend, "registerChanges");
    registerChanges.mockImplementation((doc: $rdf.NamedNode) => {});

    expect.assertions(3);
    try {
      await SolidBackend.getValidAppFolder(userId);
    } catch(err) {
      expect(err).toEqual(new Error("No valid application folder."));
    }
    expect(load.mock.calls.length).toBe(2);
    expect(registerChanges.mock.calls.length).toBe(1);
    load.mockClear();
    registerChanges.mockClear();
  });

  test("gets a application folder fetch exception", async () => {
    const appFolderUrl = "http://bob.example.org/public/pixolid/";
    const profileDoc = loadFile("bobProfile.ttl");
    const profileUrl = "http://bob.example.org/profile/card";
    const userId = profileUrl + "#me";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === profileUrl) parse(profileDoc, profileUrl);
      else if (doc.uri === appFolderUrl) throw new Error("Could not fetch the document.");
      else { }
    });
    const registerChanges = jest.spyOn(SolidBackend, "registerChanges");
    registerChanges.mockImplementation((doc: $rdf.NamedNode) => {});

    expect.assertions(3);
    try {
      await SolidBackend.getValidAppFolder(userId);
    } catch(err) {
      expect(err).toEqual(new Error("Could not fetch the document."));
    }
    expect(load.mock.calls.length).toBe(2);
    expect(registerChanges.mock.calls.length).toBe(0);
    load.mockClear();
    registerChanges.mockClear();
  });

  test("updates the application folder", async () => {
    const newAppFolderUrl = "http://bob.example.org/new/folder/";
    const profileDoc = loadFile("bobProfile.ttl");
    const profileUrl = "http://bob.example.org/profile/card";
    const userId = profileUrl + "#me";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => parse(profileDoc, profileUrl));
    const update = jest.spyOn(SolidBackend, "update");
    update.mockImplementation((del: $rdf.Statement[], ins: $rdf.Statement[]) => removeAdd(del, ins));
    const registerChanges = jest.spyOn(SolidBackend, "registerChanges");
    registerChanges.mockImplementation((doc: $rdf.NamedNode) => {});
    
    const updated = await SolidBackend.updateAppFolder(userId, newAppFolderUrl);
    const folder = SolidBackend.store.any($rdf.sym(userId), SOLID("timeline"), null, $rdf.sym(profileUrl));
    
    expect(folder.value).toEqual(newAppFolderUrl);
    expect(updated).toBe(true);
    expect(load.mock.calls.length).toBe(2);
    expect(update.mock.calls.length).toBe(1);
    expect(registerChanges.mock.calls.length).toBe(1);
    load.mockClear();
    update.mockClear();
    registerChanges.mockClear();
  });

  test("does not update the application folder", async () => {
    const oldAppFolderUrl = "http://bob.example.org/public/pixolid/"
    const newAppFolderUrl = "http://bob.example.org/new/folder/";
    const profileDoc = loadFile("bobProfile.ttl");
    const profileUrl = "http://bob.example.org/profile/card";
    const userId = profileUrl + "#me";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => parse(profileDoc, profileUrl));
    const update = jest.spyOn(SolidBackend, "update");
    update.mockImplementation((del: $rdf.Statement[], ins: $rdf.Statement[]) => {
      throw new Error("Could not fetch the document.") 
    });
    const registerChanges = jest.spyOn(SolidBackend, "registerChanges");
    registerChanges.mockImplementation((doc: $rdf.NamedNode) => {});
    
    const updated = await SolidBackend.updateAppFolder(userId, newAppFolderUrl);
    const folder = SolidBackend.store.any($rdf.sym(userId), SOLID("timeline"), null, $rdf.sym(profileUrl));
    
    expect(folder.value).toEqual(oldAppFolderUrl);
    expect(updated).toBe(false);
    expect(load.mock.calls.length).toBe(2);
    expect(update.mock.calls.length).toBe(1);
    expect(registerChanges.mock.calls.length).toBe(0);
    load.mockClear();
    update.mockClear();
    registerChanges.mockClear();
  });

  test("gets friends", async () => {
    const bobProfileDoc = loadFile("bobProfile.ttl");
    const bobProfileUrl = "http://bob.example.org/profile/card";
    const bobUserId = bobProfileUrl + "#me";
    const tomProfileDoc = loadFile("tomProfile.ttl");
    const tomProfileUrl = "http://tom.example.org/profile/card";
    const tomUserId = tomProfileUrl + "#me";
    const aliceProfileDoc = loadFile("aliceProfile.ttl");
    const aliceProfileUrl = "http://alice.example.org/profile/card";
    const aliceUserId = aliceProfileUrl + "#me";
    const expectedFriends = [
      new Person(tomUserId, "Tom", "http://tom.example.org/profile/tom-profile.jpg"),
      new Person(aliceUserId, "Alice", "http://alice.example.org/profile/alice-profile.jpg"),
    ];

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === bobProfileUrl) parse(bobProfileDoc, bobProfileUrl);
      else if (doc.uri === tomProfileUrl) parse(tomProfileDoc, tomProfileUrl);
      else if (doc.uri === aliceProfileUrl) parse(aliceProfileDoc, aliceProfileUrl);
      else { }
    });

    const friends = await SolidBackend.getFriends(bobUserId);

    expect(friends).toBeTruthy();
    expect(friends.length).toBe(2);
    expect(friends).toEqual(expectedFriends);
    expect(load.mock.calls.length).toBe(3);
    load.mockClear();
  });

  test("gets available friends", async () => {
    const bobProfileDoc = loadFile("bobProfile.ttl");
    const bobProfileUrl = "http://bob.example.org/profile/card";
    const bobUserId = bobProfileUrl + "#me";
    const tomProfileDoc = loadFile("tomProfile.ttl");
    const tomProfileUrl = "http://tom.example.org/profile/card";
    const tomUserId = tomProfileUrl + "#me";
    const aliceProfileUrl = "http://alice.example.org/profile/card";
    const expectedFriends = [
      new Person(tomUserId, "Tom", "http://tom.example.org/profile/tom-profile.jpg"),
    ];

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === bobProfileUrl) parse(bobProfileDoc, bobProfileUrl);
      else if (doc.uri === tomProfileUrl) parse(tomProfileDoc, tomProfileUrl);
      else if (doc.uri === aliceProfileUrl) throw new Error();
      else { }
    });

    const friends = await SolidBackend.getFriends(bobUserId);

    expect(friends).toBeTruthy();
    expect(friends.length).toBe(1);
    expect(friends).toEqual(expectedFriends);
    expect(load.mock.calls.length).toBe(3);
    load.mockClear();
  });

  test("gets images", async () => {
    const bobProfileDoc = loadFile("bobProfile.ttl");
    const bobProfileUrl = "http://bob.example.org/profile/card";
    const bobUserId = bobProfileUrl + "#me";
    const tomProfileDoc = loadFile("tomProfile.ttl");
    const tomProfileUrl = "http://tom.example.org/profile/card";
    const tomUserId = tomProfileUrl + "#me";
    const aliceProfileDoc = loadFile("aliceProfile.ttl");
    const aliceProfileUrl = "http://alice.example.org/profile/card";
    const aliceUserId = aliceProfileUrl + "#me";

    const tomImageDoc = loadFile("tomImage.ttl");
    const tomImageUrl = "http://tom.example.org/public/pixolid/images/12345.jpeg";
    const tomImageFileUrl = "http://tom.example.org/public/pixolid/images/12345.ttl";
    const aliceImageDoc = loadFile("aliceImage.ttl");
    const aliceImageUrl = "http://alice.example.org/public/pixolid/images/12345.jpeg";
    const aliceImageFileUrl = "http://alice.example.org/public/pixolid/images/12345.ttl";
    
    const imagesFolderDoc = loadFile("imagesFolder.ttl");

    const expectedImages = [
      new Image(tomImageFileUrl, tomImageUrl, "Tom's new car.", tomUserId, new Date("2019-03-23T15:55:55.346Z")),
      new Image(aliceImageFileUrl, aliceImageUrl, "Alice's new house.", aliceUserId, new Date("2019-01-23T15:55:55.346Z")),
    ];

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === bobProfileUrl) parse(bobProfileDoc, bobProfileUrl);
      else if (doc.uri === tomProfileUrl) parse(tomProfileDoc, tomProfileUrl);
      else if (doc.uri === aliceProfileUrl) parse(aliceProfileDoc, aliceProfileUrl);
      else if (doc.uri === tomImageFileUrl) parse(tomImageDoc, tomImageFileUrl);
      else if (doc.uri === aliceImageFileUrl) parse(aliceImageDoc, aliceImageFileUrl);
      else if (doc.uri.endsWith("/images/")) parse(imagesFolderDoc, doc.uri);
      else { }
    });
    const registerChanges = jest.spyOn(SolidBackend, "registerChanges");
    registerChanges.mockImplementation((doc: $rdf.NamedNode) => {});
    const getValidAppFolder = jest.spyOn(SolidBackend, "getValidAppFolder");
    getValidAppFolder.mockImplementation((webId: String) => Utils.getBaseUrl(webId)+"public/pixolid/");

    const images = await SolidBackend.getFriendsImages(bobUserId);

    expect(images).toBeTruthy();
    expect(images.length).toBe(2);
    expect(images).toEqual(expectedImages);
    expect(load.mock.calls.length).toBe(5);
    expect(registerChanges.mock.calls.length).toBe(2);
    expect(getValidAppFolder.mock.calls.length).toBe(2);
    load.mockClear();
    registerChanges.mockClear();
    getValidAppFolder.mockClear();
  });

  test("gets comments", async () => {
    const bobProfileUrl = "http://bob.example.org/profile/card";
    const bobUserId = bobProfileUrl + "#me";
    const tomImageDoc = loadFile("tomImage.ttl");
    const tomImageFileUrl = "http://tom.example.org/public/pixolid/images/12345.ttl";
    const bobCommentDoc = loadFile("bobComment.ttl");
    const bobCommentUrl = "http://bob.example.org/public/pixolid/comments/56789.ttl";

    const expectedComments = [
      new Comment(bobCommentUrl, "Nice car dude!", tomImageFileUrl, bobUserId, new Date("2019-03-26T12:20:00.010Z"))
    ];

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === tomImageFileUrl) parse(tomImageDoc, tomImageFileUrl);
      else if (doc.uri === bobCommentUrl) parse(bobCommentDoc, bobCommentUrl);
      else { }
    });
    const registerChanges = jest.spyOn(SolidBackend, "registerChanges");
    registerChanges.mockImplementation((doc: $rdf.NamedNode) => {});

    const comments = await SolidBackend.getComments(tomImageFileUrl);

    expect(comments).toBeTruthy();
    expect(comments.length).toBe(1);
    expect(comments).toEqual(expectedComments);
    expect(load.mock.calls.length).toBe(2);
    expect(registerChanges.mock.calls.length).toBe(1);
    load.mockClear();
    registerChanges.mockClear();
  });

  test("gets likes", async () => {
    const aliceProfileUrl = "http://alice.example.org/profile/card";
    const aliceUserId = aliceProfileUrl + "#me";
    const tomImageDoc = loadFile("tomImage.ttl");
    const tomImageFileUrl = "http://tom.example.org/public/pixolid/images/12345.ttl";
    const aliceLikeDoc = loadFile("aliceLike.ttl");
    const aliceLikeUrl = "http://alice.example.org/public/pixolid/likes/56789.ttl";

    const expectedLikes = [
      new Like(aliceLikeUrl, tomImageFileUrl, aliceUserId, new Date("2019-03-26T12:20:00.010Z"))
    ];

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === tomImageFileUrl) parse(tomImageDoc, tomImageFileUrl);
      else if (doc.uri === aliceLikeUrl) parse(aliceLikeDoc, aliceLikeUrl);
      else { }
    });
    const registerChanges = jest.spyOn(SolidBackend, "registerChanges");
    registerChanges.mockImplementation((doc: $rdf.NamedNode) => {});

    const likes = await SolidBackend.getLikes(tomImageFileUrl);

    expect(likes).toBeTruthy();
    expect(likes.length).toBe(1);
    expect(likes).toEqual(expectedLikes);
    expect(load.mock.calls.length).toBe(2);
    expect(registerChanges.mock.calls.length).toBe(1);
    load.mockClear();
    registerChanges.mockClear();
  });
});

describe.only("SolidBackend uploading", () => {
  let dateNow;
  let mathRandom;
  beforeEach(() => {
    SolidBackend.store = $rdf.graph();
    
  });
  beforeAll(() => {
    dateNow = jest.spyOn(Date, "now").mockImplementation(() => new Date(Date.UTC(2019, 0, 1, 20, 30, 30)).valueOf());
    mathRandom = jest.spyOn(Math, "random").mockImplementation(() => 0.5);
  });
  afterAll(() => {
    dateNow.mockRestore();
    mathRandom.mockRestore();
  });

  test("uploads an image", async () => {
    const imageFile = new File([""], "image.jpeg", {type: "jpeg", lastModified: new Date(Date.now())});
    const description = "Pretty sunset.";
    const userId = "http://bob.example.org/profile/card#me";
    const appFolder = "http://bob.example.org/public/pixolid/";
    const imageName = appFolder + "images/" + Utils.getName();
    const imageFileUrl = imageName + ".ttl";
    const imageUrl = imageName + ".jpeg";
    const isPublic = true;

    const expectedImage = new Image (imageFileUrl, imageUrl, "Pretty sunset.", userId, new Date(Date.now()));

    const image = await SolidBackend.uploadImage(imageFile, description, userId, appFolder, isPublic, []);

    expect(image).toEqual(expectedImage);
    expect(fileClient.createFile.mock.calls.length).toBe(4);
    fileClient.createFile.mockClear();
  });

  test("uploads a comment", async () => {
    const bobUserId = "http://bob.example.org/profile/card#me";
    const bobAppFolder = "http://bob.example.org/public/pixolid/";
    const commentFileUrl = bobAppFolder + "comments/" + Utils.getName() + ".ttl";
    const content = "Stunning!";
    const tomImageDoc = loadFile("tomImage.ttl");
    const tomImageFileUrl = "http://tom.example.org/public/pixolid/images/1234.ttl";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === tomImageFileUrl) parse(tomImageDoc, tomImageFileUrl);
      else { }
    });
    const update = jest.spyOn(SolidBackend, "update");
    update.mockImplementation((del: $rdf.Statement[], ins: $rdf.Statement[]) => removeAdd(del, ins));

    const expectedImage = new Comment(commentFileUrl, content, tomImageFileUrl, bobUserId, new Date(Date.now()));

    const comment = await SolidBackend.uploadComment(bobUserId, bobAppFolder, tomImageFileUrl, content);

    expect(comment).toEqual(expectedImage);
    expect(load.mock.calls.length).toBe(1);
    expect(fileClient.createFile.mock.calls.length).toBe(1);
    expect(update.mock.calls.length).toBe(1);
    load.mockClear();
    fileClient.createFile.mockClear();
    update.mockClear();
  });

  test("uploads a like", async () => {
    const bobUserId = "http://bob.example.org/profile/card#me";
    const bobAppFolder = "http://bob.example.org/public/pixolid/";
    const likeFileUrl = bobAppFolder + "likes/" + Utils.getName() + ".ttl";
    const tomImageDoc = loadFile("tomImage.ttl");
    const tomImageFileUrl = "http://tom.example.org/public/pixolid/images/1234.ttl";

    const load = jest.spyOn(SolidBackend, "load");
    load.mockImplementation((doc: $rdf.NamedNode) => { 
      if (doc.uri === tomImageFileUrl) parse(tomImageDoc, tomImageFileUrl);
      else { }
    });
    const update = jest.spyOn(SolidBackend, "update");
    update.mockImplementation((del: $rdf.Statement[], ins: $rdf.Statement[]) => removeAdd(del, ins));

    const expectedLike = new Like(likeFileUrl, tomImageFileUrl, bobUserId, new Date(Date.now()));

    const like = await SolidBackend.uploadLike(bobUserId, bobAppFolder, tomImageFileUrl);

    expect(like).toEqual(expectedLike);
    expect(load.mock.calls.length).toBe(1);
    expect(fileClient.createFile.mock.calls.length).toBe(1);
    expect(update.mock.calls.length).toBe(1);
    load.mockClear();
    fileClient.createFile.mockClear();
    update.mockClear();
  });

  test("creates app folders", async () => {
    const bobUserId = "http://bob.example.org/profile/card#me";
    const bobAppFolder = "http://bob.example.org/public/pixolid/";

    const updateAppFolder = jest.spyOn(SolidBackend, "updateAppFolder");
    updateAppFolder.mockImplementation(async (userId, folderUrl) => { return true });

    const created = await SolidBackend.createAppFolders(bobUserId, bobAppFolder);

    expect(created).toEqual(true);
    expect(fileClient.createFolder.mock.calls.length).toBe(4);
    expect(fileClient.updateFile.mock.calls.length).toBe(1);
    expect(updateAppFolder.mock.calls.length).toBe(1);
    fileClient.createFile.mockClear();
    fileClient.updateFile.mockClear();
    updateAppFolder.mockReset();
  });
});