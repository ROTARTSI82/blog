---
title: 'class reviews and notes'
created: '2025-12-12'
modified: '2025-12-12'
tags: 'hide-ls,hide-dir'
subhead: "notes and random thoughts for classes i've taken"
---


## autumn 2025: lean formalization

Classes: MATH 208, MATH 126, CSE 123.

This quarter was just annoying, so I want to talk about the one interesting project I did: it was a [bonus assignment](/granty29/2025/LeanFormalization_208.pdf) for 208 where
I wrote some Lean to formalize the idea that spans are subspaces. It was interesting to really experience how much work
it was to even get such a simple thing done in lean: these ~300 lines of lean took me multiple days of work and
a healthy amount of torturing Gemini with dependent type theory. Here's the [raw code](/granty29/2025/Basic.lean) for that project, but it appears the unicode characters in lean do not
like to render correctly. Doing this project, I was surprised at how I was doing functional programming way more
than I was doing math. Well, I guess I was doing math by doing functional programming, but I was still surprised
at how much it skewed towards the programming side (though that might just be a result of how I was approaching the project).
I'm not sure if the lean I wrote was very idiomatic, and maybe there's a way to write lean that is more math-like than programming-like.

Another interesting note: one of the things I sidestepped here was the proper way to do finite sets. It seems that finite sets in mathlib are literally
just lists with permutations quotiented out + a proof that it contains no duplicates,
which seems like an absolute pain in the ass to use. I just used linked lists instead because I just needed to prove
that spans were additively and multiplicatively closed. If miraculously someone who knows Lean is reading this,
please tell me if there's a better way...

Other than that fun bonus project, my classes were mostly boring intro stuff that I just had to slog through. Not
a whole lot to say

## info theory [(pg)](/granty29/blog/obsidian/infos/)
LaTeX Notes for Info Theory 1 and 2 as PDFs:
- [Semester 1](/granty29/2025/Info_Theory_1_Notes.pdf): Probability, random variables, entropy, distributions, source and channel coding theorems.
- [Semester 2](/granty29/2025/Info_Theory_2_Notes.pdf): Rate-distortion theory and applications and connections for information theory: gambling, thermodynamics, statistics (Sanov's theorem), Kolmogorov complexity.

Code for my semester 1 final project with Atharv Goel, a solver for Battleship and Hangman in C++ and Haskell:
- [ROTARTSI82/InfoTheoryGames](https://github.com/ROTARTSI82/InfoTheoryGames)

Semester 2 final project with Rohan Ramkumar, a presentation on von Neumann entropy, quantum source coding with typical subspaces:
- [Quantum Information Theory](/granty29/2025/Quantum_Information_Theory.pdf)

## notes for misc classes
+ [diffeq](/granty29/blog/obsidian/diffeq/)
+ [physics c](/granty29/blog/obsidian/physics-c/)
+ [latin](/granty29/blog/obsidian/latin/)