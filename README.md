# HASCHK (pronounced "has check")

Lordy, these aren't ya grandparents' checksums! `HASCHK` is a low-overhead
security layer built on top of any highly available system (e.g. DNS) that uses
checksums to ensure the integrity of files downloaded over the web in an
automated and non-interactive fashion.

The research and development behind HASCHK was a joint effort by [team
members](#meet-the-team) from University of Chicago, Michigan State University,
and Walter Payton College Preparatory High School.

Paper can be found
[here](https://github.com/closed-source/research/psd-mirrored/haschk-paper).
The DNS-enabled extension, i.e. HASCHK, can be downloaded from the Chrome store
[here](https://haschk.dev/install). The DNS-enabled HotCRP demo can be played
with [here](https://hotcrp.haschk.dev).

***

## Table of Contents

<!-- TOC -->

- [HASCHK (pronounced "has check")](#haschk-pronounced-has-check)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Literature](#literature)
  - [Meet the Team](#meet-the-team)
  - [References](#references)

<!-- /TOC -->

## Installation

You have three options. You can download the extension from the chrome web store
[here](https://haschk.dev/install). You can load the pre-built extension
directly into Chrome (easy) or build from source (harder).

To load the pre-built extension, you must drag & drop the [build.crx](build.crx)
file on to the `chrome://extensions` page:

1. *Settings-Icon* (three vertical dots, top right) -> *More Tools* ->
   *Extensions*
2. Drag and drop [build.crx](build.crx) onto the Extensions page from the
   previous step

To build the extension from source:

1. Run the following (assuming linux environment):

```
npm install
npm run build
```

2. Enable developer mode in your browser
3. Use "load unpacked" (or equivalent) and select the `build/` subdir in this
   project

## Literature

See [the
paper](https://github.com/closed-source/research/psd-mirrored/haschk-paper).

## Meet the Team

<!-- Tables for formatting images? Jeez, welcome back to 1999! -->
|&zwnj;|&zwnj;|
|-|-|
| ![a picture goes here][bd3] | [Bernard Dickens III](https://bernarddickens.com)|
| ![a picture goes here][rawalvarez731] | [Richard Alvarez](http://richard.alvareztech.org)|
| ![a picture goes here][ilopilop538] | [Trevor Medina](ilopilop538@gmail.com)|
| ![a picture goes here][hankhoffmann] | [Hank Hoffmann](http://people.cs.uchicago.edu/~hankhoffmann)|
|&zwnj;|&zwnj;|

## References

See [the
paper](https://github.com/closed-source/research/psd-mirrored/haschk-paper).

[bd3]: docs/pics/bernard.jpg [rawalvarez731]: docs/pics/richard.jpg
[hankhoffmann]: docs/pics/hank.jpg [ilopilop538]: docs/pics/trevor.jpg
