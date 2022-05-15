const fetch = require('cross-fetch');

// rules
const SORT_FIELDS = ['id', 'reads', 'likes', 'popularity'];
const SORT_DIRECTIONS = ['asc', 'desc'];

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

async function getData(tags, sortBy = 'id', direction = 'asc') { // many as user wants
  const tagsArray = tags.split(','); // get "n" tags from query string
  const fetchArray = [];
  tagsArray.forEach(tag => { // for each "n" tag, a new fetch for posts with that tag
    fetchArray.push(fetch(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`).then(res => res.json()));
  });
  const allPosts = Promise.all(fetchArray)
  .then(posts => {
    return uniquePostsList(posts);
  })
  return allPosts;    
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