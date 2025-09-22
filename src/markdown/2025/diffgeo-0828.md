---
title: 'trying to learn differential geometry'
created: '2025 08 28'
tags: 'mathposting'
---

Join me on my mission of trying to understand some of [John M. Lee's _Smooth Manifolds_ (Second Edition)](https://link.springer.com/book/10.1007/978-1-4419-9982-5).

This is a loose collection of notes as I try to explain this to myself.

## Motivation

We want a general, abstract way to talk about smooth $n$-dimensional manifolds, so we want to avoid talking about the
external ambient space in which the manifold exists (the space it can be *embedded* or *immersed* in). 
Smooth manifolds are topological spaces that locally
look like Euclidean $\mathbb{R}^n$ space. They also have a *smooth structure*, which is an *atlas* of
*charts* that are all *smoothly compatible* with each other, a chart being a way to assign $\mathbb{R}^n$ coordinates
for a local region on our manifold.

We want to do calculus on these manifolds and think about scalar fields, vector fields, and covector fields.

## Tangent and Cotangent Space

Say $M$ is a smooth manifold and $p\in M$ is a point on it. Then we can define a tangent space $T_p M$
of vectors tangent to $M$ at $p$, where $T_p M$ is a vector space consisting of all directional derivatives evaluated at $p$.
These vectors act on smooth scalar fields $f\in C^\infty(M),$ which are just smooth functions $f : M \to \mathbb{R}$.
A tangent vector with a base point at $p\in M$ is only going to care about the *local* behavior of the function near $p$.
Formally, $T_p M$ is the space of all linear functionals $C^\infty(M) \to \mathbb{R}$ that follow the product rule such that
for all $f, g : M \to \mathbb{R}$ and $v_p \in T_p M$:

$$
v_p(fg) = v_p(f)g(p) + f(p)v_p(g).
$$

These $T_p M$ spaces have the same dimension as the manifold $M$, and there is a different tangent space for each point $p \in M$.
Because these $T_p M$ spaces are finite-dimensional vector spaces, they have a dual space with the same dimension denoted $T_p^\ast M$. Elements
of this dual space are **covectors**, linear functionals $\omega : T_p M \to \mathbb R$ that act on vectors.

We can also join all these (co)tangent spaces together into **(co)tangent bundles**, the disjoint union of all the $T_p M$ or $T_p^\ast M$ spaces for all points $p \in M$:
$$
\begin{align*}
T M &= \bigsqcup_{p\in M} T_p M = \{(p, v) : p \in M, v \in T_p M \} \\
T^\ast M &= \bigsqcup_{p\in M} T_p^\ast M.
\end{align*}
$$

Whereas $T_p M$ and $T_p^\ast M$ were $n$-dimensional spaces (assuming $M$ is $n$-dimensional), $TM$ and $T^\ast M$
are $2n$ dimensional spaces.
These tangent bundles also comes with canonical projection maps $\pi : TM \to M$ and $\pi : T^\ast M \to M$ that map every (co)vector to its base point.
We can also be fancy and say that **sections of $\pi$** represent **(co)vector fields** on $M$. For the vector field case,
a section $X : M \to TM$ is just a right-inverse of $\pi$
such that $\pi \circ X = \text{Id}_M$, so $X(p)$ must map each point $p \in M$ to a tangent vector base pointed
at $p$. Similarly, a covector field is a right-inverse of $T^\ast M$'s projection map.

Now we can consider how scalar, vector, and covector fields can act on each other:
1. vector field ( scalar field ) = scalar field
2. covector field ( vector field ) = scalar field

We can take now directional derivatives of scalar functions, but we still don't have any way to talk about 
things like the gradient or curl. We can't even take directional derivatives of vector-valued functions! It turns out that
taking directional derivatives of vector functions is actually really hard (for reasons), so we'll start with the 
gradient, but first we need some machinery.

## Category Stuff
We can consider this $T$ to be an endofunctor on the category of smooth manifolds (fun fact: [it is a monad](https://arxiv.org/abs/1401.0940)).
The tangent space endofunctor takes manifolds $M$ to their tangent space $TM$, and it takes smooth maps $F: M\to N$ to their **differential** $\mathrm{d}F : T M \to T N$.

```tikz
\usepackage{tikz-cd}
\usepackage{amssymb}
\begin{document}
% https://q.uiver.app/#q=WzAsNSxbMCwwLCJNIl0sWzAsMSwiVE0iXSxbMSwxLCJUTiJdLFsxLDAsIk4iXSxbMiwwLCJcXG1hdGhiYntSfSJdLFszLDQsImYiXSxbMCwzLCJGIl0sWzEsMiwiZEYiXV0=
\begin{tikzcd}
	M & N & {\mathbb{R}} \\
	TM & TN
	\arrow["F", from=1-1, to=1-2]
	\arrow["f", dashed, from=1-2, to=1-3]
	\arrow["\mathrm{d}F", from=2-1, to=2-2]
\end{tikzcd}
\end{document}
```
For all $v_p \in TM$ and all scalar fields $f : N \to \mathbb{R}$, we have
$$
v_p(f \circ F) = \mathrm{d}F(v_p)(f).
$$
If $v_p$ is a tangent vector base pointed at $p \in M$, then $\mathrm dF(v_p)$ must be a tangent vector base pointed at $F(p) \in N$.
This is called a **pushforward** since we are pushing a tangent vector forward from the domain of $F$ to its codomain.
Additionally, the functor property that $d(F\circ G) = dF \circ dG$ is just the chain rule, and $dF$ is a linear map
as it inherits the linearity from the vector space structure of $v_p$ and $T_p M$.

We can also think of $f \circ F$ as being a **pullback** $F^\ast : C^\infty(N) \to C^\infty(M)$ acting
on scalar fields, where $F^\ast(f) := f \circ F$.
This pullback $F^\ast$ is also linear because it inherits linearity from function composition,
and we actually have a contravariant functor (aka a functor to the opposite category) from the category of
manifolds and maps between them to the category of vector spaces and linear operators. Again, this is a
*contravariant* functor because if $H = F \circ G$, then $H^\ast = G^\ast \circ F^\ast$.

The fact that $T$ is a functor also gives us a nice interpretation of $\pi$ in general as a natural transformation
$\pi : T \to \textbf{1}_{\text{Diff}}$, since we have the commutative square:
```tikz
% https://q.uiver.app/#q=WzAsNCxbMCwwLCJUTSJdLFswLDEsIlROIl0sWzEsMCwiTSJdLFsxLDEsIk4iXSxbMSwzLCJcXHBpX04iXSxbMCwyLCJcXHBpX00iXSxbMCwxLCJcXG1hdGhybXtkfUYiLDJdLFsyLDMsIkYiLDJdXQ==
\usepackage{tikz-cd}
\begin{document}\begin{tikzcd}
	TM & M \\
	TN & N
	\arrow["{\pi_M}", from=1-1, to=1-2]
	\arrow["{\mathrm{d}F}"', from=1-1, to=2-1]
	\arrow["F"', from=1-2, to=2-2]
	\arrow["{\pi_N}", from=2-1, to=2-2]
\end{tikzcd}\end{document}
```

## The Gradient
The gradient comes out of an operation called the **exterior derivative**, and in the case of the gradient
it takes a scalar field and returns a covector field. This operation is almost the exact same as the differential,
and we actually write it the same way, but it has subtly different semantics.
If we had some function $f : M \to \mathbb R$, then the gradient is a covector field $df : M \to T^\ast M$ that obeys
$$
df(p)(v_p) = v_p f
$$
for all points $p \in M$ and tangent vectors $v_p \in T_p M$. This is basically just $\vec v \cdot \nabla f$.
But doesn't this contradict to our original definition of the differential $df : TM \to T\mathbb R$?
Remember that the condition for our original $df$ was that for all $g : \mathbb R \to \mathbb R$, we have
$$
df(v_p)(g) = v_p(g \circ f).
$$
The covector definition is obtained from eliminating $g$ by setting it to $\mathrm{Id}_\mathbb R$. In the covector
interpretation, we have $df(p) : T_p M \to \mathbb R$, but this is exactly the same as our original interpretation
$df : T_p M \to T_{f(p)} \mathbb R$ (restricted to tangents at point $p$) since $T_{f(p)} \mathbb R \cong \mathbb R$.
So, if we call our covector definition $df$ and our original pushforward $df_\text{orig}$, we can write
$$
df(p)(v_p) = df_\text{orig}(v_p)(\mathrm{Id}_\mathbb{R}).
$$


## Velocity Vectors

Let's consider a concrete example for what $T \mathbb{R}^n$ looks like. Let's say we have $p \in \mathbb{R}^n$ where
$p = (x^i)$ in Einstein summation notation for each coordinate $x_i$ of $\mathbb{R}^n$. Then
the tangent space $T_p \mathbb{R}^n$ is a vector space spanned by
$$
\left\{ \left. \frac{\partial}{\partial x_i}\right|_{p} : 0 < i  \le n \right\}.
$$
where we can use the familiar notion of the partial derivative evaluated at a point, and we can view it as a derivation from $C^\infty(\mathbb{R}^n) \to \mathbb R$. The full tangent vector
bundle $T \mathbb{R}^n$ is isomorphic to $\mathbb{R}^{2n}$, and we can write each element as a linear
combination of the basis vectors of the corresponding $T_p \mathbb{R}^n$:
$$
(x^i, v^i) = v^i \left.\frac{\partial}{\partial x_i}\right|_{(x^i)}.
$$

Another thing we can now do is compute the **velocity vector** of a curve $\gamma : J \to M$ (where $J \subseteq \mathbb R$)
at some point $\gamma(t_0)$ for some $t_0 \in J$. We use the differential $\mathrm{d}\gamma : T J \to T M$ (but we really only
care about $T_{t_0} J$), and since
$T J \subseteq T \mathbb R$, elements of $T_{t_0} J$ are just some multiple of the basis vector $\left. \frac{\mathrm{d}}{\mathrm{d}t} \right|_{t_0}$.
Thus, we write
$$
\gamma'(t_0) = d\gamma\left(\left. \frac{\mathrm{d}}{\mathrm{d} t} \right|_{t_0}\right) \in T_{\gamma(t_0)} M
$$
which can act on functions (scalar fields) $f : M \to \mathbb{R}$ like so:
$$
\gamma'(t_0)f = \left. \frac{\mathrm d}{\mathrm d t} \right|_{t_0} (f \circ \gamma) = (f \circ \gamma)'(t_0)
$$
Notice how since $f \circ \gamma : J \to \mathbb{R}$, our notation highlights the isomorphism between $T_{f\circ \gamma (t_0)} \mathbb R$
and $\mathbb{R}$, depending on if we interpret $(f \circ \gamma)'(t_0)$ as a differential/tangent vector or a normal derivative.



## The Lie Derivative

Ok, we are almost ready to take a directional derivative of a vector field. Why was it so hard anyways?
Consider that the normal definition for the derivative is
$$
\lim_{h\to 0} \frac{f(\vec p + h \vec v) - f(\vec p)}{h}.
$$

We run into a problem because we have $f(\vec p + h \vec v) \in T_{\vec p + h \vec v} M$ but
$f(\vec p) \in T_{\vec p} M$, so in the general manifold case we have no way of adding or subtracting them (they
are completely different vector spaces)! The solution is to take the **Lie derivative**, which is to take
the derivative of a vector field along another vector field (rather than a single tangent vector). We will use
the vector field to define something called a **flow**, and use this flow to pushforward tangent vectors from 
$T_{\vec p + h \vec v}$ to $T_{\vec p} M$. 

The flow is essentially solving the differential equation defined
by a vector field. The flow of a vector field $V : M \to TM$ is a curve $\theta : J \to M$ with $J \subseteq \mathbb R$ such that
$\theta'(t) = V(\theta(t))$ for all $t \in J$. We can define a flow starting at every point $p \in M$,
and so we implicitly have a "time-evolution" map $\theta_t : M \to M$ that moves each point for $t$ time steps along the flow
defined by $V$. This allows us to use the differential $(d\theta_t)_p : T_p M \to T_{\theta_t (p)} M$ to take a directional
derivative of $W : M \to TM$ with respect to $V$:

$$
(\mathcal L_V W)(p) = \lim_{t\to 0} \frac{(d\theta_{-t})_{\theta_t(p)} [W(\theta_t(p))] - W(p)}{t}.
$$

Yes, $\mathcal L_V W$ is another vector field. This definition is obviously completely awful, but it turns out that for
some mysterious, inscrutable reason, it is equivalent to the Lie bracket:
$$
\mathcal L_V W = [V, W] = VW - WV.
$$

But how is the Lie bracket a vector field? Since vector fields take scalar fields to scalar fields, we are 
allowed to apply a second vector field. For example, $V(W f)$ is a scalar field, but the map $f \mapsto V(W f)$ 
is *not* a vector field, since it does not follow the product rule. The Lie bracket commutator combination thingy, however,
*does* result in a vector field (it follows the product rule, and you can verify it just by expanding). Of course,
by $VW - WV$, I mean the vector field that takes $f : M \to \mathbb R$ to $V (W f) - W (V f)$.

## Lie Groups

A Lie group is a manifold $G$ that is also a group: it has smooth maps for group multiplication $G \times G \to G$
and inverses $G \to G$. Consequently, for all $g \in G$, we can define a smooth left-rotation map $L_g(h) = g h$.
We can study vector fields on $G$, and there are special **left-invariant** vector fields that do not change
after applying $dL_g$ for all $g\in G$. That is, $X : G \to TG$ is left-invariant if $dL_g(X(h)) = X(gh)$ for all 
$g, h \in G$.
It turns out that these vector fields form a vector space, called
the **Lie algebra** of $G$. 

This vector space is isomorphic to $T_e G$, where $e$ is the identity of the group. This is because choosing the 
value of $X(e)$ will automatically set $X(g) = dL_g(X(e))$ and determine the entire vector field. See pg. 191.