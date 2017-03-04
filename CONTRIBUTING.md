# Contributing to PubSubJS

We love pull requests. Here's a quick guide:

1. Fork the repo.

2. Run the tests. We only take pull requests with passing tests, and it's great
to know that you have a clean slate

3. Add a test for your change. Only refactoring and documentation changes
require no new tests. If you are adding functionality or fixing a bug, we need
a test!

4. Make the test pass.

5. Push to your fork and submit a pull request.


At this point you're waiting on us. We like to at least comment on, if not
accept, pull requests within three business days (and, typically, one business
day). We may suggest some changes or improvements or alternatives.

* Use JavaScript idioms
* Include tests that fail without your code, and pass with it
* Update the documentation, the surrounding one, examples elsewhere, guides,
  whatever is affected by your contribution

And in case we didn't emphasize it enough: we love tests!

## Syntax

Install [Editor Config](http://editorconfig.org) for your text editor, this will ensure that the correct formatting is applied for each file type.

## Development

There are grunt tasks for helping with linting and testing the codebase.

### Test setup

The tests are implemented using [BusterJS](http://busterjs.org) and the excellent [Sinon.JS](http://sinonjs.org/). All dependencies can be installed with `npm install` (assuming you already have nodejs installed).

### Linting

```bash
$ grunt lint
```

### Testing with PhantomJS

If you have PhantomJS installed on your system, you can run the Buster tests by running

```bash
$ grunt test
```

or by running
```bash
$ npm test
```
