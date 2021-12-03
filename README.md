# Advent of Code 2021
This repository contains the solutions to Advent of Code 2021 by [Simon Karman](https://www.simonkarman.nl). [Advent of Code](https://adventofcode.com/2021/leaderboard/private/view/718869) is an Advent calendar of small programming puzzles for a variety of skill sets and skill levels that can be solved in any programming language you like.

All the solutions in this repository are written in TypeScript.

> Disclaimer: This repository contains the answer to puzzles of Advent of Code 2021. If you don't want spoilers, then please don't look any further.

# Getting Started
To get started install all dependencies.
```bash
npm install
```

To verify the answers you can run all tests.
```bash
npm test
```

# Structure
The section below explains the structure of the files in this project.

## Days
The solutions for each day can be found in the `src/` directory. The solutions of a day are stored in the corresponding file of that day (`day01.ts`, `day02.ts`, ect).

Each day exports a class that is of type `Day<Input, Result>` where `Input` is the type of the input after transformation and `Result` is the type of the expected answer.

## Input
The `input/` directory contains two input files for each day. One for the example input (`day01example.txt`) and one for the answer input (`day01.txt`).

## Tests
All days are unit tested. You can run smaller s of the tests.
```bash
# run all tests of all days
npm test

# run all tests of single day
npm run test -- -t "Day03"

# run the tests for solution A of single day
npm run test -- -t "Day03 A"

# run the example test for solution A of single day
npm run test -- -t "Day03 A example"

# It even supports regex
# run the answer test for solution B of all days
npm run test -- -t "Day\d{2} B answer"
```
