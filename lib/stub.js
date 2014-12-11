var fs = require('fs');
var path = require('path');

function stub() {

    this.moduleRoot = path.dirname(process.mainModule.filename);
    this.fs = fs;
    this.replacements = {};

    this.new = function(project, template) {
        this.replacements["p"] = project;
        var templatePath = this.getTemplatePath(template);
        var projectPath = path.join(process.cwd(), project);

        var templates = this.getTemplates(templatePath);

        var self = this;
        templates.forEach(function(t) {
            var dest = path.join(projectPath,substitute(t.dest,self.replacements));
            var value = substitute(t.contents,self.replacements);
            self.writeFile(dest, value);
        })
    };

    this.getTemplates = function(tp) {

        var templates = [];

        var tf = path.join(tp,"template.json");

        if (!this.fs.existsSync(tf)) {
            throw "no template file found at " + tf;
        }

        var info = {};

        try {
            info = JSON.parse(this.fs.readFileSync(tf));
        } catch (err) {
            throw "Error reading template file check json syntax \n" + tf;
        }

        for(var x in info) {
            var tpf = path.join(tp,x);
            try {
                var c = this.fs.readFileSync(tpf, {encoding: 'utf8'});
                templates.push({
                    contents: c,
                    dest: info[x]
                });
            } catch (err) {
                console.log("Error reading file. Skipping \n" + tpf);
            }
        }
        return templates;
    }


    this.writeFile = function(dest, value) {
        ensurePath(path.dirname(dest), this.fs);
        this.fs.writeFileSync(dest,value);
    };

    this.getTemplatePath = function(template) {
        template = template || "default";
        var p = path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,".stub/templates", template);
        var d = path.join(this.moduleRoot,'../templates', template);

        if (this.fs.existsSync(p)) {
            return p;
        }

        if (this.fs.existsSync(d)) {
            return d;
        }

        throw "No Template Found \n" + p + "\n" + d;
    };


    var substitute = function(v, r) {
        if (v) {
            for (var x in r) {
                var re = new RegExp("\\{\\%" + x + "\\}", "gim");
                v = v.replace(re,r[x]);
            }
        }
        return v;
    };


    var ensurePath = function(p,fs) {
        var pile = "";
        path.normalize(p).split(path.sep).forEach(function(r){
            pile += r
            if (pile && pile > "" && !fs.existsSync(pile)) {
                fs.mkdirSync(pile);
            }
            pile += path.sep;
        });
    }
}

exports = module.exports = stub;
