# API fetcher

This is a simple API fetcher that can be used to fetch data from the https adress API.

It can be set to use any amount of tags in the following way:

* one tag: `?tag=tag1`
* two tags: `?tag=tag1&tag=tag2`
* three tags: `?tag=tag1&tag=tag2&tag=tag3`
* ten tags: `?tag=tag1&tag=tag2&tag=tag3&tag=tag4&tag=tag5&tag=tag6&tag=tag7&tag=tag8&tag=tag9&tag=tag10`

It also store ALL the tags in cache to avoid unnecessary requests, including unknown tags for the database. The cache data is stored only in memory to avoid retrieve lame or old data.

In case of a multiple tag request, the data is fetched from the cache first, and then from the API if some tag isn't in cache.

## Run
To start the application, run the following command:

```
npm start
```
It has been split in two parts (start.js and app.js) to avoid in tests to run 2 listeners at the same time.


## Tests:
Test the API with the following commands:

```
npm test
```

It calls Jest with supertest, which is a library that allows to test HTTP requests. And for this purposes are only testing the GET requests covering the whole API routes exceptions. It is covering 100% of routes/api.js.