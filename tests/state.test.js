import { createBookmark } from "../src/state.js";

test("createBookmark returns false if field missing", () => {
  const result = createBookmark({
    id: "user2",
    url: "",
    title: "Title",
    description: "Desc"
  });

  assert.equal(result, false);
});