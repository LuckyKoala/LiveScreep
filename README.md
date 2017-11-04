# LiveScreep

Inspired by [Behaviour-Action Pattern for Screeps Game](https://github.com/Kaiaphas/screeps.behaviour-action-pattern)

All creep have a role, different role have different strategy on choosing next action.

All role have two action stack which imply what this role will do once fulfill the requirment of actions.

All action will have own targets set and according action(Build, Repair, Withdraw etc.)

All setup is pair with role, all the things about body parts, creeps amount goes there.

And all extension of prototype of game objects is located in extension.js.

All files prefix with 'config' is currently not working, they only have comments.

Other utilize function set goes util modules.

For convenience, all role/setup/action/util module will be assigned to global scope which is done in global.js.
