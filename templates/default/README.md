#{%p}

Just another Node App

Requires Nodejs http://nodejs.org

##Installing

__From the Command Line__<br />
```npm install git+https://github.com/[username]/{%p}.git```

__package.json as a dependency__<br />
add "{%p}": "git+https://github.com/[username]/{%p}.git" to dependencies <br />
```json
{
    "name": "your-app",
    "version": "0.0.0",
    "private": true,
    "description": "just another node app",
    "dependencies": {
        "{%p}": "git+https://github.com/[username]/{%p}.git"
    }
}

```
__Raw__<br />
```git clone https://github.com/[username]/{%p}```<br />
_Be sure to run npm install from with in the __{%p}__ directory_
