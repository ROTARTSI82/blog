---
title: "lean taught right: from the ground up (1 of ?)"
created: "October 9 2026"
---

Hey! It's been a year since I wrote my [first blog post](/granty29/blog/2025/lean-1105/) (honestly, probably don't read that) about lean4 as I was just getting into it, and I wanted to come back and write this post to be the lean tutorial that I wish I had. To me, this is lean4 taught correctly, with an aim towards (slowly) teaching you how all the systems work at a fundamental level. I will start by approaching lean as a programming language and slowly revealing its proof assistant features, mainly because I find this way of thinking about lean to be the most helpful: a programming language that you do math in.

This tutorial will be pretty fast-paced, and I think that the correct way to read this will be to pull open an editor, type out the example code, and explore what's going on by clicking around with the lean **InfoView**. If you are a nerd, you can use the nvim plugin, but normal people use VSCode. And if you're extremely lazy, you can probably get by using the online lean playground at [live.lean-lang.org](https://live.lean-lang.org/). ==I will be including some links to open live leans of my example code in each section==

TODO: more yapping, fundamentally how the system works and not how to actually use it.

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
Here, we are using the builtin types of strings and natural numbers, which have concrete, computable values. Lean is a programming language with a working code generator, and we can compile this function into executable machine code that would do what you'd expect. Like Haskell, we write function calls without parenthesis (i.e. `toString n`), and we use the `++` operator to concatenate strings and lists. The keyword `def` is used defining both functions and constants, and we can both `#check` the type of an expression and `#eval` its value:

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


# (Dependent) Types

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
Much of the complexity of the recursor's type simply comes from the fact that we need to handle all possible dependent typings. The `motive` parameter is how we do it, as it will tell us how the return type depends on the value we are matching on. In our call to `rec`, our motive `fun _ => String` is simply a function that ignores its input and returns the `String` type. Thus, `motive Color.red`, `motive Color.green`, and `motive Color.blue` all just evaluate to `String`, and all the different branches of our `match` will have the same type. Then, the rest of the parameters give the values of each subcase/arm of the `match`, and finally one supplies the value to match on. In the general case, thouguh, the recursor must account for the possibility that these branches are all of different types!

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

Now, let's take a bit of a step up and look at some examples of slightly more complicated inductive types. We begin with the classic `Option` monad, also known as `Maybe` in Haskell.

```lean
inductive Option (α : Type) : Type where
| some : α → Option α
| none : Option α
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

Can you figure out what the type of Sum's recursor must be? You can check your work with `#check Sum`.

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

Confusingly, this type is called the Sigma (Σ, `\Sigma`) type despite being a product! This is because it is paired with the _dependent function type_, which is also called Pi (Π, `\Pi`). I suppose there is some sort of duality going on there where the Sigma type is actually the coproduct, but I dunno. ¯\\_(ツ)_/¯

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

We have no constructors, so we have no cases at all to take care of in our match statement. However, this is a bit bizzare: given some `t : Empty`, we can use an empty `match` statement to construct quite literally anything we'd like without providing any definitions at all! In reality, this is completely fine as it is impossible to get a term of an empty type-- the type is empty after all (in fancier words, we say it is **uninhabited**). Rust fans might recognize this as the `Never` type, also spelled as `!`. This recursor is exactly why the `!` type can be coerced into any other type whatsoever: it is the initial object in our category. It is perfectly acceptable to define a function `Empty → α` for any type `α` without providing a definition because it will be impossible to call that function anyways. If you want a more formal, mathematical treatment, read this footnote.[^2]

[^2]: We can define a function $f : A \to B$ as a subset $f \subseteq A \times B$ such that $$\forall a \in A, \exists! b \in B, (a, b) \in f$$. If $A = \varnothing$, then the outermost $\forall$ quantifier is vacously satisfied, and $f \subseteq \varnothing \times B$ so $f = \varnothing$. Thus, formally, the empty function is considered a valid function $\varnothing \to B$, and so $\varnothing \in \text{Hom}(\varnothing, B)$.

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

The core idea now is to use inhabited types like `Unit` to represent true propositions and uninhabited types like `Empty` to represent false propositions. For example, we can interpret `2 + 2 = 5` as a type whose terms are precisely proofs that `2 + 2 = 5`. Then, the function type `P → Q` corresponds to the implication $P \implies Q$ because it is literally taking a proof of `P` and using it to construct a proof of `Q`.

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

Thus, types that live in this `Prop` universe are allowed at most one term, meaning that if `P : Prop` and we have two terms `x y : P`, we are garuanteed to have `x = y` definitionally. The types are truncated, and spiritually every type in `Prop` must be either an empty type or a singleton like the unit type. As a result of this, the `Prop` universe has a few very weird properties, but we will come back and cover it in more detail when we talk about type universes. For now, we can define inductive types that live in this universe by writing `: Prop` instead of `: Type` in our declarations:

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

And just as one could write `α ⊕ β` for `Sum α β`, one could write `a ∧ b` (`a \or b`) for `And a b`. We also have a `Prop` counterpart for the `Sigma` type: just as we could write `Sigma β` and `Σ(a : α), β a`, we can write `Exists p` and `∃(a : α), p a`:

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

# Theorem Proving (pt. 1)

Let's start by proving one of DeMorgan's identities:

```lean
theorem demorgans {P Q : Prop} (h : ¬P ∧ ¬Q) : ¬(P ∨ Q) :=
  fun hc => match hc with
    | .inl hp => h.left hp
    | .inr hq => h.right hq
```

A few new things are happening here. The keyword `theorem` behaves identically to `def`, except that it can only be used to define a symobl whose type lives in the `Prop` universe (whereas `def` works for any universe). In our case, the symbol `demorgans` has a type of `∀ {P Q : Prop}, ¬P ∧ ¬Q → ¬(P ∨ Q)`, which is indeed a proposition.

To prove this proposition, we are quite literally defining a function that returns a proof of `¬(P ∨ Q)` given a proof `h` of `¬P ∧ ¬Q`. Recall that `¬X` is defined as the function type `X → False`, and note that our hypothesis `h` is a tuple where the first element is a function `P → False` and the second element is a function `Q → False`. To prove our conclusion `¬(P ∨ Q)`, we give a function that takes in a proof `hc` of `P ∨ Q` and derives a contradiction `False`. Since `hc` is an inductive type, we can pattern match on the constructors of `Or`. If `hc` contains a proof of `P`, we can use the first element of `h` (which proves `¬P`) to derive a contradiction, using a normal function application. Similarly, if `hc` is a proof of `Q`, we use the second element of `h`. 

This proof is written in **term mode**, but more conventionally, proofs will be written in **tactic mode**. You can imagine that as proofs become more complicated, you would need to write some very complicated and deeply nested terms. Tactic mode makes writing these proofs a lot nicer, and it is entered using the `by` keyword anywhere in a term expression. One way to write our theorem in tactic mode would be like this:

```lean
theorem demorgans {P Q : Prop} (h : ¬P ∧ ¬Q) : ¬(P ∨ Q) := by
  intro hc
  rcases hc with hp | hq
  · exact h.left hp
  · exact h.right hq
```

Here, we have used the tactics `intro`, `rcases`, and `exact`, which you should think of as small programs that can be used to automatically synthesize terms of some type. If you hover your cursor directly after the `by`, in your InfoView you should see something like this:

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

Now finally, I have one last word about this `demorgans` example. You might notice that if you try to prove the converse, that $\lnot (P \lor Q) \implies \lnot P \land \lnot Q$, you get a bit stuck. Try it and see what happens!

This is because so far, all the methods of proof I've shown have been **constructive**, but that statement cannot be proven constructively. I'm no expert in this stuff (wth is intuitionism?) but bear with me. What I mean by this is that the proof of the converse relies on the **law of the excluded middle**, that $P \lor \lnot P$ for all propositions $P$. However, this proof is impossible to _construct_ without knowing what $P$ is, since we _must_ construct either a proof of $P$ or a proof that assuming $P$ leads to a contradiction. But of course, there is a way to get out of this pickle, as lean allows you to use classical reasoning and assume the law of the excluded middle. We will see exactly how it does so shortly (spoiler: using the axiom of choice), but we are currently missing a few prerequisites, so let us keep moving along for now.


# Universes

Finally it is time to address this detail that I have been glossing over: type universes. Recall that ages ago, I told you that `Prop : Type`, and `Type : Type 1`, and `Type 1 : Type 2`, and so on. These universes can also be indexed using the `Sort` keyword, and `Type u` is the same thing as `Sort (u+1)`. This is because `Sort 0` is `Prop`, then `Sort 1` is `Type` (aka. `Type 0`), then `Sort 2` is `Type 1`, and so on. To get a fuller picture of how this hierarchy of universes work, let me first give you an idealized mathematical description of their semantics:

1. Given any two types $X$ and $Y$ from any universe, we can find some universe $\mathcal{U}$ big enough to contain them both, i.e. $X, Y : \mathcal{U}$. This is true even if $X$ and $Y$ are themselves universes.
    - Additionally, if $X : \mathcal{U}_1$ and $\mathcal{U}_1 : \mathcal{U}_2$, then $X : \mathcal{U}_2$. Actually, this is not strictly true, but again this is a useful lie.
2. Given any $X, Y : \mathcal{U}$ in a common universe, we can form a function type $(X \to Y) : \mathcal{U}$ that lives in the same universe.
3. Given any $X : \mathcal{U}$ and a function $\beta : X \to \mathcal{U}$, we can form a dependent function type in the same universe: $((x : X) \to \beta\;x) : \mathcal{U}$. Using a different notation for the `Pi` type, you sometimes might see this written as $\left(\prod\limits_{x : X} \beta\;x\right) : \mathcal{U}$.
4. We can form an inductive type $I : \mathcal{U}$ if every single constructor for $I$ takes parameters whose types live in $\mathcal{U}$.
    - Note that for inductive type families like the product type $(\times)$, we do not consider the parameters to the type family itself. Mathematically, we are thinking of $\times : \mathcal{U} \to \mathcal{U} \to \mathcal{U}$ as a type family defining a new inductive type $\alpha \times \beta$ for each pair of types $\alpha, \beta : \mathcal{U}$. We do not think of a single constructor with type
      $$
      (\times)\mathrm{.mk} : \{\alpha : \mathcal{U}\} \to \{\beta : \mathcal{U}\} \to \alpha \to \beta \to \alpha \times \beta,
      $$
      but rather a family of constructors with type
      $$
      (\alpha \times \beta)\mathrm{.mk} : \alpha \to \beta \to \alpha \times \beta.
      $$
      Thus, $\alpha : \mathcal{U}$ and $\beta : \mathcal{U}$ are not a parameters of the constructor $(\times)\mathrm{.mk}$, but rather they are parameters of the type family $(\times)$. Now, we see it will be valid to have $\alpha\times\beta : \mathcal{U}$ since for all $\alpha, \beta : \mathcal{U}$, the types of the arguments to $(\times)\mathrm{.mk}$ all live in the $\mathcal{U}$ universe.

These rules apply for the normal type universes `Type 0`, `Type 1`, etc., but `Prop` follows some special rules:
1. Given $X : \mathcal{U}$ and $P : \mathrm{Prop}$, we can form a function type $(X \to P) : \mathrm{Prop}$ that still lives in $\mathrm{Prop}$ regardless of how big $\mathcal{U}$ is.
2. Given any $X : \mathcal{U}$ and $P : X \to \mathrm{Prop}$, we can form a dependent function type $((x : X) \to P\;x) : \mathrm{Prop}$. Recall that this is actually the type $(\forall(x : X), P\;x) : \mathrm{Prop}$
3. We can always form an inductive type $I : \mathrm{Prop}$ regardless of the universe levels of types appearing in its constructors.

Try to interpret the special rules for the `Prop` universe. What are they telling us, and why do we need them?

Now, let's see how all of this is reflected in lean. First, we should note how universe variables work. They are 

> And there is more: While we could consider `List` as a literal function from `Type` to `Type`, here we explicitly do NOT think of `Type` as a function from the naturals to `Type ∞` or something like that. Not only does `Type ∞` not exist, the numbering of 1, 2, 3 are not the same as the integers `Int` or the natural numbers `Nat` in Lean-- they are completely unrelated, and they are not objects inside of Lean's type theory at all. They exist on the level of the _metatheory_, and we just happen to write `Type 1` and `Type 2` because it is a convenient notation. We just as well could have called this heirarchy `UniverseOne : UniverseTwo` and `UniverseTwo : UniverseThree` and so on.
> 
> Anyways, what's the point of all this? So far this might all seem like a load of very confusing abstract nonsense, but it is _cool_ abstract nonsense. See, I lied a little when I said that `List` was a function from `Type` to `Type`. In fact, `List` is an infinite family of functions: for every universe level `u`, there is a function `List.{u}` from `Type u` to `Type u`! This is something called _universe polymorphism_.

==todo==

Unlike many other languages, Lean's type universes are _not_ cumulative. This means that if $X : \mathcal{U}_1$ and $\mathcal U_1 : \mathcal U_2$, it is not true that $X : \mathcal{U}_2$. We do this to make type checking easier, as every type is a term in exactly one universe.



## Propositional Equality

```lean
inductive Eq {α : Sort u} (a : α) : α → Prop where
  | refl : Eq a a
```


```lean
axiom Eq.rec {α : Sort u} {a✝ : α} {motive : (a : α) → a✝ = a → Sort u_1}
  (refl : motive a✝ (Eq.refl a✝))
  {a✝¹ : α} (t : a✝ = a✝¹) : motive a✝¹ t
```



## The Axiom of Choice
To resolve this problem, the approach that lean chooses is to make available the infamous **axiom of choice**. By the way of something called **Diaconescu's Theorem**, the axiom of choice actually implies the law of the excluded middle. Don't ask me about the details, but this works. In lean, the axiom of choice can be stated like so:

```lean
axiom Exists.choose {α : Sort u} (h : ∃(a : α), True) : α
```

Ok, I must admit that I am lying just a little: the real `Classical.choice` axiom in lean is phrased slightly differently, but it is logically equivalent to doing it like this. Note that the `axiom` keyword behaves similarly to `def` or `theorem` in that it introduces a symbol with a given type, but it does not require you to provide any definition or proof! The symbol (which can act as the proof of some mathematical statement) is just taken be defined axiomatically. This axiom says that given a proof that some value of type `α` must exist, then I must be able to construct a real term of the type `α`. Philosophically, we can understand that this axiom is nonconstructive because merely proving that something exists does not necessarily give us an algorithm to actually construct it. Thus, this is a `noncomputable` function.

If you continue to look at this definition, however, you might notice that this looks exactly like a projection out of the `Exists` type. You should wonder: why can't we just provide a real definition for this function?

```lean
def Exists.choose {α : Sort u} (h : ∃(a : α), True) : α :=
  match h with
  | .intro a _ => a
```

This looks like it might work, but we run into the weirdness of the `Prop` universe here. We are crossing from the `Prop` universe into the `Type` universe using a `match`, and this process of crossing universes is called **large elimination**. There are some restrictions on when we are able to do large elimination that prevent us from defining `Exists.choose` as above. This is to prevent logical inconsistencies: remember that because of proof irrelevance, two proofs of existence are considered definitionally equal, even if different values were used to construct them! Thus, for example, we might have this:

```lean
def IsEven (n : Nat) : Prop :=
  ∃(k : Nat), 2*k = n

theorem exists_even_v1 : ∃(n : Nat), IsEven n := ⟨2, ⟨1, rfl⟩⟩
theorem exists_even_v2 : ∃(n : Nat), IsEven n := ⟨4, ⟨2, rfl⟩⟩

theorem does_two_equals_four : exists_even_v1.choose = exists_even_v2.choose := rfl
```

We have not covered how equality works in lean, but just know that it is an inductive type that can be proven using reflexivity `rfl`. The proof above is actually accepted by lean, but it is perfectly fine as `exists_even_v1` is considered definitionally equal to `exists_even_v2`, and `.choose` is noncomputable. Outside of the `Prop` universe, the values `2` and `4` used to prove that there exists an even number cannot be recovered, as if you were able to do that, you would be able to prove that `2 = 4`. Still, within the `Prop` universe, you are allowed to do pattern matching perfectly fine, as long as those values never escape `Prop`. I'm deliberately being a bit vague here, and I plan to cover some more details once we understand universe. ==todo: move this section later?==



# Recursive Inductive Types

At this point in our journey, we have yet to meet a very important class of inductive types: the recursive inductive type. This category includes types like `Nat`, `List`, and `String`, and what makes them _recursive_ is the fact that `Nat` has a constructor that takes in a `Nat` parameter, `List` has a constructor with a `List` parameter, and so on. You can construct a new `Nat` by adding one to an existing `Nat`, and you can make a new `List` by prepending an element to the front of an existing `List`. Let's start with the `Nat` type, which is defined like so:

```lean
inductive Nat where
  | zero : Nat
  | succ : Nat → Nat
```
As you'd expect, you can pattern match on `Nat` like any other inductive type, but because `Nat` is a _recursive_ inductive type, we are able to define _recusrive_ functions like so:

```lean
def factorial (t : Nat) : Nat :=
  match t with
  | 0 => 1
  | n+1 => (n + 1) * factorial n 

#eval factorial 5  /- 120 -/
```

Notice how our definition of `factorial` is recursive, where the value of `factorial (n + 1)` depends on the value of `factorial n`. Let's take a closer look at what is happening under the hood with the `Nat` type's recursor:

```lean
axiom Nat.rec {motive : Nat → Sort u}
  (zero : motive Nat.zero)
  (succ : (n : Nat) → motive n → motive n.succ)
  (t : Nat) : motive t
```

Focus on the `succ` parameter: this corresponds to the arm of the `match` statement for the `n + 1` case where we must come up with a value of type `motive (n + 1)`. Notice how not only are we supplied with the value of `n` passed into the `Nat.succ` constructor, but we are also supplied with the value (of type `motive n`) for the result of a recursive call. We can rewrite `factorial` like so:

```lean
def factorial (t : Nat) : Nat :=
  Nat.rec 1 (fun n prev => (n + 1) * prev) t

#eval factorial 5  /- still 120 -/
```
Notice how this definition does not involve any recursive call at all! By taking the existence of these recursors as an axiom, this approach sidesteps the need to get fixed points with something like the Y-combinator. In fact, _all_ recursion in lean is based on this principle, which is known as **structural recursion**. Under the hood, our recursive call got rewritten to be a call to `Nat.rec`. Additionally, since the inputs must get smaller at each step, all recursion in lean is garaunteed to terminate eventually. If you want to write a function that does not terminate, you must explicitly annotate the function as `partial`, but then you would not be able to use it in any proofs.

Another thing to note: consider the case where the universe level `u` is 0, so we have `{motive : Nat → Prop}` in the recursor `Nat.rec`. In this case, the type of `Nat.rec` corresponds exactly to the principle of induction on the natural numbers! I draw this parallel because I want to remind you of an important fact that you may be familiar with: induction implies strong induction. Thus, using a similar trick, we are able to define recursive functions like `fib`, which depends on both `fib (n - 1)` and `fib n` in order to calculate `fib (n + 1)`.

```lean
def fib (t : Nat) : Nat :=
  match t with
  | 0 => 1
  | n+1 => fib (n - 1) + fib n

def fib₂ (t : Nat) : Nat × Nat :=
  Nat.rec ⟨1, 1⟩ (fun _ prev => ⟨prev.snd, prev.fst + prev.snd⟩) t

#eval fib 6         /- 21 -/
#eval (fib₂ 6).snd  /- 21 -/
```

In fact, we have a much more general trick: any algorithm that provably terminates can be written as a structural recursion. Lean's `WellFounded.fix` function does exactly this, turning a proof of termination into a structural recursion that actually computes the function. Honestly, I haven't looked deeply into how it works, but the general idea is that if we show the arguments are monotonically decreasing with respect to a well-founded partial order, we are able to show termination and thus perform structural recursion. Lean has a lot of magic and automation so we don't often have to worry about this.

We will come back and do more math with the natural numbers when we are ready, but first let us round out our picture of recursive inductive types. Of course, for completeness, the constructor of `List` is what you might expect:

```lean
inductive List (α : Type u) : Type u where
  | nil : List α
  | cons (head : α) (tail : List α) : List α
```

In general, these inductive types are characterized by the fact that they behave similarly to binary trees: for the type `α`, each constructor is recursive in the sense that it takes as parameters some number `α`s. Nothing is stopping us, however, of being recursive in a fancier way: the constructors are allowed to take in functions ultimately returning `α`. Such a function can be thought of as a set of `α`s indexed by the type of its argument, and this method can be used to define an `α`-constructor that is recursive over infinitely many `α`s. Let's start with a finite example though: take here these two ways to write the type of binary trees, where both of these types are isomorphic:

```lean
inductive BinTree where
  | leaf : BinTree
  | node (left : BinTree) (right : BinTree) : BinTree

inductive BinTree₂ where
  | leaf : BinTree₂
  | node (children : Bool → BinTree₂) : BinTree₂
```

And here are the types of their recursors, which you can verify do essentially the same thing but phrased slightly differently:
```lean
axiom BinTree.rec {motive : BinTree → Sort u} (leaf : motive BinTree.leaf)
  (node : (left right : BinTree) → motive left → motive right → motive (left.node right))
  (t : BinTree) : motive t
axiom BinTree₂.rec {motive : BinTree₂ → Sort u} (leaf : motive BinTree₂.leaf)
  (node : (children : Bool → BinTree₂) → ((a : Bool) → motive (children a))
          → motive (BinTree₂.node children))
  (t : BinTree₂) : motive t
```

As you can see, the types of recursors can start to become very complicated! I will try to give an explanation for how one can derive the type of the recursor from the types of the constructors, but honestly the best way to learn is to play around with it yourself. You should take some time, defining your own inductive types with whacky constructors and reading the type of `Type.rec`. When I was first learning this stuff, I spent a lot of time doing this, and I think you should too. If you want to learn more, you can google for **W-types**, which is the very general way of handling these things in type theory.

Here's my attempt at explaining the rules: say you have a `α`-constructor `c : X₁ → X₂ → ... → α`. Obviously, a constructor for the type `α` must ultimately return a value of that type. The recursor begins with a `motive : α → Type`, and it takes in a parameter for each possible constructor of `α`. For the argument corresponding to `c` (this is called a **minor premise**), we have a function that must take in all the same arguments as `c` and returns some `motive (c x₁ x₂ ...)`. Here, the lowercase `xₙ`s represent the values of the argument in the minor premise for the corresponding `Xₙ`-- this thing is dependently typed. Additionally, if any of the `Xₙ` types is either `α` or a function that ultimately returns `α`, we need to add additional parameters to the minor premise. Let's say `Xₙ` is some type `A₁ → A₂ → ... → α`. To the minor premise, we add a new parameter `Pₙ` with the basically the same types as `Xₙ`, except we replace any occurence of `α` with `motive (xₙ a₁ a₂ ...)` where the `aₙ`s are values of the dependently typed parameters of `Pₙ`. Ok, that explanation might have been entirely unhelpful, so your best bet is probably just to ignore it and play around with this stuff yourself.

<details>
<summary>
Ok, got it? Cool. If you're itching for more, know that it can get even more complicated! If, however, your head is hurting or you just don't care, you can freely skip reading these details.
</summary>


Anyways, we can have **nested inductive types** that end up with multiple motives:

```lean
inductive ONat where
  | mk : Option ONat → ONat
```

```lean
axiom ONat.rec {motive_1 : ONat → Sort u} {motive_2 : Option ONat → Sort u}
  (mk : (a : Option ONat) → motive_2 a → motive_1 (ONat.mk a))
  (none : motive_2 none)
  (some : (val : ONat) → motive_1 val → motive_2 (some val))
  (t : ONat) : motive_1 t
```

This type is clearly the same as our original definition of the natural numbers, where `ONat.mk none` is `Nat.zero` and `ONat.mk (some n)` is `Nat.succ n`. Can you make sense of what is happening with the recursor, and why it should ultimately be equivalent to `Nat.rec`?

Under the hood, nested inductive types are rewritten to be two _mutual recursive_ inductive types. One can imagine that this is what's happening:

```lean
mutual
  inductive ONat where
  | mk : OptionONat → ONat

  inductive OptionONat where
  | none : OptionONat
  | some : ONat → OptionONat
end
```

Here, `OptionONat` would have the following recursor:
```lean
axiom OptionONat.rec {motive_1 : ONat → Sort u} {motive_2 : OptionONat → Sort u}
  (mk : (a : OptionONat) → motive_2 a → motive_1 (ONat.mk a))
  (none : motive_2 OptionONat.none)
  (some : (a : ONat) → motive_1 a → motive_2 (OptionONat.some a))
  (t : OptionONat) : motive_2 t
```

We can see it has essentially the same minor premises as `ONat`'s recursor, but it takes a **major premise** of type `t : OptionONat` instead of `t : ONat` and returns a `motive_2 t` instead of a `motive_1 t`. Can you see how the rules for coming up with a recursor's type can be extended to mutually recursive types? Notice how we get a minor premise for each constructor of every type in the `mutual` block, and notice how any appearance of `ONat` in any constructor triggers an appearance of a `motive_1 ...` parameter, and how any appearance of `OptionONat` in any constructor triggers the appearance of a `motive_2 ...` parameter. Also, notice how the two motives' universe levels are not independent: they both must live in the same universe level `Sort u`.

</details>


Alright, one final word before we move on. There is a very important rule that all constructors of all inductive types must follow: **strict positivity**. Let's say we have some inductive type `α` with a constructor `c : X₁ → X₂ → ... → α`. You might have noticed that we restricted ourselves to discussion only the cases where the `Xₙ` types are either:

1. Entirely unrelated to `α` (not recursive),
2. Just the `α` type itself,
3. A function that returns `α`, or
4. An inductive type with `α` as a parameter (discussed in the collapsable section above).

Notably missing from this list is the case where `Xₙ` is a function type that takes `α` as a parameter, and that is for good reason. In type theory lingo, we would say that `α` has appeared in a non-positive position, and allowing such an occurence leads to a logical paradox:

```lean
inductive Nonpositive : Type
| mk : (Nonpositive → False) → Nonpositive

def selfApply (b : Nonpositive) : False := 
  match b with
  | .mk f => f b

def val : Nonpositive := Nonpositive.mk selfApply
def falsehood : False := selfApply val
```

We have proven `False`! The core issue is that by allowing nonpositive occurences, we have sneakily opened the door to infinite recursion. Computationally, `Nonpositive.mk selfApply` is an infinite loop. As you'd hope for a proof assistant aiming to have a sound type system, lean will reject the code above with the helpful message "'Nonpositive.mk' has a non positive occurrence of the datatypes being declared".


# Other Topics

## Typeclasses


## Other Language features

