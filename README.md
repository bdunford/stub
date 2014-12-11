#stub

For stubbing out your new node projects. Stub is a command line utility that allows you to quickly create a new node package from a predefined template.

Requires Nodejs http://nodejs.org

##Installing

__From the Command Line__<br />
stub is intended to be installed globally so that it can be used from anywhere.
``` npm install -g git+https://github.com/bdunford/stub.git ```

##Usage

once installed stub is used from the terminal to stub out new node projects.

```
$ stub MyNewProject
>>> MyNewProject <<< was successfully created
$ ls
.  ..  MyNewProject
$ cd MyNewProject
$ ls
.  ..  package.json  README.md  lib  spec
$ cd lib
$ ls
.  ..  MyNewProject.js
$ cd ..
$ cat package.json
{
    "name": "MyNewProject",
    "main": "./lib/MyNewProject.js",
    "version": "0.0.0",
    "private": true,
    "description": "just another node app",
    "repository": "https://github.com/[username]/MyNewProject",
    "license": "MIT",
    "dependencies": {

        },
        "scripts" : {
            "test" : "jasmine-node spec"
        }
    }


    $ echo "You Get the Picture"
    You Get the Picture
```  

Template name can be past if multiple templates exist in you profile

```
$ stub MyNewProject ExpressWebTemplate
>>> MyNewProject <<< was successfully created
```

for the above statement to work the following path would need to exist in the current user profile containing a template.json instructing __stub__ what to do.    ```~/.stub/templates/ExpressWebTemplate/template.json```

if no template name is passed sub will look in the user profile for a template.json

```~/.stub/templates/default/template.json ```

If a default template is not found in the profile, the default template included with __stub__ will be used.

##Adding your Own Templates

To add your own template add a stub directory in your user profile.  

```$ mkdir ~/.stub
$ mkdir ~/.stub/templates ```

templates will be added to the templates directory that you just created.  

```$ mkdir ~/.stub/template/MyNewTemplate ```

your template directory must include a template.json file. This file will instruct __stub__ what files make up your template and where they will reside with in your new project.

```$ touch ~/.stub/template/MyNewTemplate/template.json ```

Here are the contents of the default template.json

```javascript
{
    "lib-spec.js" : "./spec/{%p}-spec.js",
    "README.md" : "./README.md",
    "package.json" : "./package.json",
    "lib.js" : "./lib/{%p}.js"
}

```
The properties in this json object represent the template files located in the root of the current directory. the values represent the destinations relative to the newly created node project.

__{%p}__ will be replaced with the project name. This is also true with in the template files.

Here are the contents of the default package.json template file.  

``` javascript
{
    "name": "{%p}",
    "main": "./lib/{%p}",
    "version": "0.0.0",
    "private": true,
    "description": "just another node app",
    "repository": "https://github.com/[username]/{%p}",
    "license": "MIT",
    "dependencies": {
    },
    "scripts" : {
        "test" : "jasmine-node spec"
    }
}

```

For more inspiration the default template can be found here
https://github.com/bdunford/stub/tree/master/templates/default
