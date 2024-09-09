# game TicTacToe
- This project has educational purpose.
- Src code has been provided during [master of programming and software design](https://escuela.it/masters/master-programacion-diseno-software).
- Domain Model and version's requisites are [here](https://github.com/USantaTecla-0-domains/game-ticTacToe)

# Code provided

## 0 - Structured Programing
0. Basic Version: [0-v0.0](./0-programacionEstructurada/v0.0/app.js)

## 1 - Process Oriented Programing (POP)
0. Basic Version with standard functions: [1-v0.0](./1-programacionOrientadoProcesos/v0.0/app.js)
   - -> [Task 1](#task-1)


# Tasks
## Task 1
* Upgrade basic version [1-v0.0](./1-programacionOrientadoProcesos/v0.0/app.js) to machine version 1-v1.x ([requisites](https://github.com/USantaTecla-0-domains/game-ticTacToe/blob/master/1.1.machine/README.md)).  
* Motivation: practice high order functions.

### [1-v1.0](./1-programacionOrientadoProcesos/v1.0/app.js)
1. Provided code (1-v0.0) refactored: moved some functions to local sopes, many identifiers names changes, none function uses const values declared in superior scopes (all data needed is provided as arguments.), eradicated duplicated code and smell code dataset.
2. New functionality implemented, trying to avoid duplicated code and homogenize interfaces as maximum.

### [1-v1.1](./1-programacionOrientadoProcesos/v1.1/app.js)
- This version has a different approach: 
  1. Use provided code (1-v0.0) whithout any refactoring. Use existing functions and vars/consts.
  2. Only extract the minimum code that changes (depending on game mode) and provide it as a functions to placeToken funtion.
  3. Functions for users has exactly the same provided code.
  4. Functions for machine has been implemented adapting user's functions. 

### [1-v1.2](./1-programacionOrientadoProcesos/v1.2/app.js)
- This version is an upgrade og 1-v1.1
- Functions userReadOrigin and userReadTarget are created by userReadGenerator. Wich configures this functions via currification.
- Idem for machineReadOrigin and machineReadTarget.