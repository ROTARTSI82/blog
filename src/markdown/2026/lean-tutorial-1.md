---
title: "lean tutorial: the basics (1 of ?)"
subhead: "dependent types, basic inductive types, and the curry-howard correspondence"
created: "October 9 2026"
tags: "mathposting,featured"
---

Hey! It's been a year since I wrote my first blog post[^3] about lean4 as I was just getting into it, and recently I've been wanting to come back and write a better post.

I will be writing this as the lean tutorial I wish I had, presenting the topics in my desired order and going to a level of depth that I would have wanted. My preferences might not suit you, though! I have written this post with an aim towards (slowly) teaching you how all the systems work at a fundamental level, rather than teaching you how you might want to do things in practice. For that, you will have to refer to another resource, or just simply get your hands dirty yourself.

[^3]: I've delisted it, but you can still find it by url or in my blog's file browser at `blog/2025/lean-1105` on this site. Honestly, probably don't read it....

This tutorial will be pretty fast-paced, and I think that the correct way to read this will be to pull open an editor, type out the example code, and explore what's going on by clicking around with the lean **InfoView**. The canonical way to run lean is through the VSCode extension and `elan`, but there are also things like a [neovim plugin](https://github.com/julian/lean.nvim) for the nerds. If you're _extremely_ lazy, you can probably get by using the online lean playground at [live.lean-lang.org](https://live.lean-lang.org/).

Anyways, this post will be the first in a series. I will start by approaching lean as a programming language and slowly revealing its proof assistant features, mainly because I find this way of thinking about lean to be the most helpful: a programming language that you do math in.

==I am still working on writing all the tutorials in the series, and I may come back and edit this post!==

# Table of Contents
<!-- toc -->

# Functions

With lean being a functional programming language, where better to start than functions? Let's get familiar with the basic syntax.

```lean
/- hello world! this is a comment -/
def hello : String := "world"

def luckyNumber (s : String) (n : Nat) : String :=
  s ++ " has a lucky number of " ++ (toString n)
```
Here, we are using the builtin types of strings and natural numbers, which have concrete, computable values. Lean is a programming language with a working code generator, and we can compile this function into executable machine code that would do what you'd expect. Like Haskell, we write function calls without parenthesis (i.e. `toString n`), and we use the `++` operator to concatenate strings and lists. The keyword `def` is used to define both functions and constants, and we can both `#check` the type of an expression and `#eval` its value:

```lean
#check luckyNumber
/- luckyNumber : String → Nat → String -/
#check luckyNumber "Aeneas"
/- luckyNumber "Aeneas" : Nat → String -/
```

Ok, ok-- if you typed this into lean, you might not see _exactly_ that, but allow me to lie a little and rephrase the output in this way to be slightly more illustrative. We continue.

Note the **currying** that is happening here: we should interpret `luckyNumber` as having type `String → (Nat → String) `, ie. a function that takes in a string and returns a new _function_ `Nat → String`. The `→` operator (a unicode character that you can type as `\to`, as in LaTeX) is a bit strange as it's **right-associative**, while function application is **left-associative**. In the following example, `luckyNumber "Dido" 2` would be parsed as `(luckyNumber "Dido") 2`:
  
```lean
#eval luckyNumber "Aeneas" 5
/- "Aeneas has a lucky number of 5" -/
#eval luckyNumber "Dido" 2
/- "Dido has a lucky number of 2" -/
```

Of course, lean also has lambda expressions, so you can rephrase the definition of `luckyNumber` in several equivalent ways:
```lean
def luckyNumber : String → Nat → String :=
  fun s n => s ++ " has a lucky number of " ++ (toString n)
/- or, equivalently: -/
  fun s => (fun n => s ++ " has a lucky number of " ++ (toString n))

def luckyNumber (s : String) : Nat → String :=
  fun n ↦ s ++ " has a lucky number of " ++ (toString n)
```

You can use either `=>` or the funny `↦` symbol (which you can type as `\mapsto`), and both of them mean the same thing. Alright, our `luckyNumber` example so far has been a pretty boring function between pretty boring types. Shall we take a look at something more exotic?


# (Dependent) Types

Let me point us to something a little profound: everything in lean has a type, including types themselves! In particular, you can check that `Nat` is a **term** of the **type** `Type`, just as `2` is a term of the type `Nat`:
```lean
#check 2    /- 2 : Nat -/
#check Nat  /- Nat : Type -/
```

In fact, we have an infinite hierarchy of **type universes**: the type `Type` itself is a term of `Type 1`, and then we have `Type 1 : Type 2`, `Type 2 : Type 3`, and so on. This is because having `Type : Type` would lead to paradoxes, similar to how having a set of all sets leads to Russell's Paradox-- does the set of all sets that do not contain themselves contain itself? The type theory version of this is called Girard's Paradox, but we will avoid dealing with all this complexity for now. Let's restrict ourselves mostly to the basic `Type` universe, and take a look at an example of a function acting on `Type`s:


```lean
#check List       /- List : Type → Type  -/
#check [1, 2, 3]  /- [1, 2, 3] : List Nat -/
```

That's right! The type constructor `List` is quite literally just a normal function, taking in some type and returning the type of lists of that type. A true monoid in the category of endofunctors. Actually, I'm lying a bit about the true type of `List` because I'm neglecting type universes, but my point still stands. I will continue to neglect universe-related shenanigans in this article until we are ready to deal with them.

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

This is actually very idiomatic lean-- where other languages have to rely on generics, templates, or metaprogramming, lean can use normal (albeit dependently-typed) functions. There are several new features to cover here. We are recursively reversing a linked list using **pattern matching**: we return the empty list if our input is empty, and otherwise we take the first element `x` and append it to the end after reversing the list of remaining elements `xs`. Pattern matching can be used on any **inductive type**, and many of the examples we've seen so far (`List α`, `String`, and `Nat`) are all inductive types.

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

The subscript can be typed as `\_2`, and lean accepts those unicode characters in identifier names (it also accepts some slightly cursed/unexpected ones like `'`, which is used to mean 'prime' or 'derivative' in some cases). The curly brackets indicate an _implicit parameter_ whose value is inferred from context, and you can turn implicit parameters back into explicit parameters using `@` for more explicit control:

```lean
#eval @reverseList₂ String ["a", "b", "c"]
/- ["c", "b", "a"] -/
```

Alright, now back to the main program.

# Basic Inductive Types

Let's start with some of the simplest inductive types imaginable:

```lean
inductive Color : Type where
| red : Color
| green : Color
| blue : Color
```

This is essentially just a plain `enum`, and at a fundamental level, this declaration simply introduces a couple of new values: the type itself (`Color : Type`), its **constructors** (`Color.red : Color`, `Color.green : Color`, and `Color.blue : Color`), and finally a **recursor**. The defining property of inductive types is that you can do pattern matching on them, and the recursor is what allows you to do that. You would almost never use the raw recursor directly, but the recursor is very important to understand as it is (theoretically) how things like `match`-expressions are implemented. Later on, when we see examples of _recursive_ inductive types, the recursor will be the basis of performing induction too. For now though, we can focus on `match`. The recursor essentially has this type:

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
Much of the complexity of the recursor's type simply comes from the fact that we need to handle all possible dependent typings. The `motive` parameter is how we do it, as it will tell us how the return type depends on the value we are matching on. In our call to `rec`, our motive `fun _ => String` is simply a function that ignores its input and returns the `String` type. Thus, `motive Color.red`, `motive Color.green`, and `motive Color.blue` all just evaluate to `String`, and all the different branches of our `match` will have the same type. Then, the rest of the parameters give the values of each subcase/arm of the `match`, and finally one supplies the value to match on. In the general case, though, the recursor must account for the possibility that these branches are all of different types!

Now, those two definitions are equal in theory, but in practice, `Color.rec` will not generate any executable code, and so lean will require that you mark this as a `noncomputable def`, and you will not be able to `#eval` it. This is just a random restriction around recursors in the current version of lean's code generator, though, and the `match` version will evaluate perfectly fine:

```lean
#eval toHexCode Color.red    /- "ff0000" -/
#eval toHexCode Color.green  /- "00ff00" -/
#eval toHexCode Color.blue   /- "0000ff" -/
```

Just for fun, here is a more complicated example that utilizes dependent types. Can you make sense of what is happening here?

```lean
def foo := @Color.rec (@Color.rec (fun _ => Type) String Nat Bool) "abc" 123 true Color.red
```

Now, let's take a bit of a step up and look at some examples of slightly more complicated inductive types. We begin with the classic `Option` monad, also known as `Maybe` in Haskell.

```lean
inductive Option (α : Type) : Type where
| none : Option α
| some : α → Option α
```

Notice here that `Option` is a function `Type → Type` just like `List`, defining a whole type family! Our `inductive` declarations can take parameters in the same way that `def` declarations can. Additionally, our `Option.some : α → Option α` constructor is also a function that takes in an argument. This is what allows our type to hold data that we can match against. Take a look at the constructors and the recursor for `Option`. Can you make sense of what is happening?
```lean
axiom Option.some {α : Type} (val : α) : Option α
axiom Option.none {α : Type} : Option α
axiom Option.rec {α : Type} {motive : Option α → Type}
    (none : motive none)
    (some : (val : α) → motive (some val))
    (t : Option α) : motive t
```

And here is an example of how one might use an `Option`:

```lean
def greet (name : Option String) : String :=
  match name with
  | .some n => "curse you, " ++ n
  | .none => "nobody is attacking me!"
/- or, -/
  Option.rec "nobody is attacking me!" (fun n => "curse you, " ++ n) name

#eval greet Option.none
/- "nobody is attacking me!" -/
#eval greet (Option.some "Odysseus")
/- "curse you, Odysseus" -/
```


An inductive type's recursor lets us look inside and determine exactly how the value was constructed. We get which constructor was used, and we get the values of all the arguments into the constructor. This actually implies that all constructors are injective, and that all the different constructors have disjoint images, as you would hope. Later, we will be able to formally prove this in lean using the power of recursors.

## Sums and Products

Now, we are ready to meet a fuller cast of lean's core inductive types. Some of these types have their own custom syntaxes and notations, like we saw with the `[1, 2, 3]` syntax for lists. Much of this syntax is actually defined in lean itself, either with metaprogramming or as simple infix notations. Let's take a look at a `Sum` type:

```lean
inductive Sum (α : Type) (β : Type) where
| inl (val : α) : Sum α β
| inr (val : β) : Sum α β

infixr:30 " ⊕ " => Sum
```
The type `Sum α β` can be written as `α ⊕ β` (`\alpha \oplus \beta`), and it represents the _disjoint union_ or _direct sum_ of the types `α` and `β`. A value of type `Sum α β` is either an `α` or a `β`, and one would have to use a `match` statement to peek inside and discover what it holds.

```lean
def funFunction (x : Nat ⊕ Int) : Nat :=
  match x with
  | .inl n => 2 * n
  | .inr i => Int.natAbs i

#eval funFunction (Sum.inl 5)     /- 10 -/
#eval funFunction (Sum.inr (-5))  /- 5  -/
```

Can you figure out what the type of Sum's recursor must be? You can check your work with `#check Sum.rec`, or `#print Sum.rec`.

Now that we've met the sum, of course we need to meet the dual notion of the product! Switch your colimit for a limit, and you get this guy:

```lean
inductive Prod (α : Type) (β : Type) where
| mk : α → β → Prod α β

infixr:35 " × "  => Prod
```
This is the type of tuples where the first element is of type `α` and the second element is of type `β`. The notation for this is the Cartesian product, written `α × β`, or `\alpha \times \beta`. Notice that we can define the following very special functions:

```lean
def Prod.fst (x : α × β) : α :=
  match x with
  | .mk a _ => a

def Prod.snd (x : α × β) : β :=
  match x with
  | .mk _ b => b
```

Because we've prefixed these names with `Prod.`, which matches the name of our type `Prod`, we can actually write these function calls using the `object.function` notation.

```lean
#eval (Prod.mk 3 "hi").fst  /- 3    -/
#eval (Prod.mk 3 "hi").snd  /- "hi" -/
```

Additionally, since the `Prod` type has only one constructor, we can take advantage of a special syntax in lean to avoid typing `Prod.mk` everywhere. This syntax works for any type with a single constructor, and it is written either as `\<` and `\>`, or as `\langle` and `\rangle`. Because the syntax is so general, to use it, lean must be able to infer the value's type from some other context clue. You can also use this angle bracket syntax to write nested applications of constructors in a nice, flattened way.

```lean
#eval Prod.fst ⟨3, "hi"⟩  /- 3 -/
#eval (⟨3, "hi", -6⟩ : Nat × String × Int).snd 
/- ("hi", -6) -/
```

Now, it would get very annoying very fast if one had to write manual implementations for every function like `.fst` and `.snd` for every single type with one constructor. Fortunately, `structure` exists:
```lean
structure Prod (α : Type) (β : Type) where
  mk ::
    fst : α
    snd : β
```

Here, `mk` is the name of the constructor, and we can name all our fields to get our desired projection functions automatically. The `mk ::` line can actually be omitted, the constructor will just take on the default name which, in this case, happens to still just be `mk`.

One silly thing that we can do (which will actually turn out to be extremely useful) is we can define a _dependent product type_ where the type of the second element in the tuple depends on the value of the first element.

```lean
structure Sigma {α : Type} (β : α → Type) where
  mk ::
    fst : α
    snd : β fst
```

Confusingly, this type is called the Sigma (Σ, `\Sigma`) type despite being analogous to the Cartesian product! This is because it is paired with the _dependent function type_, which is also called Pi (Π, `\Pi`). I suppose there is some category where the Sigma type is actually the coproduct, but I dunno. ¯\\_(ツ)_/¯

Similar to how one could write a dependent function as `(a : α) → β a`, you can write `Sigma β` as `Σ(a : α), β a`.

## Unit and Empty
In addition to `Sum` and `Prod` or Sigma and Pi, there is another pairing of types that you should know. Like `Sum` and `Prod`, these two types are dual to each other. Let's begin with the `Unit` type, which is the type of an empty tuple.

```lean
inductive Unit where
| unit : Unit
```

This type is the equivalent of a singleton set, and it has a single element, written as `()`. Rust fans should recognize this guy. Conversely, on the other side of the duality is the empty type:

```lean
inductive Empty where
```

This is the equivalent of the empty set, and this one is a bit weird. In particular, let's take a look at the recursor:

```lean
axiom Empty.rec (motive : Empty → Type) (t : Empty) : motive t
```

We have no constructors, so we have no cases at all to take care of in our match statement. However, this is a bit bizarre: given some `t : Empty`, we can use an empty `match` statement to construct quite literally anything we'd like without providing any definitions at all! In reality, this is completely fine as it is impossible to get a term of an empty type-- the type is empty after all (in fancier words, we say it is **uninhabited**). Rust fans might recognize this as the `Never` type, also spelled as `!`. This recursor is exactly why the `!` type can be coerced into any other type whatsoever: it is the initial object in our category. It is perfectly acceptable to define a function `Empty → α` for any type `α` without providing a definition because it will be impossible to call that function anyways. If you want a more formal, mathematical treatment, read this footnote.[^2]

[^2]: We can define a function $f : A \to B$ as a subset $f \subseteq A \times B$ such that $$\forall a \in A, \exists! b \in B, (a, b) \in f$$. If $A = \varnothing$, then the outermost $\forall$ quantifier is vacuously satisfied, and $f \subseteq \varnothing \times B$ so $f = \varnothing$. Thus, formally, the empty function is considered a valid function $\varnothing \to B$, and so $\varnothing \in \text{Hom}(\varnothing, B)$.

```lean
def absurdity {α : Type} : Empty → α := fun e ↦ nomatch e
```

Now we can also recognize that the `Unit` type had the opposite property of being the terminal object: for every type `α`, there always exists exactly one function `α → Unit`-- namely `fun _ ↦ ()`. 


With this, we are ready to start talking about how mathematics is actually done in lean via the **Curry-Howard correspondence**. If you squint a little bit and mentally turn the little `→` arrow into a fat $\implies$ arrow, you might start to notice something.

## The Curry-Howard correspondence

Think about the cases in which functions between `Unit` and `Empty` will exist:
1. If you want `Empty → Unit`, you can always just use the `fun _ ↦ ()` function or a `nomatch`.
2. If you want `Unit → Unit` or `Empty → Empty`, you can always just use the identity `fun x ↦ x`.
3. However, if you want `Unit → Empty`, you are screwed!

There is just no way to construct a term of the `Empty` type, and in fact the function type `Unit → Empty` is also uninhabited like the `Empty` type itself. If you've taken a course in logic, this might remind you of the truth table for logical implication:

| $P$ | $Q$ | $P \implies Q$ |
| --- | --- | -------------- |
| T   |  T  |   T            |
| T   |  F  |   F            |
| F   |  T  |   T            |
| F   |  F  |   T            |

The core idea now is to use inhabited types like `Unit` to represent true propositions and uninhabited types like `Empty` to represent false propositions. For example, we can interpret `2 + 2 = 5` as a type whose terms are precisely the proofs that `2 + 2 = 5`. Then, the function type `P → Q` corresponds to the implication $P \implies Q$ because it is literally taking a proof of `P` and using it to construct a proof of `Q`.

We can also do similar analyses to discover how other types relate to proofs and logical connectives. The `Prod` type we saw earlier corresponds to logical 'and': a proof of $P \land Q$ is a pair consisting of both a proof of $P$ and a proof of $Q$. A term of the type `P × Q` is a tuple consisting of both a term of the type `P` and a term of type `Q`. Likewise, `Sum` corresponds to logical 'or': a proof of $P \lor Q$ is either a proof of $P$ or a proof of $Q$. A term of `P ⊕ Q` is either a term of `P` or a term of `Q`. Logical negation can be defined using the fact that $\lnot P \iff (P \implies \text{False})$.

Finally, universal quantifiers can be handled using dependent function types, and existential quantifiers can be handled with dependent product types. I will explain in more detail in a bit, but see if you can make sense of that.


| Logic             | Types           |
| -----             | -----           |
| True              | `Unit`          |
| False             | `Empty`         |
| $P \lor Q$        | `α ⊕ β`         |
| $P \land Q$       | `α × β`         |
| $\exists x, P\,x$ | `Σ(a : α), β a` |
| $P \implies Q$    | `α → β`         |
| $\forall x, P\,x$ | `(a : α) → β a` |
| $\lnot P$         | `α → Empty`     |

Actually, this table is a bit of a lie, because those types I've shown live in the wrong universe! Those types all live in the `Type` universe, but in practice, propositions should live in a special `Prop` universe. This universe is smaller than `Type`, and it lives at the bottom of the universe hierarchy, so we can write `Prop : Type`. This is how lean implements something called **proof irrelevance**: once a proposition is proven, lean would like to stop keeping track of how exactly the proof was obtained. The only thing that matters is that we have a proof of the proposition or that we have a term of the type-- we do not have to keep track in excruciating detail of exactly which type constructors were used.

Thus, types that live in this `Prop` universe are allowed at most one term, meaning that if `P : Prop` and we have two terms `x y : P`, we are guaranteed to have `x = y` definitionally. The types are truncated, and spiritually every type in `Prop` must be either an empty type or a singleton like the unit type. As a result of this, the `Prop` universe has a few very weird properties, but we will come back and cover it in more detail when we talk about type universes. For now, we can define inductive types that live in this universe by writing `: Prop` instead of `: Type` in our declarations:

```lean
structure And (a b : Prop) : Prop where
  intro ::
    left : a
    right : b

inductive Or (a b : Prop) : Prop where
| inl : a → Or a b
| inr : b → Or a b

infixr:35 unicode(" ∧ ", " /\\ ") => And
infixr:30 unicode(" ∨ ", " \\/ ") => Or
```

And just as one could write `α ⊕ β` for `Sum α β`, one could write `a ∧ b` (`a \and b`) for `And a b`. We also have a `Prop` counterpart for the `Sigma` type: just as we could write `Sigma β` and `Σ(a : α), β a`, we can write `Exists p` and `∃(a : α), p a`:

```lean
inductive Exists {α : Type} (p : α → Prop) : Prop where
  | intro (w : α) (h : p w) : Exists p
```

Can you make sense of what the type of `p : α → Prop` means? I will leave it to you to work out the details for the remaining types, but now we can update our table with more detail: 

| Logic             | In `Type`       | In `Prop`       | Names             | Typing              |
| -----             | -----           | -------         | -------           | -----               |
| True              | `Unit`          | `True`          | -                 | -                   |
| False             | `Empty`         | `False`         | -                 | -                   |
| $P \lor Q$        | `α ⊕ β`         | `a ∨ b`         | `Sum`, `Or`       | `\oplus`, `\or`     |
| $P \land Q$       | `α × β`         | `a ∧ b`         | `Prod`, `And`     | `\times`, `\and`    |
| $\exists x, P\,x$ | `Σ(a : α), β a` | `∃(a : α), p a` | `Sigma`, `Exists` | `\Sigma`, `\exists` |
| $P \implies Q$    | `α → β`         | `a → b`         | -                 | `\to`               |
| $\forall x, P\,x$ | `(a : α) → β a` | `∀(a : α), p a` | -                 | `\forall`           |
| $\lnot P$         | `α → Empty`     | `¬a`            | `Not`             | `\not`              |

In the case of `∀(a : α), P a`, there is no difference between writing simply `(a : α) → P a`. Also, note that the types `True` and `False` should not be confused with `true` and `false`, the two terms of the type `Bool`. Check that you can explain the difference to yourself.

There is still a lot more to learn about the `Prop` universe, but at this point, all of this theory is still probably a little nebulous. So, let's finally get some practice proving some theorems!

# Baby's First Steps in Theorem Proving

Let's start by proving one of DeMorgan's identities:

```lean
theorem demorgans {P Q : Prop} (h : ¬P ∧ ¬Q) : ¬(P ∨ Q) :=
  fun hc => match hc with
    | .inl hp => h.left hp
    | .inr hq => h.right hq
```

A few new things are happening here. The keyword `theorem` behaves identically to `def`, except that it can only be used to define a symbol whose type lives in the `Prop` universe (whereas `def` works for any universe). In our case, the symbol `demorgans` has a type of `∀ {P Q : Prop}, ¬P ∧ ¬Q → ¬(P ∨ Q)`, which is indeed a proposition.

To prove this proposition, we are quite literally defining a function that returns a proof of `¬(P ∨ Q)` given a proof `h` of `¬P ∧ ¬Q`. Recall that `¬X` is defined as the function type `X → False`, and note that our hypothesis `h` is a tuple where the first element is a function `P → False` and the second element is a function `Q → False`. To prove our conclusion `¬(P ∨ Q)`, we give a function that takes in a proof `hc` of `P ∨ Q` and derives a contradiction `False`. Since `hc` is an inductive type, we can pattern match on the constructors of `Or`. If `hc` contains a proof of `P`, we can use the first element of `h` (which proves `¬P`) to derive a contradiction, using a normal function application. Similarly, if `hc` is a proof of `Q`, we use the second element of `h`. 

This proof is written in **term mode**, but more conventionally, proofs will be written in **tactic mode**. You can imagine that as proofs become more complicated, you would need to write some very complicated and deeply nested terms. Tactic mode makes writing these proofs a lot nicer, and it is entered using the `by` keyword anywhere in a term expression. One way to write our theorem in tactic mode would be like this:

```lean
theorem demorgans {P Q : Prop} (h : ¬P ∧ ¬Q) : ¬(P ∨ Q) := by
  intro hc
  rcases hc with hp | hq
  · exact h.left hp
  · exact h.right hq
```

Here, we have used the tactics `intro`, `rcases`, and `exact`, which you should think of as small programs that can be used to automatically synthesize terms of some type. (This is somewhat beside the point, but note that the `rcases` tactic is defined in `Mathlib`, so you will have to `import Mathlib` before you can use it.) Anyways, if you hover your cursor directly after the `by`, in your InfoView you should see something like this:

```lean
P Q : Prop
h : ¬P ∧ ¬Q
⊢ ¬(P ∨ Q)
```

We have a list of hypotheses that we have access to, and we have a **goal** displayed after the `⊢`. This is the type of the term we are currently trying to construct. Because this is a function type, we can use the `intro` tactic to move into the body of the function and name the parameter `hc`. The state after `intro` looks like this:

```lean
P Q : Prop
h : ¬P ∧ ¬Q
hc : P ∨ Q
⊢ False
```

Note that this is the same state as if we had written
```lean
theorem demorgans {P Q : Prop} (h : ¬P ∧ ¬Q) : ¬(P ∨ Q) := fun hc => by
```
where we use tactic mode only for the function body instead of dropping into it immediately. Next, we perform pattern matching using the `rcases` tactic. This tactic is special because it splits our state into _two_ goals instead of just one goal:

```lean
case inl
P Q : Prop
h : ¬P ∧ ¬Q
hp : P
⊢ False

case inr
P Q : Prop
h : ¬P ∧ ¬Q
hq : Q
⊢ False
```

Now we have these two cases that we must handle. We can focus on the first goal using the `·` syntax, which one can type as `\.`. Within tactic mode, we can drop back into term mode using the `exact` tactic, and we use this to provide these simple terms. After closing the first goal, we can focus on the remaining goal using another `·` and complete our proof!

Great! Now you have seen an example of how tactic mode might be used in real lean code, but I also want to show you another impractical (yet informative) example. I want to make the point that every tactic is essentially just special case of a tactic called `refine`. For example, we could have written our proof using only `refine`:
```lean
theorem demorgans {P Q : Prop} (h : ¬P ∧ ¬Q) : ¬(P ∨ Q) := by
  refine fun hc => ?_
  refine Or.rec (fun hp => ?_) (fun hq => ?_) hc
  · refine h.left hp
  · refine h.right hq
```

Using `refine`, we can provide a partially constructed term, but we are also allowed to leave holes `?_` in our expression. Each of these holes becomes a new goal that we must close, and every symbol that the hole can "see" is added to our list of hypotheses for that goal.

That about covers it for tactic mode! Of course, there are a ton of tactics in lean, but having seen this pattern, you should be well-equipped to make sense of any new tactic you encounter. Every tactic is simply a way of manipulating the list of hypotheses, the goal state, or both.

Now finally, I have one last word about this `demorgans` example. I draw your attention to the fact that de Morgan's identities consist of four implications that must be proven. We have just proven one, and the converse of that a fun exercise for the reader. Similarly, $\lnot P \lor \lnot Q \implies \lnot(P \land Q)$ can be proven pretty easily too, but if you try to prove the converse of that one, you will find yourself stuck. Try it and see what happens!

This is because so far, all the methods of proof I've shown have been **constructive**, but that statement cannot be proven constructively. I'm no expert in this stuff (wth is intuitionism?) but bear with me. What I mean by this is that the proof of the converse relies on the **law of the excluded middle**, that $P \lor \lnot P$ for all propositions $P$. However, this proof is impossible to _construct_ without knowing what $P$ is, since we _must_ construct either a proof of $P$ or a proof that assuming $P$ leads to a contradiction. We cannot appeal to anything external, and we are stuck.

Of course, there is a way to get out of this pickle, as lean can obviously allow you to use classical reasoning and assume the law of the excluded middle. We will see exactly how it does so in the next post (spoiler: using the axiom of choice), but we will stop here for now.

See you next time!

