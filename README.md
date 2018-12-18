# LiveScreep

## Feature

![ScreenShot in Simulation](img/simulation.jpg)

Latest Release => `v0.1-StupidHalfAutomated)`

* Automatically place containers, extensions, roads and towers
* Keep upgrading controller
* Towers can select target and then attack, heal or repair
* Base harvesting, hauling, storage filling and withdrawing
* Maintain walls and ramparts
* When tower is present, a guardian will be spawned and help guard the room
* Automatically active safe mode and send notification to player if the room can't handle the attack
* Implemented logic of drop-mining, container-mining, link-mining and remote-mining. (Currently these are not automatically, so if you want to use it, you have to dig in codebase and manually place some flags)
* Half-implemented SK-mining

NOTE: Currently extensions are placed randomly.

# Introduction

Inspired by [Behaviour-Action Pattern for Screeps Game](https://github.com/Kaiaphas/screeps.behaviour-action-pattern)

All creep have a role, different role have different strategy on choosing next action.

All role have two action stack which imply what this role will do once fulfill the requirment of actions.

All action will have own targets set and according action(Build, Repair, Withdraw etc.)

All setup is pair with role, all the things about body parts, creeps amount goes there.

And all extension of prototype of game objects is located in extension.js.

You can create config.override module to override some default options, this feature is still under experiment. 

Other utilize function set goes util modules.

For convenience, all role/setup/action/util module will be assigned to global scope which is done in global.js.

## Actions

### Base Actions

* Harvest: mark source and harvest energy from source, if creep can't reach source, make it move towards source.
* Fill: fill energy to spawns and extensions.
* Build: build construction sites on the ground.
* Drop: just drop energy on the ground.
* Pickup: pickup energy on the ground, sorted by range.
* Withdraw: hauler withdraw energy from non-empty containers and storage, and filler do what?(Unknown until I re-read my code written before -.-ll)
* Put: harvester put energy to container assigned to source, and others put energy to container except those has been assigned to source.
* Upgrade: upgrade controller of course.

### Extended Actions

* Dismantle: dismantle flagged structures, the flag associated is described in global.FlagUtil.
* Fuel: fuel energy in towers.
* Guard: attack nearest hostile creep, sorted by ThreatValue.
* Invade: attack nearest hostile creep, sorted by ThreatValue.
* Maintain: maintain ramparts so it will not decay to nil.
* Repair: too complicated, simplify it later -.-;;
* Travel: travel to destination.
* Recycle: go to spawn and let spawn recycle self.
# TODO

* Assign a role depends on its body part if role of creep is undefined
* Auto place links
* Auto place walls/ramparts
* Optimize Action.Pickup, only for source drop by harvester(let hauler do it) and by recycler(let ant do it)
* Avoid creep die accidentally while working, schedule their natural death
* Support control of multiple room
* Simplify logic in Action.Withdraw and Action.Put
* [PTR] Make use of Creep.pull and Creep.accept, e.g remove MOVE part from Fixed Worker

# Getting Started

* Clone this repo
* `npm install` to install dependencies

## Commit code to Screeps server

* [Check GruntJS and Install grunt-cli](https://gruntjs.com/getting-started)
* Write a `.screeps.json` which contains email, branch, ptr, password and `private_directory`(if you want commit it to local for private server) in root directory
* `grunt` to push code to Screeps Server
* `grunt private` to push code to Screeps Server
