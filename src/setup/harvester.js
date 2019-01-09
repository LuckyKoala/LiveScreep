var mod = new SetupObj(C.HARVESTER);
module.exports = mod;

mod.setupConfig = {
    Low: {
        minEnergy: 250,
        essBody: [WORK,WORK,MOVE],
        extraBody: [],
        prefix: `[Low-${C.HARVESTER}]`,
        memory: {role: C.HARVESTER},
    },
    Normal: {
        minEnergy: 700,
        //3000 energy / 300 regeneration tick
        //for 1500 lifetime, let's say the harvester can work for 1450tick(50tick on the way)
        //for 1450 ticks, source will generate 15000 energy
        // 5 work means
        //  in 14500(1450*10) energy
        //  out 295(1450*0.2) cpu     and 700 energy for spawning this creep
        //10 work means
        //  in 15000 energy
        //  out 150(15000/20*0.2) cpu and 1400 energy for spawning this creep
        //Diff:
        //  use 10 work to replace 5 work can decease energyIn by 900energy and also decease cpu cost for 145cpu/1450ticks
        //Conclusion: it is worthy.
        //And if we can use one harvester for two sources, we can get more!
        essBody: [WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,CARRY,MOVE],
        extraBody: [WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,CARRY,MOVE],
        maxExtraAmount: 1,
        prefix: `[${C.HARVESTER}]`,
        memory: {role: C.HARVESTER},
    },
};
