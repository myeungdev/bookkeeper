import Bookkeeper from "./index";

describe("Bookkeeper", () => {
  it("emits a `new` event with a key when adding a value to the list of `key` as the first element", () => {
    const onNew = jest.fn();
    const bookkeeper = new Bookkeeper();
    bookkeeper.on("new", onNew);

    bookkeeper.add("TEST_KEY", "TEST_VALUE");

    expect(onNew).toBeCalledWith("TEST_KEY");
  });

  it("should not emit a `new` event when adding a value to an existing list", () => {
    const onNew = jest.fn();
    const bookkeeper = new Bookkeeper();

    bookkeeper.add("TEST_KEY", "TEST_VALUE_1");

    bookkeeper.on("new", onNew);
    bookkeeper.add("TEST_KEY", "TEST_VALUE_2");

    expect(onNew).not.toBeCalled();
  });

  it("emits an `outdated` event with a key when removing the last item from the list of `key`", () => {
    const onOutdated = jest.fn();
    const bookkeeper = new Bookkeeper();

    bookkeeper.on("outdated", onOutdated);
    bookkeeper.add("TEST_KEY", "TEST_VALUE_1");
    bookkeeper.add("TEST_KEY", "TEST_VALUE_2");

    bookkeeper.remove("TEST_KEY", "TEST_VALUE_1");
    expect(onOutdated).not.toBeCalled();
    bookkeeper.remove("TEST_KEY", "TEST_VALUE_2");
    expect(onOutdated).toBeCalled();
  });

  it("returns all existing keys", () => {
    const bookkeeper = new Bookkeeper();
    bookkeeper.add("TEST_KEY_1", "VALUE");
    expect(bookkeeper.getKeys()).toEqual(["TEST_KEY_1"]);
    bookkeeper.add("TEST_KEY_2", "VALUE");
    expect(bookkeeper.getKeys()).toEqual(["TEST_KEY_1", "TEST_KEY_2"]);
    bookkeeper.remove("TEST_KEY_1", "VALUE");
    expect(bookkeeper.getKeys()).toEqual(["TEST_KEY_2"]);
  });

  it("returns values by key", () => {
    const bookkeeper = new Bookkeeper();
    bookkeeper.add("TEST_KEY_1", "VALUE_1");
    bookkeeper.add("TEST_KEY_2", "VALUE_2");
    bookkeeper.add("TEST_KEY_1", "VALUE_3");

    expect(bookkeeper.getValuesByKey("TEST_KEY_1")).toEqual([
      "VALUE_1",
      "VALUE_3",
    ]);
  });

  it("returns key by value", () => {
    const bookkeeper = new Bookkeeper();
    bookkeeper.add("TEST_KEY_1", "VALUE_1");
    bookkeeper.add("TEST_KEY_1", "VALUE_2");
    bookkeeper.add("TEST_KEY_2", "VALUE_2");

    expect(bookkeeper.getKeyByValue("VALUE_2")).toBe("TEST_KEY_1");
  });
});
