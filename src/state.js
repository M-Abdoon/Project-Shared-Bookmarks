import { getData, setData } from "./storage.js";
const bookmark = {
    id: "1",
    url: "https://example.com",
    title: "Example site",
    description: "Just a test bookmark",
    createdAt: Date.now(),
    likes: 0
  }

  
  
export function createBookmark({ id, url, title, description }) {
	if( !title || !url || !description || !userId )
		return false;

	if( typeof userId !== "string" ||
		typeof url !== "string" || 
		typeof title !== "string" ||
		typeof description !== "string"
	)
		return false;

	let getUserBookmark = getData(userId) ?? [];
	
	const newEntryJson = { 
		id: userId,
		url: url, 
		title: title, 
		description: description,
		timestamp: Date.now(),
		likes: 0
	};

	getUserBookmark.push(newEntryJson);

	setData(userId, getUserBookmark);
}
  
  
  console.log(getBookmarksSortedByDate(1));


export function getBookmarksSortedByDate(userId) {
	return getData(userId);
}
incrementLike(id); // returns: void (nothing)
setCurrentUser(userId); // returns: void (nothing)