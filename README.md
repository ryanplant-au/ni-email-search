# NI Email Search

## What is it? 
A simple web-based interface to the Lithium user search API. Given a list of email addresses, this tool will fetch you profile information from your Lithium community, which can be displayed as a table or saved as a CSV file (using client-side file generation -- no server/Node needed).

Written using [TypeScript](https://github.com/Microsoft/TypeScript), [Pug](https://github.com/pugjs/pug), and [Sass](https://github.com/sass/sass) with the [Materialize](http://materializecss.com/) CSS framework.

## How do I use it?

Clone the repository, and run `npm install` then `gulp` from its root. Access through `dist/index.html`. The tool is completely static/client-side, so you can run it locally without issue, or host it wherever you like.

## Notes and Potential Problems

- You must authenticate before attempting to fetch information on users whose profiles are set to private.
- After a successful call, user information is stored in your browser's local storage. When making new calls, local storage is checked before the remote API, preventing you from making additional unnecessary calls. This could lead to inaccurate results if, for example, two users swapped email addresses (which hopefully would never happen, but never say never), or if your community lets users change usernames.  
A more likely issue is that you make an unauthenticated query and get back hidden profiles, making their information show up as hidden even on future authenticated queries. In this eventuality, clear your local storage.  

## Changelog
- **1.0.0**: Initial release.