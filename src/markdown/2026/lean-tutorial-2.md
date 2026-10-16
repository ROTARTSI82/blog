---
title: "lean tutorial: the type multiverse (1 of ?)"
subhead: "type universes, large elimination, the axiom of choice, and advanced inductive types."
created: "October 15 2026"
tags: "hide-ls"
---

# **==HELLO! THIS IS A WORK-IN-PROGRESS DRAFT OF A POST==**


Welcome back! This is the second post of the series, and you can read the first post at [lean-tutorial-1](/granty29/blog/2026/lean-tutorial-1/).

# Table of Contents
<!-- toc -->


# Universes

Finally it is time to address a detail that I have been glossing over this whole time: type universes. Recall that ages ago, I told you that `Prop : Type`, and `Type : Type 1`, and `Type 1 : Type 2`, and so on. These universes can also be indexed using the `Sort` keyword, and `Type u` is the same thing as `Sort (u+1)`. This is because `Sort 0` is `Prop`, then `Sort 1` is `Type` (aka. `Type 0`), then `Sort 2` is `Type 1`, and so on. To get a fuller picture of how this hierarchy of universes work, let me first give you an idealized mathematical description of their semantics:

1. Every type $X$ is a term in **exactly one** universe $\mathcal{U}_i$. This is true even when $X$ is a universe, in which case we use the rule $\mathcal{U}_i : \mathcal{U}_{i+1}$.
    - In this regard, lean is unlike some other languages, which have _cumulative_ universes. In that case, if $X : \mathcal{U}_i$ and $\mathcal{U}_i : \mathcal{U}_j$, then $X : \mathcal{U}_j$. By eschewing cumulative universes, lean makes typechecking easier at the cost of a little bit of extra boilerplate.
2. Given some $X : \mathcal{U}_i$ and some $Y : \mathcal{U}_j$, we can form a function type $(X \to Y) : \mathcal{U}_{\max(i, j)}$.
3. Given any $X : \mathcal{U}_i$ and a function $\beta : X \to \mathcal{U}_j$, we can form a dependent function type $((x : X) \to \beta\;x) : \mathcal{U}_{\max(i,j)}$.
    - Using a different notation for the `Pi` type, you sometimes might see this written as $\left(\prod\limits_{x : X} \beta\;x\right) : \mathcal{U}_{\max(i,j)}$.
4. We can form an inductive type $I : \mathcal{U}_i$ if across all of its constructors, every constructor argument has a type whose universe level is $\mathcal{U}_i$ or smaller. This is the only rule that lets you "skip" universe levels!
    - When I say "constructor argument", I specifically exclude _indices_ and _parameters of the inductive type family_ itself. We will have a fuller understanding for what those are later, but for now let's work through the example of the product type `Prod`, which can have the type $\times : \mathcal{U}_i \to \mathcal{U}_j \to \mathcal{U}_{\max(i,j)}$. Mathematically, we are thinking of $(\times)$ as a type family defining a new inductive type $\alpha \times \beta : \mathcal{U}_{\max(i,j)}$ for each pair of types $\alpha : \mathcal{U}_i$ and $\beta : \mathcal{U}_{j}$. Then, we do not think of a single constructor with type
      $$
      (\times)\mathrm{.mk} : \{\alpha : \mathcal{U}_i\} \to \{\beta : \mathcal{U}_j\} \to \alpha \to \beta \to \alpha \times \beta,
      $$
      but rather we consider a family of constructors with type
      $$
      (\alpha \times \beta)\mathrm{.mk} : \alpha \to \beta \to \alpha \times \beta.
      $$
      Thus, the values $\alpha$ (which has type $\mathcal{U}_i : \mathcal{U}_{i+1}$) and $\beta$ (which is a $\mathcal{U}_j : \mathcal{U}_{j+1}$) are not counted as arguments of some constructor $(\times)\mathrm{.mk}$. Instead, they are parameters of the type family $(\times)$. Then, we see it will be valid to have $\alpha\times\beta : \mathcal{U}_{\max(i,j)}$ since for all $\alpha$ and $\beta$, the types of the arguments to $(\alpha \times\beta)\mathrm{.mk}$ all live in universes less than or equal to $\mathcal{U}_{\max(i,j)}$. If, instead, we had erroneously counted the implicit parameters in $(\times)\mathrm{.mk}$, we would have arrived at the conclusion that $\alpha\times\beta$ must live in a universe at least as big as $\mathcal{U}_{\max(i,j)+1}$, which is not correct!


