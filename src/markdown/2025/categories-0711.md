---
title: 'Category Theory with Haskell and Rust'
created: '2025-07-11'
modified: '2025-07-16'
subhead: "A monad is a monoid in the category of endofunctors. What is a category? Functors, monads, initial and terminal objects, etc."
tags: "mathposting"
---

Crash course on category theory stuff I guess. 

I assume some basic background, and will not
be explaining Haskell or Rust concepts in depth. You can read [Learn You A Haskell](https://learnyouahaskell.com/chapters)
for an intro to Haskell.
You should also know that a [monoid](https://en.wikipedia.org/wiki/Monoid) is a set with an associative binary operation
and an identity element.

# Table of Contents
<!-- toc -->

# What is a Category?
A **category** is a collection of **objects** and **morphisms** between objects (like a directed graph).
The objects in a category generalize some algebraic structure, while morphisms generalize functions
between these structures. For example: we can have $\textbf{Set}$, the category of sets.
Objects are sets (say $\varnothing$, $\mathbb{Z}$, or $\{\heartsuit, \diamondsuit, \clubsuit, \spadesuit\}$), and morphisms are functions from one set into another 
(one morphism is a single, specific function between two sets that associates elements from the input set
with exactly one element from the output set). Morphisms also come with the idea
of function composition, so we have the classic **commutative diagram**:

```tikz
% https://q.uiver.app/#q=WzAsMyxbMCwwLCJYIl0sWzEsMCwiWSJdLFsxLDEsIloiXSxbMCwxLCJmIl0sWzEsMiwiZyJdLFswLDIsImdcXGNpcmMgZiIsMl1d
\usepackage{tikz-cd}
\begin{document}
\begin{tikzcd}[scale=4.0,sep=huge]
	X & Y \\
	& Z
	\arrow["f", from=1-1, to=1-2]
	\arrow["{g\circ f}"', from=1-1, to=2-2]
	\arrow["g", from=1-2, to=2-2]
\end{tikzcd}
\end{document}
```

Note: Don't be tempted into thinking that sets are categories (or later that types like `Int` and
`Bool` are categories). We take the perspective that these things (sets and types) are the
objects in the category we are dealing with, NOT the elements of the set or specific instances
of a type.

We can concretely represent a morphism between two sets $f: X \to Y$ using another set: we
simply write out all the (input, output) pairs in a set, where for every element of $X$
there is exactly one associated output from $Y$. We construct these (input, output) pairs
with something called a **Cartesian product**, and we say that $X \times Y$ is the set of all possible $(x, y)$ tuples.

# The Category of $\textbf{Hask}$

$\textbf{Hask}$ is the category of Haskell types. The objects are types in Haskell (like
`Int`, `Bool`, etc.) and the morphisms are normal Haskell functions. Here, we can think of the types
as being sets of all the instances of that type. For example, we can say
```haskell
Int = {0, 1, 2, 3, ...}
Bool = {True, False}
...
```

A point of confusion here for me was that a morphism is a *specific* Haskell function.
On the other hand, the objects are the Haskell types themselves, not specific instances of that type.
Think back to the analogy for $\textbf{Set}$ and how we define functions on a set to
take *elements* of that set and return *elements* of another set. In fact,
we have a mapping from $\textbf{Hask}$ to $\textbf{Set}$:
just associate each type with the set of the instances of that type as described above. 
This mapping between categories from $\textbf{Hask}$ to $\textbf{Set}$ is 
an example of a **functor**, which associates both objects *and* morphisms in $\textbf{Hask}$ to 
corresponding ones in $\textbf{Set}$. We expect this functor $F$ to respect
function composition and obey this commutative diagram:

```tikz
\usepackage{tikz-cd}
\begin{document}
% https://q.uiver.app/#q=WzAsNixbMCwwLCJGKFgpIl0sWzEsMSwiRihZKSJdLFsyLDAsIkYoWikiXSxbMSwyLCJZIl0sWzAsMywiWCJdLFsyLDMsIloiXSxbNCwwLCJGIiwwLHsic3R5bGUiOnsiYm9keSI6eyJuYW1lIjoiZGFzaGVkIn19fV0sWzUsMiwiRiIsMix7InN0eWxlIjp7ImJvZHkiOnsibmFtZSI6ImRhc2hlZCJ9fX1dLFswLDEsIkZmIl0sWzEsMiwiRmciXSxbMCwyLCJGIGdcXGNpcmMgZiJdLFs0LDMsImYiXSxbMyw1LCJnIl0sWzQsNSwiZlxcY2lyYyBnIl0sWzMsMSwiRiIsMCx7InN0eWxlIjp7ImJvZHkiOnsibmFtZSI6ImRhc2hlZCJ9fX1dXQ==
\begin{tikzcd}
	{F(X)} && {F(Z)} \\
	& {F(Y)} \\
	& Y \\
	X && Z
	\arrow["{F g\circ f}", from=1-1, to=1-3]
	\arrow["Ff", from=1-1, to=2-2]
	\arrow["Fg", from=2-2, to=1-3]
	\arrow["F", dashed, from=3-2, to=2-2]
	\arrow["g", from=3-2, to=4-3]
	\arrow["F", dashed, from=4-1, to=1-1]
	\arrow["f", from=4-1, to=3-2]
	\arrow["{g\circ f}", from=4-1, to=4-3]
	\arrow["F"', dashed, from=4-3, to=1-3]
\end{tikzcd}
\end{document}
```

Because we can build this representation of $\textbf{Hask}$ in $\textbf{Set}$,
we call $\textbf{Hask}$ a **concrete category**. 
The $X$-$Y$-$Z$ triangle on the bottom would be in $\textbf{Hask}$, while the $F(X)$-$F(Y)$-$F(Z)$ triangle would be in $\textbf{Set}$.
Also note that $F$ is not invertible! 

In addition to having these mappings between two different categories ($\textbf{Hask}\to\textbf{Set}$), we are also allowed
to have mappings from a category to itself. These are called **endofunctors**, and of course
monads are monoids in the category of endofunctors so we have to understand these. I will talk more about 
endofunctors and monads in the next section, but first we need to address the Curry in the Haskell...

Remember the Cartesian product from $\textbf{Set}$? 
Tuple types in $\textbf{Hask}$ do the same thing: instead of $X\times Y$ we have the type `(x, y)`.
Being a typesystem, $\textbf{Hask}$ also has types for functions, and we can write `x -> y`
to denote the type of functions from type `x` to type `y`.
In this way, morphisms in $\textbf{Hask}$ are also "elements" of these
objects in $\textbf{Hask}$, and $\textbf{Hask}$ is **Cartesian closed** (actually, $\textbf{Set}$ was
Cartesian closed too!). The fact that we have types for functions and a Cartesian product means we can do **currying**:

```haskell
curry :: ((x, y) -> z) -> x -> y -> z
uncurry :: (x -> y -> z) -> (x, y) -> z
```

Mr. Haskell Curry must be proud. Currying is the relationship that any 2-argument function is equivalent to some
1-argument function that returns another 1-argument function (and vice versa). 

Bonus tidbit: Category theorists would call the type `y -> z` an exponential object in $\textbf{Hask}$, written
as $Z^Y$. See the [Wikipedia page](https://en.wikipedia.org/wiki/Exponential_object) for more details, but the 
reason it's "exponential" is that the number of morphisms $Y \to Z$ is literally $|Z|^{|Y|}$: each function
must choose an output from one of $|Z|$ options for each of its $|Y|$ inputs. If you want to look at another commutative diagram (totally optional btw), notice how $\lambda g$ corresponds to
`curry g`:
```tikz
\usepackage{tikz-cd}
\begin{document}
% https://q.uiver.app/#q=WzAsNSxbMCwwLCJYIl0sWzAsMiwiWl5ZIl0sWzIsMCwiWFxcdGltZXMgWSJdLFsyLDIsIlpeWVxcdGltZXMgWSJdLFs0LDIsIloiXSxbMCwxLCJcXGxhbWJkYSBnIiwwLHsic3R5bGUiOnsiYm9keSI6eyJuYW1lIjoiZGFzaGVkIn19fV0sWzIsMywiXFxsYW1iZGEgZ1xcdGltZXMgXFxtYXRocm17aWR9X1kiLDIseyJzdHlsZSI6eyJib2R5Ijp7Im5hbWUiOiJkYXNoZWQifX19XSxbMiw0LCJnIiwyXSxbMyw0LCJcXHRleHR7ZXZhbH0iLDJdXQ==
\begin{tikzcd}
	X && {X\times Y} \\
	\\
	{Z^Y} && {Z^Y\times Y} && Z
	\arrow["{\lambda g}", dashed, from=1-1, to=3-1]
	\arrow["{\lambda g\times \mathrm{id}_Y}"', dashed, from=1-3, to=3-3]
	\arrow["g"', from=1-3, to=3-5]
	\arrow["{\mathrm{eval}}"', from=3-3, to=3-5]
\end{tikzcd}
\end{document}
```


## Monads
Now back to endofunctors! One example of an endofunctor is `List`:
it takes any type `a` to the type `List a`, which is obviously
just a list of `a`s. Since we are mapping from a type to another type,
this is an endofunctor from the category of $\textbf{Hask}$ back into the category of $\textbf{Hask}$.
But in addition to mapping the objects in $\textbf{Hask}$, we also need to come up with a mapping
for all the morphisms in $\textbf{Hask}$, and it turns out that `fmap` is exactly this mapping:

```haskell
fmap :: Functor f => (a -> b) -> f a -> f b
```


`fmap` simply applies the endofunctor (e.g. `List`) to a morphism like `do_something :: a -> b`. Note that with
`fmap`, we are talking about `List do_something` (that's not valid Haskell but you get it) and not `List (a -> b)`, which is dealing with the
*object* `a -> b` (the type) and not the *morphism* `do_something` (the actual function).
Remember currying: we want to interpret `fmap` as a function that takes in a function and returns a new
function that acts on lists rather than raw `a`s and `b`s. The alternative interpretation
is that `fmap` takes in two arguments: a function to map over a list and a list to map over,
returning the result of applying that function over the list. However, this interpretation
is less useful when we're thinking about monads.

To make `List` into a **monad**, not just an endofunctor (a monad is like a subclass of endofunctors),
we need additional structure in the form of a
multiplication $\mu$ and a unit $\eta$, called `join` and `return` respectively. Technically,
[wikipedia](https://en.wikipedia.org/wiki/Monad_(category_theory))
defines these as **natural transformations** ("morphisms of functors") but we can
do the same thing without opening that can of worms (for now):

```haskell
join :: Monad m => m (m a) -> m a
return :: Monad m => a -> m a
```

Here, `join` simply flattens the list by one level, and `return` returns a singleton list
with one element (whatever we pass into it). Note the difference between `List` itself
and `return`: `List` is a functor acting on Haskell types and Haskell functions (morphisms),
while `return` is a morphism that maps specific instances of Haskell types to instances of the list type.
The purpose of these operations is probably better understood with the most famous monad: `Maybe`. A `Maybe`
is like a `List` that can have 0 or 1 elements: it can be either a `Nothing`, or a `Something value`.

In functional programming, instead of using exceptions, we may want to make
a function return something like a `Maybe Int` when it might fail. For example,
it might return `Something 2` when it succeeds, or a `Nothing` when it fails. Let's look at an example of `join`:

```haskell
-- these functions can make `Maybe Int`s by using Maybe's `return`.
func_might_fail :: Int -> Maybe Int
compute_something :: Int -> Maybe Int

result = func_might_fail 2

-- this is the same thing as writing `result >>= compute_something`, where >>= is monad bind.
final_result = join (fmap compute_something result)
```

Here, we have two functions that might fail: `func_might_fail` and `compute_something`. We
wanted to compose them together, but we ran into the problem that `fmap compute_something (func_might_fail 2)`
would be a `Maybe Maybe Int`. Thankfully, `join` can take us back to a `Maybe Int` by erasing information
about where specifically our operation failed: we can no longer distinguish between an error in `func_might_fail`
(where we get `Nothing`) and an error in `compute_something` (we get `Something Nothing`).

With this, we can define a really nice operation for composing these functions called **Kleisli composition**:
```haskell
(>>=) :: Monad m => m a -> (a -> m b) -> m b

-- (g <=< f) = \x -> join (fmap g (f x))
(<=<) :: Monad m => (b -> m c) -> (a -> m b) -> a -> m c

(.) :: (b -> c) -> (a -> b) -> a -> c
```

Notice how `(<=<)` mirrors the normal function composition `(.)`. 
This means that we have the following **monoid** properties on the functions `f`, `g`, and `h`:
```haskell
return <=< f = f                   -- Left-identity
f <=< return = f                   -- Right-identity
(f <=< g) <=< h = f <=< (g <=< h)  -- Associativity
```

We have a monoid! This isn't exactly the famous monoid in the category of endofunctors though, but I'll
explain that after we cover natural transformations.

Bonus fun fact: functions are monads too! Consider `(a ->)`. Here `fmap` is just normal function composition `(.)`,
`return` builds a constant function, and `join` just feeds in the input value twice to unwrap
the inner function.

# Natural Transformations 💀

**Natural transformations** are mappings between two functors. These two functors
must have the same signature (map between the same two categories $\mathcal{C}$ and $\mathcal{D}$) in order for us to have
a natural transformation, so say we had two functors $F, G: \mathcal{C} \to \mathcal{D}$.
We can then think about some natural transformation $\alpha : F \to G$.
You can think of functors as morphisms in the category of categories, and natural transformations
are morphisms in the category of functors between $\mathcal{C}$ and $\mathcal{D}$. 

Just as morphisms in $\textbf{Set}$ (functions on sets) are just a list of
(input, output) pairs, we can construct natural transformations in a similar way: 
for every object $X$ in $\mathcal{C}$ we need a way to go from $F(X)$ to $G(X)$.
Thus, our natural transformation $\alpha$ is just a collection of morphisms in $\mathcal{D}$
that work nicely with all morphisms $f$ in $\mathcal{C}$:
$$
\alpha_X : F(X) \to G(X)
$$

```tikz
\usepackage{tikz-cd}
\begin{document}
% https://q.uiver.app/#q=WzAsNixbMiwwLCJGKFgpIl0sWzIsMiwiRihZKSJdLFs0LDIsIkcoWSkiXSxbNCwwLCJHKFgpIl0sWzAsMCwiWCJdLFswLDIsIlkiXSxbMCwxLCJGZiJdLFszLDIsIkdmIl0sWzAsMywiXFxldGFfWCJdLFsxLDIsIlxcZXRhX1kiXSxbNCw1LCJmIl1d
\begin{tikzcd}
	X && {F(X)} && {G(X)} \\
	\\
	Y && {F(Y)} && {G(Y)}
	\arrow["f", from=1-1, to=3-1]
	\arrow["{\alpha_X}", from=1-3, to=1-5]
	\arrow["Ff", from=1-3, to=3-3]
	\arrow["Gf", from=1-5, to=3-5]
	\arrow["{\alpha_Y}", from=3-3, to=3-5]
\end{tikzcd}
\end{document}
```

Now we can understand how the monad unit $\eta : 1_\mathcal{C} \to T$ and multiplication $\mu : T \circ T \to T$ are natural transformations.
Here, $1_\mathcal{C}$ is the identity functor that maps $\mathcal{C}$ back to itself without modification,
and $T \circ T$ is functor composition (e.g. a list of lists).
Thus, $\eta$ is just a collection of `return` morphisms, one for every object (every type in $\textbf{Hask}$), and
$\mu$ is similarly a collection of `join` morphisms. This new perspective is useful
for talking about the category of endofunctors in $\textbf{Hask}$.

## A Monoid in the Category of Endofunctors
This is even more abstract nonsense but here goes! A **monoid** in category theory is slightly different
from the familiar definition of a set with an associative binary operation and a unit. In category theory,
a monoid is an object $M$ in some category. This object $M$ must have a morphism $\eta : I \to M$ that gives
the identity element, and a morphism $\mu : M \otimes M \to M$ that defines the monoid's binary operation.
If we consider $M$ to be an object in the category of $\textbf{Set}$, we recover our usual definition of a
monoid: the set has some elements, and there is a multiplication on those elements and an identity element. Note
that the $I$ object in $\textbf{Set}$ would be the singleton set (a set with one element).

Notice how this exactly lines up with our monad $T$, if we consider it to be an object in the category of
endofunctors on $\textbf{Hask}$. Remember how we defined our monad's $\mu$ and $\eta$ to be natural transformations on
$\textbf{Hask}$? Now that we are working in the category of endofunctors on $\textbf{Hask}$, these become exactly
the morphisms necessary for $T$ (which is an endofunctor on $\textbf{Hask}$ and thus an object in this new category) 
to be considered a monoid. And obviously the $I$ object is $\textbf{1}_\mathcal{C}$, the identity endofunctor that
does nothing, as we saw in the definition for $\nu$.

But there's also a subtle problem in our initial definition of a monoid: morphisms must be between objects of the same category,
so for us to have a $\mu : M \otimes M \to M$, we need $M \otimes M$ to be an object in our initial category!
This leads us to the restriction that a monoid must be an object in a **monoidal category** (I'm not going to lie,
this is *very* confusing terminology but roll with it). A category $\mathcal{C}$ is a monoidal category
if there is a bifunctor $\otimes : \mathcal{C}\times\mathcal{C}\to\mathcal{C}$ where $\mathcal{C}\times\mathcal{C}$
is what's called a **product category** (this is the exact same idea as a Cartesian product which we saw before,
and the category of categories is Cartesian closed).

In the category of endofunctors, this $\otimes$ functor just evaluates the composition
of endofunctors (i.e, we take in two endofunctors and return another endofunctor: the result of composing
one with the other). Just as $T$ (e.g. the `List` monad) is an endofunctor, so is $T\circ T$ (or `List List`), so in
the category of endofunctors we can have a morphism $\mu : T^2 \to T$. However, this $\otimes$ functor ends up with
properties mirroring those of $\mu : M \otimes M \to M$: it defines an associative binary operation on the
entire category of $\mathcal{C}$, and the $I$ object in $\mathcal{C}$ ends up acting as an identity for this operation.
Thus, ==a monoidal category is a monoid in the category of categories.== However, this is not the monoid we
are really talking about when we say that a monad is a monoid in the category of endofunctors: we are talking
about the endofunctor $T$ as an object in this category.

### What is an "Element" of an Endofunctor?
But this raises a natural question. Our usual definition of a monoid dealt with a binary operation
on the *elements* of the monoid *object* in the category theoretic definition of a monoid.
So what are the "elements" of the $T$ endofunctor? Let us explore the concept of an "element"
of a set and an "instance" of a type in purely category-theoretic terms.

An element $x$ of some set $X$ corresponds exactly with a morphism $f_x : I \to X$, where $I$
is the singleton set. This morphism $f_x$ simply maps the single
element of the singleton set to the element $x$ it corresponds to.
Similarly, an instance `obj :: a` corresponds exactly
with a function `f () = obj`, where `f :: () -> a`. In Haskell, the type `()` is the equivalent of a singleton set:
it is the unit type with exactly one inhabitant (there is only one value it can have, and the value
is also called `()`). 

I don't think there is a generalized way to determine what object we should choose (the equivalent
of a singleton set or unit type)
as the object to define what an "element" is, and honestly idk what the correct choice is. I actually don't
have an answer for this so let's just mess around.
Say we choose the identity functor
$\textbf{1}_\mathcal{C}$. Then, each "element" of the endofunctor $T$ would correspond to a unique
natural transformation $\alpha : \textbf{1}_\mathcal{C} \to T$. Looking at the commutative square that natural
transformations must respect, the only thing I can think of is taking everything to a list of it repeated $n$ times.
In this case I think we end up with the multiplication of non-negative integers as our monoid??? Idk someone help me here.

## More Natural Transformations 💀💀
You did it! Now you understand why a monad is a monoid in the category of endofunctors! But
we can go deeper into category theory land...

Let's make sense of this commutative diagram from the category theory definition of a monad:

```tikz
\usepackage{tikz-cd}
\begin{document}
% https://q.uiver.app/#q=WzAsOCxbMCwwLCJUXjMoWCkiXSxbMiwwLCJUXjIoWCkiXSxbMCwyLCJUXjIoWCkiXSxbMiwyLCJUKFgpIl0sWzQsMCwiVChYKSJdLFs0LDIsIlReMihYKSJdLFs2LDAsIlReMihYKSJdLFs2LDIsIlQoWCkiXSxbMCwxLCJUKFxcbXVfWCkiXSxbMCwyLCJcXG11X3tUKFgpfSIsMl0sWzIsMywiXFxtdV9YIiwyXSxbMSwzLCJcXG11X1giXSxbNCw3LCIiLDAseyJsZXZlbCI6Miwic3R5bGUiOnsiaGVhZCI6eyJuYW1lIjoibm9uZSJ9fX1dLFs0LDYsIlQoXFxldGFfWCkiXSxbNCw1LCJcXGV0YV97VChYKX0iLDJdLFs1LDcsIlxcbXVfWCIsMl0sWzYsNywiXFxtdV9YIl1d
\begin{tikzcd}
	{T^3(X)} && {T^2(X)} && {T(X)} && {T^2(X)} \\
	\\
	{T^2(X)} && {T(X)} && {T^2(X)} && {T(X)}
	\arrow["{T(\mu_X)}", from=1-1, to=1-3]
	\arrow["{\mu_{T(X)}}"', from=1-1, to=3-1]
	\arrow["{\mu_X}", from=1-3, to=3-3]
	\arrow["{T(\eta_X)}", from=1-5, to=1-7]
	\arrow["{\eta_{T(X)}}"', from=1-5, to=3-5]
	\arrow[equals, from=1-5, to=3-7]
	\arrow["{\mu_X}", from=1-7, to=3-7]
	\arrow["{\mu_X}"', from=3-1, to=3-3]
	\arrow["{\mu_X}"', from=3-5, to=3-7]
\end{tikzcd}
\end{document}
```

Here, I write $T^3(X)$ to mean $T(T(T(X)))$, which you can think of as applying the `List`
endofunctor 3 times. Remember that $\mu_X$ is one of the `join` morphisms we just saw, and it is specifically
`join :: List List X -> List X`, flattening a list of $X$s. The morphism 
$T(\mu_X)$ is just the `fmap` of this function, and from here you can probably figure out
what the rest means (some of them replace the subscript `X` with `List X`). 
These two squares boil down to these two equations on `triple_list :: List List List a`
and `single_list :: List a`:
```haskell
join (fmap join triple_list) = join (join triple_list)      -- Left square (associativity)
join (fmap return single_list) = join (return single_list)  -- Right square (identity)
```

(This probably doesn't work in real Haskell since it wouldn't know
you want the `List` monad's `return`, but you get the point.) Now we 
can write the same two commutative squares, but this time in the category of 
endofunctors on $\textbf{Hask}$ where the natural transformations $\eta$ and $\mu$
become morphisms:

```tikz
\usepackage{tikz-cd}
\begin{document}
% https://q.uiver.app/#q=WzAsOCxbMCwwLCJUXjMiXSxbMiwwLCJUXjIiXSxbMCwyLCJUXjIiXSxbMiwyLCJUIl0sWzQsMCwiVCJdLFs0LDIsIlReMiJdLFs2LDAsIlReMiJdLFs2LDIsIlQiXSxbMCwxLCJUXFxtdSJdLFswLDIsIlxcbXUgVCIsMl0sWzIsMywiXFxtdSIsMl0sWzEsMywiXFxtdSJdLFs0LDcsIiIsMCx7ImxldmVsIjoyLCJzdHlsZSI6eyJoZWFkIjp7Im5hbWUiOiJub25lIn19fV0sWzQsNiwiVFxcZXRhIl0sWzQsNSwiXFxldGEgVCIsMl0sWzUsNywiXFxtdSIsMl0sWzYsNywiXFxtdSJdXQ==
\begin{tikzcd}
	{T^3} && {T^2} && T && {T^2} \\
	\\
	{T^2} && T && {T^2} && T
	\arrow["{T\mu}", from=1-1, to=1-3]
	\arrow["{\mu T}"', from=1-1, to=3-1]
	\arrow["\mu", from=1-3, to=3-3]
	\arrow["{T\eta}", from=1-5, to=1-7]
	\arrow["{\eta T}"', from=1-5, to=3-5]
	\arrow[equals, from=1-5, to=3-7]
	\arrow["\mu", from=1-7, to=3-7]
	\arrow["\mu"', from=3-1, to=3-3]
	\arrow["\mu"', from=3-5, to=3-7]
\end{tikzcd}
\end{document}
```

Ok, so applying $\mu$ on the functor $T \circ T$ to get $T$ makes sense, but what the heck do
$\mu T$ and $T \mu$ mean?? This is something called **whiskering**, which is related to the
**horizontal composition** of natural transformations. Going back to the example of a natural transformation
$\alpha : F \to G$ with functors $F, G : \mathcal{C} \to \mathcal{D}$, we can compose a functor $H : \mathcal{D} \to \mathcal{E}$
and get
$$
H\alpha : H \circ F \Rightarrow H \circ G.
$$
```tikz
\usepackage{tikz-cd}
\begin{document}
% https://q.uiver.app/#q=WzAsNixbMiwwLCJbSFxcY2lyYyBGXShYKSJdLFsyLDIsIltIXFxjaXJjIEZdKFkpIl0sWzQsMiwiW0hcXGNpcmMgR10oWSkiXSxbNCwwLCJbSFxcY2lyYyBHXShYKSJdLFswLDAsIlgiXSxbMCwyLCJZIl0sWzAsMSwiW0hcXGNpcmMgRl1cXCxmIl0sWzMsMiwiW0hcXGNpcmMgR11cXCxmIl0sWzAsMywiSFxcLFxcYWxwaGFfWCJdLFsxLDIsIkhcXCxcXGFscGhhX1kiXSxbNCw1LCJmIl1d
\begin{tikzcd}
	X && {[H\circ F](X)} && {[H\circ G](X)} \\
	\\
	Y && {[H\circ F](Y)} && {[H\circ G](Y)}
	\arrow["f", from=1-1, to=3-1]
	\arrow["{H\,\alpha_X}", from=1-3, to=1-5]
	\arrow["{[H\circ F]\,f}", from=1-3, to=3-3]
	\arrow["{[H\circ G]\,f}", from=1-5, to=3-5]
	\arrow["{H\,\alpha_Y}", from=3-3, to=3-5]
\end{tikzcd}
\end{document}
```
This is equivalent to `fmap`ing with the $H$ functor onto all the associated morphisms $\alpha_X$. Whereas
$\alpha$ is a natural transformation on $\mathcal{C} \to \mathcal{D}$ functors, $H\alpha$ is a natural transformation
on $\mathcal{C} \to \mathcal{E}$ functors.

Alternatively, we can have a functor $J : \mathcal{B} \to \mathcal{C}$ and compose like so:
$$
\alpha J : F \circ J \Rightarrow G \circ J.
$$
```tikz
\usepackage{tikz-cd}
\begin{document}
% https://q.uiver.app/#q=WzAsNixbMiwwLCJbRlxcY2lyYyBKXShYKSJdLFsyLDIsIltGXFxjaXJjIEpdKFkpIl0sWzQsMiwiW0dcXGNpcmMgSl0oWSkiXSxbNCwwLCJbR1xcY2lyYyBKXShYKSJdLFswLDAsIlgiXSxbMCwyLCJZIl0sWzAsMSwiW0ZcXGNpcmMgSl1cXCxmIl0sWzMsMiwiW0dcXGNpcmMgSl1cXCxmIl0sWzAsMywiXFxhbHBoYV97SihYKX0iXSxbMSwyLCJcXGFscGhhX3tKKFkpfSJdLFs0LDUsImYiXV0=
\begin{tikzcd}
	X && {[F\circ J](X)} && {[G\circ J](X)} \\
	\\
	Y && {[F\circ J](Y)} && {[G\circ J](Y)}
	\arrow["f", from=1-1, to=3-1]
	\arrow["{\alpha_{J(X)}}", from=1-3, to=1-5]
	\arrow["{[F\circ J]\,f}", from=1-3, to=3-3]
	\arrow["{[G\circ J]\,f}", from=1-5, to=3-5]
	\arrow["{\alpha_{J(Y)}}", from=3-3, to=3-5]
\end{tikzcd}
\end{document}
```
This is a natural transformation on $\mathcal{B} \to \mathcal{D}$ functors.
Note that in this diagram $X$, $Y$, and $f$ are from
the category $\mathcal{B}$, whereas in the previous diagram $X$, $Y$, and $f$ were from $\mathcal{C}$.
In the context of Haskell, this type of whiskering wraps the inner `a` type of all the `join :: List List a -> List a` morphisms in another `List` and treats
`b = List a` as the new black-box type so we have `join :: List List b -> List b`. The same thing happens for `return`.

Thus, whiskering and horizontal composition utilizes the composition of the underlying functors acted on by the
natural transformation, and you should be able to convince yourself that the two versions of the monad
commutative diagrams are the same.


# Initial and Terminal Objects
One of the really cool things you get when looking at a typesystem from a category-theoretic
point of view is the concept of **initial objects** and **terminal objects**. These concepts
are dual to each other (you reverse the arrows in the commutative diagrams),
so let's look at them one at a time.

A terminal object is an object where every other object has exactly one morphism to the terminal object.
In Rust, the terminal object is the type `()`.
The terminal object is a type with exactly one inhabitant, so we can think of the terminal object as a singleton set.
Since there is only one possible value it can have, the only possible function you can write is returning that value,
so there is a de facto way to convert every other type to a `()`.

<!-- Terminal objects also give you a really nice
way to generalize the idea of an "element" of a set or an "instance" of a type into pure category theory:
each element of a set $X$ is associated with one morphism from the terminal object (singleton set) to $X$. Notice
how this lines up with the concept of an exponential object as described in the section on currying. -->

An initial object in a category is an object for which there is exactly one morphism to every
other object. In Rust, the initial object is a type called `Never`, or `!`. Because there is only one morphism
from `!` to every other type, there is an unambiguous way to convert `!` to any other type.

But what is `!`? Now things get interesting.
I'm going to work backwards and reveal the "implementation details" of the initial object first
before going back and deriving the desired properties.
`!` is a type with no inhabitants, i.e. it cannot be instantiated. You can think of it as
```rust
enum Never {}; // this is !
```
It is an empty set, and while you can never have a value of type `!`, you can talk about the type `!` itself.
But then how is that useful at all?? Well, `!` is the type of an expression that can *never* be materialized.
Expressions like `loop {}`, `panic!`, and `return` have type `!`.
To see what I mean, consider the following Rust example:

```rust
fn do_something(_: i32) -> Result<i32, Error>;

fn do_other_thing(_: i32) -> ();

fn f(x: i32) -> Option<i32> {
    let y: i32 = match do_something(x) {
        Ok(v) => v + 5, // this is i32
        Err(_) => {
            println!("Oh no!");
            return None; // `return` has type !, which can be converted to anything
        }
    }; // overall, y is still i32 since we can convert the !
    
    do_other_thing(y);
    
    Some(y * 6)
}
```

Of course, this example is an implementation of the `?` operator. Because of the semantics of a Rust `match`,
the `Err(_)` branch of the code is basically running `let y: i32 = return None;` at the end of the day. Yet,
because `return` is `!` and `!` is the initial object, `y` really *is* an `i32`.
Control flow never exits from the other side of the `Err(_)` branch after the `return`,
and the compiler can use `!` because it will never face the paradox
of making a value of `!`.

So why does this mean there's exactly one morphism from `!` to every other type?
Remember the formal way we represented morphisms in $\textbf{Set}$ as sets:
a set of all (input, output) pairs. However, since there are *no possible inputs*,
our one and only morphism is simply the empty set $\varnothing$! This is a very
strange function which exists, but can never be called. An implementation in Rust might look like
```rust
enum Never {};

fn coerce<T>(x: Never) -> T {
    match x {}
}
```


# Tidbit: Co-vectors with Category Theory
The category of finite-dimensional vector spaces is cartesian closed too. Objects
are vector spaces, and morphisms are linear transformations between vector spaces.
Since you can take a linear combination of linear transformations and have another linear
transformation (i.e. matrices are vectors too, with addition and scalar multiplication),
morphisms in the category of vector spaces are also objects in that category.

Because of scalar multiplication,
we can also think of vectors as morphisms/linear transformations $v : \mathbb{R} \to V$ where
$V$ is the vector space in which the vector $v$ lives. By reversing the arrow,
we get the covector $v^T : V \to \mathbb{R}$. 

$$
v^T v = v\cdot v \in \mathbb{R}.
$$


