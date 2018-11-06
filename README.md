# DNSCHK (pronounced "dns check")

Lordy, these aren't ya grandparents' checksums! `DNSCHK` is a low-overhead security layer built on top of DNS that uses checksums to ensure the integrity of files downloaded over the web in an automated and non-interactive fashion.

The research and development behind DNSCHK was a joint effort by [team members](#meet-the-team) from University of Chicago and Walter Payton College Preparatory High School.

Paper can be found [here](https://git.xunn.io/research/dnschk-paper).

***

## Table of Contents

<!-- TOC -->

- [DNSCHK (pronounced "dns check")](#dnschk-pronounced-dns-check)
    - [Table of Contents](#table-of-contents)
    - [Installation](#installation)
    - [Literature](#literature)
    - [Contribution Guidelines](#contribution-guidelines)
        - [Branch Workflow](#branch-workflow)
    - [Meet the Team](#meet-the-team)
    - [References](#references)

<!-- /TOC -->

## Installation

1. Build the extension from source

```
npm install
npm run build
```

2. Enable developer mode in your browser
3. Use "load unpacked" (or equivalent) and select the `build/` subdir in this project

## Literature

See [the wiki](https://github.com/morty-c137-prime/DNSCHK/wiki) or [the paper](https://git.xunn.io/research/dnschk-paper).

## Contribution Guidelines

At the moment, most of the documentation is contained in comments in the source.
Also, whenever you change any configurations in `config/`, you should run `npm
run regenerate`. We use Webpack and Gulp to make things work.

Note: if you want to use `process.env.*` in the `src/` directory, you must mutate
the webpack `DefinePlugin` [config entry](config/webpack.config.js).

### Branch Workflow

Branches:
 - master
 - develop
 - &lt;subbranch&gt;-develop

Everyone working on the project should have their own (public) development sub
branch. For example, I have `xunn-develop` as my sub branch. When you have some
new code to add, first commit it to your sub branch. Next, switch to the
`develop` branch and `git pull` any updates. Then `git merge` your development
sub branch into the `develop` branch. Then push the new `develop` branch.

You have now merged your code in with everyone else's. You should now go back to your dev sub branch and catchup to the `develop` branch via `git merge`.

Every now and then, one of us will merge `develop` with `master` via PR.

Hence, the branch workflow can be summarized as:

1. Everyone merges their sub branches into `develop` when they have code to share.
2. Everyone routinely merges `develop` back into their sub branches.
2. Occasionally, a PR into `master` is made from `develop`.

## Meet the Team

<!-- Tables for formatting images? Jeez, welcome back to 1999! -->
|&zwnj;|&zwnj;|
|-|-|
| ![a picture goes here][bd3] | [Bernard Dickens III](https://bernarddickens.com)|
| ![a picture goes here][rawalvarez731] | [Richard Alvarez](http://richard.alvareztech.org)|
| ![a picture goes here][hankhoffmann] | [Hank Hoffmann](http://people.cs.uchicago.edu/~hankhoffmann)|
| ![a picture goes here][ilopilop538] | [Trevor Medina](ilopilop538@gmail.com)|
| ![a picture goes here][davidcash] | [David Cash](https://people.cs.uchicago.edu/~davidcash)|
| ![a picture goes here][ravenben] | [Ben Zhou](http://people.cs.uchicago.edu/~ravenben)|
|&zwnj;|&zwnj;|

## References

See [the paper](https://git.xunn.io/research/dnschk-paper).

[bd3]: docs/pics/bernard.jpg
[rawalvarez731]: docs/pics/richard.jpg
[hankhoffmann]: docs/pics/hank.jpg
[ilopilop538]: docs/pics/trevor.jpg
[davidcash]: docs/pics/david.jpg
[ravenben]: docs/pics/ben.jpg