These rules can be pretty confusing, so make sure to play around with `#check`ing universe levels yourself. The tricky part in doing this is that we are often talking about the universe level of the type of a some value, which might be somewhat unfamiliar. You've got multiple levels of types!

But wait-- these rules we've seen so far only apply for the normal type universes `Type 0`, `Type 1`, etc. The `Prop` universe is a very important exception:

1. Given $X : \mathcal{U}$ and $P : \mathrm{Prop}$, we can form a function type $(X \to P) : \mathrm{Prop}$ that still lives in $\mathrm{Prop}$ regardless of how big $\mathcal{U}$ is.
2. Given any $X : \mathcal{U}$ and $P : X \to \mathrm{Prop}$, we can form a dependent function type $((x : X) \to P\;x) : \mathrm{Prop}$.
    - Recall that this can also be written as $(\forall(x : X), P\;x) : \mathrm{Prop}$
3. We can always form an inductive type $I : \mathrm{Prop}$ regardless of the universe levels of types appearing in its constructors.

Try to interpret the special rules for the `Prop` universe. What are they telling us, and why do we need them?

In lean, we have the ability to declare _universe variables_, which we conventionally name `u`, `v`, etc. You can declare type universe variables with a `universe` statement and use them like so:
```lean
universe u v

def Hom (X : Type u) (Y : Type v) : Type (max u v) :=
  X → Y

#check Hom  /- Hom.{u, v} (X : Type u) (Y : Type v) : Type (max u v) -/
#check ((fun x ↦ x + 1) : Hom.{0, 0} Nat Nat)
#check ((fun X ↦ X → Prop) : Hom.{1, 1} Type Type)
```

Notice how our definition is now written `Hom.{u, v}`, indicating that it is **polymorphic over universes**. It looks a lot like we have added two extra parameters, even if they use this funky syntax. However, a word of caution: even though these look a lot like the natural numbers `Nat`, they are something completely different! They are not objects within lean's type theory, but rather part of the metatheory. Think of them as behaving like templates or generics; they are just a systematic way to refer to universes within the hierarchy, and they just as well could have been called `UniverseOne : UniverseTwo`, `UniverseTwo : UniverseThree`, etc. Although we were allowed to think of `List` as a literal function `Type u → Type u`, we are explicitly _not_ allowed to think of `Type` or `Sort` as functions like `Nat → Type ∞`. There is no such thing as `Type ∞`, and universe indices are not natural numbers!

Another detail I want to draw your attention to is how we have defined `Hom` to work only on `Type`s and not general `Sort`s. Think back to how the `Prop` universe (aka. `Sort 0`) behaves like an edge case: if we had some `X : Sort u` and some `Y : Sort 0`, the function type `X → Y` will live in `Sort 0` and not `Sort (max u 0)`. Luckily, lean provides a special function `imax` designed specifically to handle this situation. The 'i' in `imax` stands for _impredicative_, and the function is defined like so:
$$
\mathrm{imax}(u, v) = \begin{cases}0 & \text{if } v = 0 \\ \max(u, v) & \text{otherwise}\end{cases}
$$

