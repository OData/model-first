# Model first tooling

A tool for RESTful API design. 

The tool contains 2 parts:

```
src/    The core logic module for model converting
views/  A simple UI that uses the core module
```

### Documentation
Please check out documentations and samples under doc.

### How to build

Prebuild: Install the webpack command-line tools:

```
npm install -g webpack
```

Build:
```
# Install required components from npm
npm install

# Bundle the frontend js files
webpack

# Run test
npm test

# Run server
npm start

```

### Thank You!

We’re using NDepend to analyze and increase code quality.

[![NDepend](images/ndependlogo.png)](http://www.ndepend.com)
