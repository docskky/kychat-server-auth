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

var Account = function() {
    this.PREFIX_KYCHAT = '0:';
    this.PREFIX_KAKAO = '1:';

    // id가 카카오 계정인 경우 true
    this.isKakao = (id) => {
        if (v.isEmpty(id)) {
            return false;
        }

        return v.startsWith(id, KAKAO_PREFIX);
    }

    this.toKakaoAcc = (kakaoID) => {
        return KAKAO_PREFIX+kakaoID;
    }

}

module.exports = {
    StringList : StringList,
    Account : Account
};