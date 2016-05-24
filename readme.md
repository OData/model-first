# Model first tooling

A tool for RESTful API design. 

The tool contains 2 parts:

```
src/  the core logic module for model converting
app/  a simple UI that uses the core module
```

### Documentation
Please check out documentations and samples under doc.

### How to build

Prebuild: Install the grunt/bower command-line tools:
```
npm install -g grunt-cli
npm install -g bower
```

Build:
```
# Install required components from npm and bower
npm install
bower install

# Install components for UI
cd app
bower install

# Run test
grunt

# Build dist/
grunt build

# Run test server
grunt execute

```
