Rubric list:

1- The website must contain a drop-down which lists five users
We tested this by opening the website in the browser.
The dropdown shows five users: User 1, User 2, User 3, User 4, and User 5.
These are generated from the `getUserIds()` function in `storage.js`.

2- Selecting a user must display the list of bookmarks for the relevant user
We selected different users from the dropdown.
The code displays only the relevant user's bookmarks.
Data is retrieved using `getBookmarksSortedByDate(userId)`.

3- If there are no bookmarks for the selected user, a message is displayed
We cleared localStorage and selected a user with no saved bookmarks.
The message “There are no bookmarks for this user.” was displayed correctly.

4- The list of bookmarks must be shown in reverse chronological order
We created multiple bookmarks for the same user.
The newest bookmark appeared at the top of the list.
This is handled in `state.js` using:
`data.sort((a, b) => b.createdAt - a.createdAt);`
This ensures the newest items appear first.

5- Each bookmark has a title, description and created at timestamp displayed
We added a new bookmark and verified that the title, description, and timestamp are visible.
The timestamp is formatted using `toLocaleString()`.
All information appears correctly in the UI.

6- Each bookmark’s title is a link to the bookmark’s URL
We clicked on bookmark titles.
Each title opens the correct URL.

7- Each bookmark's "Copy to clipboard" button must copy the URL
We clicked the “Copy URL” button and pasted the result into a text editor.
The correct URL was copied successfully.
The feature uses `navigator.clipboard.writeText(bookmark.url);`.

8- Each bookmark's like counter works independently and persists across sessions
We tested this by clicking “Like” on different bookmarks and then refreshing the page.
Each bookmark keeps its own like count.
The likes persist because the data is saved in localStorage using `setData()`.

9- The website must contain a form with inputs for URL, title, and description
We verified that the form contains a URL input (`type="url"`), a title input, a description textarea, and a submit button.

10- Submitting the form adds a new bookmark for the relevant user only
We selected User 1 and added a bookmark.
After switching to User 2, the bookmark did not appear.
This confirms that bookmarks are stored separately for each user.

11- After creating a new bookmark, the updated list is shown
After submitting the form, the form resets and the bookmark list updates immediately.
The new bookmark appears at the top of the list.
This behaviour is handled in `main.js` after calling `createBookmark()`.

12- The website must score 100 for accessibility in Lighthouse
We ran Lighthouse in Chrome DevTools.
The website scored 100 in Accessibility.
The project uses semantic HTML, proper form labels, `aria-live="polite"` for notifications, and an accessible structure.

13- Unit tests must be written for at least one non-trivial function
Unit tests in `test.state.js`.
We wrote unit tests for the `createBookmark()` function.
The tests verify that it returns false if required fields are missing and that it only accepts string inputs.
The tests were executed using the Node test runner and passed successfully.
