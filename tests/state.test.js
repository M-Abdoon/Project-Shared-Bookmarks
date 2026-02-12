import assert from "node:assert";
import test from "node:test";
import { createBookmark } from "../src/state.js";

test("createBookmark() returns false if field missing", () => {
	const result = createBookmark(
		"1",
		"",
		"Title",
		"Desc"
	);

  assert.equal(result, false);
});

test("createBookmark() accepts only string user inputs", () => {
	const result = createBookmark(
		"1",
		28675,
		"title",
		"description"
	);

  assert.equal(result, false);
});