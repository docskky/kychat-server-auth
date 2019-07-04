const v = require('voca');


var StringList = function() {
    this.set = (str, sep=' ') => {
        this.elements = str.split().filter((val)=>{
            return val.length > 0;
        });
    }

    this.removeDup = () => {
        if(this.elements) {
            var sets = new Set(this.elements);
            this.elements = this.elements.filter((val)=>{
                if(sets.has(val)) {
                    sets.delete(val);
                    return true;
                }
                return false;
            });
        }
    }

    this.toString = () => {
        var str = '';
        if (this.elements) {
            this.elements.forEach(element => {
                str += element+ ' ';
            });
        }
        return str;
    }

    this.add = (value) => {
        if (this.elements) {
            this.elements = this.elements.concat(value);
        }
    }

    this.delete = (value) => {
        this.elements = this.elements.filter((ele)=>{
            return ele === value;
        });
    }
};

module.exports = {
    StringList : StringList
};