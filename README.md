# HASCHK (pronounced "has check")

Lordy, these aren't ya grandparents' checksums! `HASCHK` is a low-overhead security layer built on top of any highly available system (e.g. DNS) that uses checksums to ensure the integrity of files downloaded over the web in an automated and non-interactive fashion.

The research and development behind HASCHK was a joint effort by [team members](#meet-the-team) from University of Chicago and Walter Payton College Preparatory High School.

Paper can be found [here](https://git.xunn.io/closed-source/research/psd-mirrored/haschk-paper). The DNS-enabled extension, i.e. DNSCHK, can be downloaded from the Chrome store [here](https://tinyurl.com/dnschk-actual). The DNS-enabled HotCRP demo can be played with [here](https://tinyurl.com/dnschk-hotcrp).

***

## Table of Contents

<!-- TOC -->

- [HASCHK (pronounced &quot;has check&quot;)](#haschk-pronounced-quothas-checkquot)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Literature](#literature)
  - [Contribution Guidelines](#contribution-guidelines)
    - [Branch Workflow](#branch-workflow)
  - [Meet the Team](#meet-the-team)
  - [References](#references)

<!-- /TOC -->

## Installation

You have two options. You can load the pre-built extension directly into Chrome (easy) or build from source (harder).

To load the pre-built extension, you must drag & drop the [build.crx](build.crx) file on to the `chrome://extensions` page:

1. *Settings-Icon* (three vertical dots, top right) -> *More Tools* -> *Extensions*
2. Drag and drop [build.crx](build.crx) onto the Extensions page from the previous step

To build the extension from source:

1. Run the following (assuming linux environment):

```
npm install
npm run build
```

2. Enable developer mode in your browser
3. Use "load unpacked" (or equivalent) and select the `build/` subdir in this project

## Literature

See [the paper](https://git.xunn.io/closed-source/research/psd-mirrored/haschk-paper).

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

You have now merged your code in with everyone else's. You should now go back to
your dev sub branch and catchup to the `develop` branch via `git merge`.

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
|&zwnj;|&zwnj;|

## References

See [the paper](https://git.xunn.io/closed-source/research/psd-mirrored/haschk-paper).

[bd3]: docs/pics/bernard.jpg
[rawalvarez731]: docs/pics/richard.jpg
[hankhoffmann]: docs/pics/hank.jpg
[ilopilop538]: docs/pics/trevor.jpg
