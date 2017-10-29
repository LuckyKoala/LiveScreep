//War logic goes there
var mod = {};
module.exports = mod;

const ThreatValue = {
    attack: 3,
    ranged_attack: 2,
    tough: 1,
    heal: 0,
}

//TODO honour boost part
mod.getThreatValue = function(body) {
    var value = 0;
    for(var i=0; i<body.length; i++) {
        var part = body[i];
        if(part.hits > 0) {
            var v = ThreatValue[part.type];
            if(!_.isUndefined(v)) value+=v;
        }
    }
    return value;
};