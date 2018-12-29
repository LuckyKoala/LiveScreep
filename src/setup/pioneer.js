var mod = new SetupObj(C.PIONEER);
module.exports = mod;

//Spawn require 15000 energy
//1 work build 5 energy per tick
//MOVE parts should be more than other type of creeps
// since it should move quickly
mod.setupConfig = {
    Normal: {
		    minEnergy: 200,
		    essBody: [CARRY, WORK, MOVE],
        //carry 1 work 1, 10 ticks 50 energy
        //out 5 energy/tick
        //in 2 energy/tick
        //25ticks harvest
        //10ticks build
        //500 energy/35tick
        //we can assume 500 energy 50 tick(25harvest+10build+15move)
        // and assume 1200tick lifetime
        //  aka 12000 per lifetime
        //so one is enough with renew
        //   two is enough without renew
		    extraBody: [CARRY, WORK, MOVE],
        maxExtraAmount: 9,
		    prefix: `[${C.PIONEER}]`,
		    memory: {role: C.PIONEER},
	  },
};
