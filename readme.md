## PuyoJS

This is a Puyo clone written in Javascript I started last year. There's a lot of porting from PuyoVS. Very unfinished. If I continue this, I will probably rewrite everyting from scratch...

## Engine

The game is written in a modular, component-based (not ECS) engine. Modules are written in RequireJS. The engine does not use OOP. Instead, components are attached to entities (called base here). Components are managed by the entities holding them. Entities act as nodes and components act as leaves, forming a tree/scenegraph.

Currently, the game is very badly organized.

## Installation

Use bower install
