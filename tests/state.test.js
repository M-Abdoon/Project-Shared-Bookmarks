import assert from "node:assert";
import test from "node:test";
import { createBookmark } from "../src/state.js";

test("createBookmark() returns false if field missing", () => {
	const result = createBookmark({
		id: "1",
		url: "",
		title: "Title",
		description: "Desc"
	});

  assert.equal(result, false);
});

test("createBookmark() accepts only string user inputs", () => {
	const result = createBookmark({
		id: "1",
		url: 4321,
		title: "title",
		description: "desc"
	});

  assert.equal(result, false);
});