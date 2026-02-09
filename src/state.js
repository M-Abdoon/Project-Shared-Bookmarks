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
	if( !title || !url || !description || !id )
		return false;

	if( typeof id !== "string" ||
		typeof url !== "string" || 
		typeof title !== "string" ||
		typeof description !== "string"
	)
		return false;

	let getUserBookmark = getData(id) ?? [];
	
	const newEntryJson = { 
		id: id,
		url: url, 
		title: title, 
		description: description,
		timestamp: Date.now(),
		likes: 0
	};

	getUserBookmark.push(newEntryJson);

	setData(id, getUserBookmark);
	return newEntryJson;
}
  
  
  console.log(createBookmark(bookmark));
  console.log(getBookmarksSortedByDate(1));


export function getBookmarksSortedByDate(userId) {
	return getData(userId);
}
export function incrementLike(id){} // returns: void (nothing)
export function setCurrentUser(userId){} // returns: void (nothing)