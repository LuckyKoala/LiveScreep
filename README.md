# LiveScreep

Inspired by [Behaviour-Action Pattern for Screeps Game](https://github.com/Kaiaphas/screeps.behaviour-action-pattern)

All creep have a role, different role have different strategy on choosing next action.

All role have two action stack which imply what this role will do once fulfill the requirment of actions.

All action will have own targets set and according action(Build, Repair, Withdraw etc.)

All setup is pair with role, all the things about body parts, creeps amount goes there.

And all extension of prototype of game objects is located in extension.js.

You can create config.override module to override some default options, this feature is still under experiment. 

Other utilize function set goes util modules.

For convenience, all role/setup/action/util module will be assigned to global scope which is done in global.js.

# Getting Started

* Clone this repo
* `npm install` to install dependencies
* [Check GruntJS and Install grunt-cli](https://gruntjs.com/getting-started)
* Write a `.screeps.json` which contains email, branch, ptr, password in root directory
* `grunt screeps` to push code to Screeps Server

