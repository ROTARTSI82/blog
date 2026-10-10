---
title: "lean taught right: functions (1 of ?)"
created: "October 9 2026"
---

Hey! It's been a year since I wrote my [first blog post](/granty29/blog/2025/lean-1105/) (honestly, probably don't read that) about lean4 as I was just getting into it, and I wanted to come back and write this post to be the lean tutorial that I wish I had. To me, this is lean4 taught correctly, with an aim towards (slowly) teaching you how all the systems work at a fundamental level. I will start by approaching lean as a programming language and slowly revealing its proof assistant features, mainly because I find this way of thinking about lean to be the most helpful: a programming language that you do math in.

This tutorial will be pretty fast-paced, and I think that the correct way to read this will be to pull open an editor, type out the example code, and explore what's going on by clicking around with the lean **InfoView**. If you are a nerd, you can use the nvim plugin, but normal people use VSCode. And if you're extremely lazy, you can probably get by using the online lean playground at [live.lean-lang.org](https://live.lean-lang.org/). ==I will be including some links to open live leans of my example code in each section==

## Functions

With lean being a functional programming language, where better to start than functions? Let's get familiar with the basic syntax.

```lean
/- hello world! this is a comment -/
def hello : String := "world"

def luckyNumber (s : String) (n : Nat) : String :=
  s ++ " has a lucky number of " ++ (toString n)
```
Here, we are using the builtin types of strings and natural numbers, and we can actually compute concrete values. Like Haskell, we write function calls without parenthesis (`toString n`), and the `++` to concatenate strings and lists. The keyword `def` is used defining both functions and constants, and we can both `#check` the type of an expression and `#eval` its value:

```lean
#check luckyNumber
/- luckyNumber : String → Nat → String -/
#check luckyNumber "Aeneas"
/- luckyNumber "Aeneas" : Nat → String -/
```

Ok, ok-- if you typed this into lean, you might not see _exactly_ that, but allow me to lie a little and rephrase the output in this way to be slightly more illustrative.

Note the **currying** that is happening here: we should interpret `luckyNumber` as having type `String → (Nat → String) `, ie. a function that takes in a string and returns a new _function_ `Nat → String`. The `→` operator (a unicode character that you can type as `\to`, as in LaTeX) is a bit strange as it's **right-associative**, while function application is **left-associative**. In the following example, `luckyNumber "Dido" 2` would be parsed as `(luckyNumber "Dido") 2`:
  
```lean
#eval luckyNumber "Aeneas" 5
/- "Aeneas has a lucky number of 5" -/
#eval luckyNumber "Dido" 2
/- "Dido has a lucky number of 2" -/
```

Of course, lean also has lambda expressions, so you can rephrase the definition of `luckyNumber` is several equivalent ways:
```lean
def luckyNumber : String → Nat → String :=
  fun s n => s ++ " has a lucky number of " ++ (toString n)
/- or, equivalently: -/
  fun s => (fun n => s ++ " has a lucky number of " ++ (toString n))

def luckyNumber (s : String) : Nat → String :=
  fun n ↦ s ++ " has a lucky number of " ++ (toString n)
```

You can use either `=>` or the funny `↦` symbol (which you can type as `\mapsto`), and both of them mean the same thing. Alright, our `luckyNumber` example so far has been a pretty boring function between pretty boring types. Shall we take a look at something more exotic?


## (Dependent) Types

Let me point us to something a little profound: everything in lean has a type, including types themselves! In particular, you can check that `Nat` is a **term** of the **type** `Type`, just as `2` is a term of the type `Nat`:
```lean
#check 2    /- 2 : Nat -/
#check Nat  /- Nat : Type -/
```

In fact, we have an infinite hierarchy of **type universes**: the type `Type` itself is a term of `Type 1`, and then we have `Type 1 : Type 2`, `Type 2 : Type 3`, and so on. This is because having `Type : Type` would lead to paradoxes, similar to how having a set of all sets leads to Russel's Paradox-- does the set of all sets that do not contain themselves contain itself? The type theory version of this is called Girards Paradox, but we will avoid dealing with all this complexity for now. Let's restrict ourselves mostly to the basic `Type` universe, and take a look at an example of a function acting on `Type`s:


```lean
#check List       /- List : Type → Type  -/
#check [1, 2, 3]  /- [1, 2, 3] : List Nat -/
```

That's right! The type constructor `List` is quite literally just a normal function, taking in some type and returning the type of lists of that type. A true monoid in the category of endofunctors. Actually, I'm lying a bit about the true type of `List` because I'm neglecting type universes, but my point still stands.

Now, we can combine this with another one of lean's special features: **dependent types**! In lean, the _types_ of later parameters (including return values) are allowed to depend on the _values_ of earlier parameters. With these techniques, we can start doing some devious shit:

```lean
def reverseList (α : Type) (input : List α) : List α :=
  match input with
  | [] => []
  | x::xs => (reverseList α xs) ++ [x]

#eval reverseList Nat [1, 2, 3]
/- [3, 2, 1] -/
#eval reverseList String ["a", "b", "c"]
/- ["c", "b", "a"] -/
```

Notice how `α` (typed as `\alpha`) appears on the left side of the `:` in the first parameter, but then it appears on the right side as an argument passed into `List` in the following parameter!

This is actually very idiomatic lean-- where other languages have to rely on generics, templates, or metaprogramming, lean can use normal (albiet dependently-typed) functions. There are several new features to cover here. We are recursively reversing a linked list using **pattern matching**: we return the empty list if our input is empty, and otherwise we take the first element `x` and append it to the end after reversing the list of remaining elements `xs`. Pattern matching can be used on any **inductive type**, and many of the examples we've seen so far (`List α`, `String`, and `Nat`) are all inductive types.

With this, you have actually met every single basic building block in lean: dependent function types, type universes, and inductive types! Essentially everything you encounter in lean will ultimately be made up of these three building blocks if you keep drilling down, so you should make sure to understand them well. Actually, I am slightly lying because quotient types are a bit of an edge case, but my claim about these three essential building blocks is essentially correct. If you want, you can read this footnote,[^1] but you can think of these as the three most fundamental things, the irreducible atoms of lean.

[^1]: Quotient types can be thought of as an example of a _Higher_ Inductive Type, a slight generalization of lean's notion of inductive types. Go read Homotopy Type Theory bro.

We will take a closer look at inductive types in a bit, but first I would like to introduce a quality-of-life language feature that you will encounter constantly. Notice how in our usage of `reverseList`, we have to explicitly write the name of the type even when it could be inferred automatically from the type of the list? Well:

```lean
#eval reverseList _ [1, 2, 3]  /- [3, 2, 1] -/
```

In any type expression (including in the middle of very complex expressions), you can leave a _hole_ by typing an underscore (`_`) to tell lean's **elaborator** to try to infer the type from context. In fact, you can define `reverseList` to automatically infer type parameters like so:

```lean
def reverseList₂ {α : Type} (input : List α) : List α :=
  reverseList α input

#eval reverseList₂ ["a", "b", "c"]  /- ["c", "b", "a"] -/
```

The subscript can be typed as `\_2`-- lean accepts those unicode characters in identifier names, and it also accepts some slightly cursed/unexpected ones like `'`, which is used to mean 'prime' or 'derivative' in some cases. The curly brackets indicate an _implicit parameter_ whose value is inferred from context, and you can turn implicit parameters back into explicit parameters using `@` for more explicit control:

```lean
#eval @reverseList₂ String ["a", "b", "c"]
/- ["c", "b", "a"] -/
```

Alright, now back to the main program.

## Basic Inductive Types

Let's start with some of the simplest inductive types imaginable:

```lean
inductive Color : Type where
| red : Color
| green : Color
| blue : Color
```

This is essentially just a plain `enum`, and at a fundamental level, this declaration simply introduces a couple of new values: the type itself (`Color : Type`), its **constructors** (`Color.red : Color`, `Color.green : Color`, and `Color.blue : Color`), and finally a **recursor**. The defining property of inductive types is that you can do pattern matching on them, and the recursor is what allows you to do that. You would almost never use the raw recursor directly, but the recursor is very important to understand as it is (theoretically) how things like `match`-expressions are implemented. The recursor essentially has this type:

```lean
axiom Color.rec : {motive : Color → Type} → (red : motive Color.red)
    → (green : motive Color.green) → (blue : motive Color.blue) → (t : Color) → motive t
```

Theoretically, we should be able to use `rec` and `match` to provide these two equivalent definitions of a function `toHexCode`:

```lean
def toHexCode (c : Color) : String :=
  match c with
  | .red => "ff0000"
  | .green => "00ff00"
  | .blue => "0000ff"
/- or, equivalently, -/
  @Color.rec (fun _ => String) "ff0000" "00ff00" "0000ff" c
```
Much of the complexity of the recursor's type simply comes from the fact that we need to handle all possible dependent typings. The `motive` parameter is how we do it, as it will tell us how the return type depends on the value we are matching on. In our call to `rec`, our motive `fun _ => String` is simply a function that ignores its input and returns the `String` type. Thus, `motive Color.red`, `motive Color.green`, and `motive Color.blue` all just evaluate to `String`, and all the different branches of our `match` have the same type. Then, the rest of the parameters give the values of each subcase/arm of the `match`, and finally one supplies the value to match on. In the general case, the recursor must account for the possibility that these branches are all of different types!

Now, those two definitions are equal in theory, but in practice, `Color.rec` will not generate any executable code, and so lean will require that you mark this as a `noncomputable def`, and you will not be able to `#eval` it. This is just a random restriction around recursors in the current version of lean's code generator, though, and the `match` version will evaluate perfectly fine:

```lean
#eval toHexCode Color.red    /- "ff0000" -/
#eval toHexCode Color.green  /- "00ff00" -/
#eval toHexCode Color.blue   /- "0000ff" -/
```

Just for fun, here is a more complicated example that utilizes dependent types. Can you make sense of what is happening here?

```lean
def foo := @Color.rec (@Color.rec (fun _ => Type) String Nat Bool) "abc" 123 True Color.red
```

Now, let's take a bit of a step up and look at some examples of core inductive types. We begin with the classic `Option` monad, also known as `Maybe` in Haskell.

```lean
inductive Opt (α : Type) : Type where
| some : α → Opt α
| none : Opt α
```


