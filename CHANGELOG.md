# CHANGELOG

### 1.3.3

- Fix to have unique promise keeper instance per store ([#19])
- Update dependencies ([#17], [#18])

### 1.3.2

- Fix to always return null for 204 status ([#16])

### 1.3.1

- Fetch adapter handles 204 no content ([#15])

### 1.3.0

- Add TypeScript support ([#9])

### 1.2.2

- Normalize method names to uppercase ([#7])

### 1.2.1

- Use simple local polyfills for browser compatibility ([#4])
- Docs and lock fixes ([#5], [#6])

### 1.2.0

- No longer setting default headers by `makeFetchAdapter` ([#3])
  Instead use `options` in [ApiConfig].

### 1.1.0

- Switch to use [transform-url] for url templating ([#1])

### 1.0.0

- Initial release.


[#1]:https://github.com/godaddy/reduxful/pull/1
[#3]:https://github.com/godaddy/reduxful/pull/3
[#4]:https://github.com/godaddy/reduxful/pull/4
[#5]:https://github.com/godaddy/reduxful/pull/5
[#6]:https://github.com/godaddy/reduxful/pull/6
[#7]:https://github.com/godaddy/reduxful/pull/7
[#9]:https://github.com/godaddy/reduxful/pull/9
[#15]:https://github.com/godaddy/reduxful/pull/15
[#16]:https://github.com/godaddy/reduxful/pull/16
[#17]:https://github.com/godaddy/reduxful/pull/17
[#18]:https://github.com/godaddy/reduxful/pull/18
[#19]:https://github.com/godaddy/reduxful/pull/19
[transform-url]:https://github.com/godaddy/transform-url#readme
[ApiConfig]:https://github.com/godaddy/reduxful/blob/master/docs/api.md#apiconfig--object
