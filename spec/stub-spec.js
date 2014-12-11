var stub = require("../lib/stub");
var path = require("path");


function prepData(v) {
    return "---" + v + "---\n---" + v + "---" + v + "---"
}


describe("stub", function() {

    var prj = path.join(process.cwd(),"super");
    var mtr = path.join(path.dirname(process.mainModule.filename),"../templates");
    var ptr = path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,".stub/templates");
    var td = prepData("{%p}");


    var rdme = {
        l: "README.md",
        d: td
    }

    var lib = {
        l: "lib.js",
        d: td
    }

    var test = {
        l: "lib-spec.js",
        d: td
    }

    var tpls = {
        l: "template.json",
        d: '{"README.md" : "./README.md", "lib.js" : "./lib/{%p}.js", "lib-spec.js" : "./spec/{%p}-spec.js"}'
    }

    var mockFs = function() {

        this.paths = [
            {loc: "path or file", data: "contents of file"}
        ];

        this.mkdirSync = function(p){
            var parts = p.split(path.sep);
            parts.pop();

            if (this.existsSync(parts.join(path.sep))) {
                this.paths.push({
                    loc: p,
                    data: null
                })
            }
        };

        this.existsSync = function(s){
            var found = false;
            this.paths.forEach(function(p){
                if (p.loc.indexOf(s) > -1 ) {
                    found = p;
                    return false;
                }
            });

            return found;
        };

        this.writeFileSync = function(p,d) {
            if (this.existsSync(path.dirname(p))) {
                this.paths.push({
                    loc: p,
                    data: d
                })
            } else {
                throw "directory does not exist '" + path.dirname(p) + "'"
            }
        };

        this.readFileSync = function(p) {
            var f = this.existsSync(p);
            if (f) {
                return f.data;
            } else {
                throw "file does not exist'" + p + "'"
            }
        };


    };

    var fs;
    var stubber;

    beforeEach(function() {
        stubber = new stub();
        fs = new mockFs();
        stubber.fs = fs;
    });

    it("should be defined", function() {
        expect(stub).toBeDefined();
    });

    it("new given a project should stub a new project with defaults", function() {
        var t = "default";
        stubber.fs.paths = [
            {loc: path.join(mtr,t,rdme.l), data: rdme.d},
            {loc: path.join(mtr,t,lib.l), data: lib.d},
            {loc: path.join(mtr,t,test.l), data: test.d},
            {loc: path.join(mtr,t,tpls.l), data: tpls.d}
        ];
        stubber.new("super");
        expect(stubber.fs.existsSync(path.join(prj,'lib/super.js')).data).toEqual(prepData("super"));
        expect(stubber.fs.existsSync(path.join(prj,'spec/super-spec.js')).data).toEqual(prepData("super"));
        expect(stubber.fs.existsSync(path.join(prj,'README.md')).data).toEqual(prepData("super"));
        expect(stubber.fs.existsSync(path.join(prj,'lib/super.js')).data).toEqual(prepData("super"));
    });

    it("new given a project and template should stub a new project with the template specified", function() {
        var t = "website";
        stubber.fs.paths = [
        {loc: path.join(mtr,t,rdme.l), data: rdme.d},
        {loc: path.join(mtr,t,lib.l), data: lib.d},
        {loc: path.join(mtr,t,test.l), data: test.d},
        {loc: path.join(mtr,t,tpls.l), data: tpls.d}
        ];
        stubber.new("super", t);
        expect(stubber.fs.existsSync(path.join(prj,'lib/super.js')).data).toEqual(prepData("super"));
        expect(stubber.fs.existsSync(path.join(prj,'spec/super-spec.js')).data).toEqual(prepData("super"));
        expect(stubber.fs.existsSync(path.join(prj,'README.md')).data).toEqual(prepData("super"));
        expect(stubber.fs.existsSync(path.join(prj,'lib/super.js')).data).toEqual(prepData("super"));
    });

    it("new given a project and containg a template override in the user profile should stub a new project with the template specified", function() {
        var t = "website";
        stubber.fs.paths = [
            {loc: path.join(ptr,t,rdme.l), data: rdme.d},
            {loc: path.join(ptr,t,lib.l), data: lib.d},
            {loc: path.join(ptr,t,test.l), data: test.d},
            {loc: path.join(mtr,t,tpls.l), data: tpls.d},
            {loc: path.join(ptr,t,tpls.l), data: tpls.d}
        ];
        stubber.new("super", t);
        expect(stubber.fs.existsSync(path.join(prj,'lib/super.js')).data).toEqual(prepData("super"));
        expect(stubber.fs.existsSync(path.join(prj,'spec/super-spec.js')).data).toEqual(prepData("super"));
        expect(stubber.fs.existsSync(path.join(prj,'README.md')).data).toEqual(prepData("super"));
        expect(stubber.fs.existsSync(path.join(prj,'lib/super.js')).data).toEqual(prepData("super"));
    });


});
