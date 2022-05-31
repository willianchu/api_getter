const fetch = require('cross-fetch');

// rules
const SORT_FIELDS = ['id', 'reads', 'likes', 'popularity'];
const SORT_DIRECTIONS = ['asc', 'desc'];
// cache
const cacheTagsHistory = []; // cache for tags already searched
const cachePosts = []; // cache for posts already

function uniquePostsList(ArrayOfPosts) {
  const uniquePosts = [];
  const uniqueIds = [];
  ArrayOfPosts.forEach(posts => {
    posts.posts.forEach(post => {
      if (!uniqueIds.includes(post.id)) {
        uniquePosts.push(post);
        uniqueIds.push(post.id);
      }
    });
  });
  return uniquePosts; 
};

async function getData(tags, sortBy = 'id', direction = 'asc') { // search for many tags as user wants
  const tagsArray = tags.split(','); 
  const fetchFunctionsArray = []; // array of functions to fetch data from external API
  /*
  Cache Solution
  */
  const tagsForFetch = []; // Look only for tags that are not in cache
  const localPosts = []; // posts from cache for this tags run
  tagsArray.forEach(tag => {
    if (!cacheTagsHistory.includes(tag)) {
      tagsForFetch.push(tag);   
    } else {
      cachePosts.forEach(post => {
        if (post.tags.includes(tag)) {
          localPosts.push(post);
        }
      })  
    }
  });
  /*
  External Fetch
  */
  if (tagsForFetch.length > 0) {
    tagsForFetch.forEach(tag => { // for each "n" tag, a new fetch for posts with that tag
      fetchFunctionsArray.push(fetch(`https://api.secret/posts?tag=${tag}`).then(res => res.json()));
    });
    const allPosts = Promise.all(fetchFunctionsArray)
    .then(posts => {
      posts.push({"posts":localPosts}); // add local posts to the end of the array
      const uniquePosts = uniquePostsList(posts); // remove duplicates
      cacheTagsHistory = cacheTagsHistory.concat(tagsArray); // add tags to cache
      cachePosts = cachePosts.concat(uniquePosts); // add posts to cache
      return uniquePosts;
    })
    return allPosts;
  } else { 
    const postFormat = [{ "posts": localPosts }];
    return uniquePostsList(postFormat);
  }
};

function sortPosts(posts, sortBy = "id", direction = "asc") {
  if (!sortBy || !SORT_FIELDS.includes(sortBy)) {
    return posts;
  }
  if (direction === 'asc' || !SORT_DIRECTIONS.includes(direction)) {
    return posts.sort((a, b) => a[sortBy] - b[sortBy]);
  }
  return posts.sort((a, b) => b[sortBy] - a[sortBy]);
}

async function getPosts(tags, sortBy = 'id', direction = 'asc') {
  const posts = await getData(tags, sortBy, direction);
  return sortPosts(posts, sortBy, direction);
};

module.exports = { SORT_DIRECTIONS, SORT_FIELDS, getPosts };