Thus, we can extend our definition of `Hom` to include all `Sort`s like so:
```lean
def Hom (X : Sort u) (Y : Sort v) : Sort (imax u v) :=
  X → Y
```
If you want to read about universes in more detail, the [Lean Language Reference](https://lean-lang.org/doc/reference/latest/The-Type-System/Universes/) is excellent.

## Elimination on Prop

Ok, that was a lot! We have seen that the `Prop` universe is a special little boy 



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

Ok, I must admit that I am lying just a little: the real `Classical.choice` axiom in lean is phrased slightly differently, but it is logically equivalent to doing it like this. Note that the `axiom` keyword behaves similarly to `def` or `theorem` in that it introduces a symbol with a given type, but it does not require you to provide any definition or proof. The symbol (which can act as the proof of some mathematical statement) is just taken to be defined axiomatically. This axiom says that given a proof that some value of type `α` must exist, then I must be able to construct a real term of the type `α`. Philosophically, we can understand that this axiom is nonconstructive because merely proving that something exists does not necessarily give us an algorithm to actually construct it. Thus, this is a `noncomputable` function.

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
As you'd expect, you can pattern match on `Nat` like any other inductive type, but because `Nat` is a _recursive_ inductive type, we are able to define _recursive_ functions like so:

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
Notice how this definition does not involve any recursive call at all! By taking the existence of these recursors as an axiom, this approach sidesteps the need to get fixed points with something like the Y-combinator. In fact, _all_ recursion in lean is based on this principle, which is known as **structural recursion**. Under the hood, our recursive call got rewritten to be a call to `Nat.rec`. Additionally, since the inputs must get smaller at each step, all recursion in lean is guaranteed to terminate eventually. If you want to write a function that does not terminate, you must explicitly annotate the function as `partial`, but then you would not be able to use it in any proofs.

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
==todo: explain termination_by if lean cannot automatically infer a proof of termination==

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

Here's my attempt at explaining the rules: say you have a `α`-constructor `c : X₁ → X₂ → ... → α`. Obviously, a constructor for the type `α` must ultimately return a value of that type. The recursor begins with a `motive : α → Type`, and it takes in a parameter for each possible constructor of `α`. For the argument corresponding to `c` (this is called a **minor premise**), we have a function that must take in all the same arguments as `c` and returns some `motive (c x₁ x₂ ...)`. Here, the lowercase `xₙ`s represent the values of the argument in the minor premise for the corresponding `Xₙ`-- this thing is dependently typed. Additionally, if any of the `Xₙ` types is either `α` or a function that ultimately returns `α`, we need to add additional parameters to the minor premise. Let's say `Xₙ` is some type `A₁ → A₂ → ... → α`. To the minor premise, we add a new parameter `Pₙ` with the basically the same types as `Xₙ`, except we replace any occurrence of `α` with `motive (xₙ a₁ a₂ ...)` where the `aₙ`s are values of the dependently typed parameters of `Pₙ`. Ok, that explanation might have been entirely unhelpful, so your best bet is probably just to ignore it and play around with this stuff yourself.

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
4. An inductive type with `α` as a parameter (discussed in the collapsible section above).

Notably missing from this list is the case where `Xₙ` is a function type that takes `α` as a parameter, and that is for good reason. In type theory lingo, we would say that `α` has appeared in a non-positive position, and allowing such an occurrence leads to a logical paradox:

```lean
inductive Nonpositive : Type
| mk : (Nonpositive → False) → Nonpositive

def selfApply (b : Nonpositive) : False := 
  match b with
  | .mk f => f b

def val : Nonpositive := Nonpositive.mk selfApply
def falsehood : False := selfApply val
```

We have proven `False`! The core issue is that by allowing nonpositive occurrences, we have sneakily opened the door to infinite recursion. Computationally, `Nonpositive.mk selfApply` is an infinite loop. As you'd hope for a proof assistant aiming to have a sound type system, lean will reject the code above with the helpful message "'Nonpositive.mk' has a non positive occurrence of the datatypes being declared".


# Other Topics

## Typeclasses


## Other Language features

