var mod = {};
module.exports = mod;

//Run task to get spawn queue
mod.loop = function() {
    for(const name in Game.creeps) {
        const creep = Game.creeps[name];
        if(creep.spawning) return;
        const role = creep.memory.role;
        const roleModule = Role[role];

        if(roleModule) {
            roleModule.loop(creep);
        } else {
            console.log('[Error] Undefined role module is in memory of creep -> '+name);
        }
    }
};