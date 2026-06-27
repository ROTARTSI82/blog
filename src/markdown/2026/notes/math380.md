---
title: 'math 380: computational algebraic geometry'
subhead: 'class notes. prof cynthia vinzant, spring 2026 at uw.'
created: 'Jun 26 2026'
tags: 'hide-ls,featured'
---

Hi! These are my notes for MATH 380. These notes are part of this [larger collection](/granty29/blog/2026/notes/) of notes from my freshman year at UW.

> [Course Website](https://sites.math.washington.edu/~vinzant/teaching/380/). Also, here is my [final project](/granty29/2026/m380_final.pdf) along with my [poster](/granty29/2026/m380_poster.pdf). My project was on error correcting codes, specifically on how cyclic codes correspond to ideals of $\mathbb F_q / \langle x^n - 1\rangle$. I walk through the theory of error correcting codes using Hamming(7,4) as an example, working through how to encode and decode, and what errors are correctable.


## Table of Contents
<!-- toc -->

2026-03-30 - Polynomials
===

Polynomials of $n$ variables $x_1, \dots, x_n$ over an arbitrary field $k$. 

Monomials: $$x^\alpha = x_1^{\alpha_1} x_2^{\alpha_2} \cdots x_n^{\alpha_n}$$ where $\alpha = (\alpha_1, \dots, \alpha_n) \in \mathbb{Z}_{\ge 0}^n$.

A polynomial is a finite $k$-linear combo of monomials. $$f = \sum_\alpha c_\alpha x^\alpha$$ where $c_\alpha \in k$ and we sum over finitely many $\alpha$.

$k[x_1,\dots,x_n]$ is the polynomial ring. Note that a polynomial $f$ is also a function $k^n \to k$.

The **affine variety** of a collection of polynomials $f_1,\dots,f_s \in k[x_1,\dots,x_n]$ is
$$
V(f_1,\dots,f_s)=\{a \in k^n \mid f_1(a)=0\land \cdots \land f_s(a)=0\}
$$
Note $f(a) = g(a) \iff (f-g)(a) = 0$.

Example: $z=0$ plane plus $z$-axis:
$$
V(xz,yz) \cong V(z) \cup V(x,y)
$$

Example: Cylinder + cubic curve
$$
V(1-x^2-y^2,4x^3-3x-z) \cong \{(\cos \theta, \sin \theta, \cos(3\theta)) \mid \theta\in[0,2\pi)\}
$$
Sin and cos written using polynomials! Oftentimes sin and cos with integer frequencies are still algebraic.

**Affine linear spaces** are varieties. Recall an affine linear space is the solution set to a system of $m$ linear equations 

$$
\begin{align}a_{1 1} x_1 + &\dots + a_{1 n} x_n = b_1 \\ &\vdots \\ a_{n 1} x_1 + &\dots + a_{n n} x_n = b_n\end{align}
$$

This is linear algebra.

Applications: Polynomial optimization with lagrange multipliers.
$$
\max f(x) \text{ s.t. } g(x)=0
$$
Our solution points:
$$
g=0 \land \nabla f = \lambda \cdot \nabla g
$$
$$
V\left(g, \frac{\partial f}{x_1} - \lambda \frac{\partial g}{\partial x_2}, \cdots,\frac{\partial f}{x_n} - \lambda \frac{\partial g}{\partial x_n} \right)
$$
If $g$ and $f$ are $n$-variable polynomials, we got $n+1$ equations in $n+1$ variables, namely $x_1,\dots,x_n,\lambda$.

Robot kinematics: What is the config space of a 2-dof robot arm, with arm lengths of 2 and 1?
$$
V\left(4-x^2-y^2, 1-(z-x)^2-(w-y)^2 \right)
$$

Statistical models: Consider Binomial distribution: probability $p$ of heads, $n$ flips. Let $n=2$, and let $x_i$ be the probability of getting $i$ heads ($x_i = \binom{n}{i} p^i (1-p)^i$). Given some data, you might test that it satisfies
$$
x_0+x_1+\dots+x_n=1 \land ...
$$

2026-04-01 - Varieties
===

**Total degree** of a monomial $x^\alpha$ is $|\alpha| = \alpha_1 + \dots + \alpha_n$. For a polynomial $f$, **total degree** is $\text{deg}(f) = \max\,\{|\alpha| \mid c_\alpha \ne 0\}$. Remember $c_\alpha \in k$ is the **coefficient** of the **term** $x^\alpha$ in the polynomial $f$ when $c_\alpha \ne 0$.

What sets are affine varieties?

Remark $n=1$: A nonzero univariate polynomial $f \in k[x]$ has at most $\text{deg}(f)$ many roots. Thus, $V(f)$ is finite and $|V(f)| \le \text{deg}(f)$. We have that $f(a) = 0 \implies f = (x - a) g$ for some $g \in k[x]$ with $\text{deg}(g) = \text{deg}(f) - 1$, then we can induct on this. If we have a univariate polynomial with infinite roots, then it is the zero polynomial.

$n=2$: Nonzero polynomials can now have infinitely many roots.

**THEOREM** If $k$ is an infinite field, then any polynomial $f$ that is the zero function is the zero polynomial. For infinite $k$ and $f \in k[x_1,\dots,x_n]$, if $\forall a \in k^n, f(a) = 0$, then $f = 0$. 
-  If $k$ is finite, we can find $$f = \prod_{a \in k} (x - a) \in k[x],$$ which is a finite product and thus a polynomial. This evaluates to zero on every element of the field and is thus the zero function, but is not the zero polynomial.
- Proof: Induction on number of variables $n$: For $n=1$, by remark. For inductive case, write $$f=\sum_{i=0}^{\text{deg}(f)} g_i(x_1,\dots,x_{n-1})x_n^i $$ where each $g_i \in k[x_1,\dots,x_{n-1}]$. We have that $\forall \vec a \in k^n, f(\vec a) = 0$. For all $(a_1,\dots,a_{n-1}) \in k^{n-1}$, we have a univariate polynomial $p(x) = f(a_1, \dots, a_{n-1},x)$, which satisfies $\forall x \in k,p(x) = 0$.  Thus $p = 0$ by the $n=1$ case, so all the coefficients are $0$, namely $\forall i, g_i(a_1,\dots,a_{n-1}) = 0$. (this is also for all $(a_1,\dots,a_{n-1})$). Thus by the $n-1$ case, $\forall i, g_i = 0$, so $f = 0$.
- Condensed statement of theorem: If $k$ is infinite, $V(f) = k^n \iff f = 0$.

The empty set is a variety: $\varnothing = V(1)$.

Can a non-constant polynomial $f$ have $V(f) = \varnothing$? Depends on if $k$ is **algebraically closed**! E.g. $k = \mathbb R$, we have $V(x^2 + 1)$, but over $k = \mathbb C$, every non constant polynomial has a root in $\mathbb C$.
- **Fundamental Theorem of Algebra**: Every non-constant univariate polynomial $f \in \mathbb C[x]$ has a root $r \in \mathbb C$. This is the definition that $\mathbb C$ is algebraically closed.


Operations on varieties (Lemma 2 in 1.2): If $V$ and $W$ are affine varieties, then $V \cup W$ and $V \cap W$ are both also affine varieties. In particular, consider $V = V(f_1, \dots, f_s)$ and $W = V(g_1,\dots, g_t)$, then
$$
\begin{align}
V\cap W &= V(f_1,\dots f_s, g_1,\dots g_t) \\
V \cup W &= V(f_ig_j \mid 1\le i\le s, 1\le j \le t)
\end{align}
$$

Proof for $V \cup W$: We have $V\cup W \subseteq V(f_i g_j \mid \dots)$ since if $a \in V$ all the $f_i$s go to zero, and if $a \in W$ then all the $g_j$s go to zero. Other way $V(f_i g_j \mid \dots) \subseteq V \cup W$. Let $a \in V(f_i g_j \mid \dots)$. Then if $a \not \in V$, then we have $f_\ell(a) \ne 0$ for some $1 \le \ell \le s$, but since a is in the variety we know $\forall j, f_\ell(a) g_j(a) = 0$ so $a \in W$. Symmetric logic for other way.

2026-04-03 - Parameterization
===
Spaces can be defined by implicit equations or by parameterizations. E.g.
$$
\{(x,y,z) \in \mathbb R^3 \mid x-2z=1 \land y+3z=1\} = \{(1+2t,1-3t,t) \mid t\in\mathbb R\}
$$
$$
V(xy - 1) \cong \text{Graph}\left(y=\frac{1}{x}\right)\cong \left\{\left(t,\frac{1}{t}\right)\mid t\in\mathbb R\right\}
$$

Parameterization of varieties as rational functions. Denote the set of rational functions $k(t_1,\dots,t_m)$, which is the quotient ring $p/q$ for $p,q \in k[t_1,\dots,t_m]$ and $q\ne0$. Equivalence relation is $p_1/q_1 = p_2 / q_2 \iff p_1q_2 = q_1p_2$ as polynomials in $k[t_1,\dots,t_m]$.
$$V((x+y)(x-y)-1) = \left\{\left(\frac{1+t^2}{t},\frac{1-t^2}{t}\right) \mid t \in \mathbb R \setminus \{0\}\right\}.$$
In general: Let $V=V(f_1,\dots,f_s)$. We call $(x_1, \dots, x_n)$ where $x_i = r_i(t_1,\dots,t_m)$ a **parametric representation** of $V$ if $$\{(r_1(a),\dots,r_n(a))\mid a\in k^m \text{ s.t. } \forall i\le n, q_i(a)\ne0\}\subseteq V,$$ and $V$ is the smallest variety containing this set.

Are there analogues of the algorithms we learned in linear algebra (e.g. finding basis vectors for a RREF solution space)?
1. Does every variety have a rational parametrization? 
	1. No. Consider $V(y^2-x^3+x)$. Finding the parametrization is hard.
2. How do we find the implicit equations for a variety given a parametric representation? 
	1. This can always be done with **elimination**.

Example implicitization: $x=t^2,\;y=tu,\;z=u^2$ is $\subseteq V(xz-y^2)$. This is the parameterization of 2x2 matrices that can be written as $V V^T$, and $xz-y^2$ is the determinant of the matrix:
$$
\begin{bmatrix}
x & y \\ y & z
\end{bmatrix} = \begin{bmatrix} t \\ u \end{bmatrix} \begin{bmatrix} t & u \end{bmatrix} = \begin{bmatrix}
t^2 & t u \\ t u & u^2
\end{bmatrix}.
$$
The determinant is an example of implicitization? $\det(V V^T) = 0$

Non rational parameterization: $V(x^2 + y^2 - 1) = \{(\cos t, \sin t) \mid t \in [0, 2\pi)\}$.  Let's make it rational with projective stuff: we fix the points $(-1,0)$ and $(0,t)$, drawing a straight line that intersects the circle at another point. $(-1,0) + \lambda (1, t) \in \mathbb S^1$, so $(\lambda - 1)^2 + \lambda^2 t^2 = 1$, and since we want $\lambda\ne0$ we take $\lambda=\frac{2}{1+t^2}$. Plugging everything in,
$$
V(x^2 +y^2 - 1) \mapsto \left\{\left(\frac{2}{1+t^2}-1,\frac{2t}{1+t^2}\right) \;\middle|\; t\in \mathbb R \right\}
$$
This parameterization misses the point $(-1,0)$ (that requires $t=\infty$), but it still works! We can prove that if any polynomial $f \in \mathbb R[x,y]$ vanishes on $\mathbb S^1 \setminus \{(-1,0)\}$, then $f((-1,0))=0$ too, so this is the smallest variety.

Note that this parameterization gives us a way to generate pythag triples! We have that $$\left(\frac{1-t^2}{1+t^2}\right)^2 +\left(\frac{2t}{1+t^2}\right)^2 = 1$$ Thus, take $a=1-t^2,\;b=2t,\;c=1+t^2$ and you get $a^2+b^2=c^2$.


2026-04-06 - Adjoint Functors
===
A set $I \subseteq k[x_1,\dots,x_n]$ is an ideal if
1. $0 \in I.$
2. $\forall (f, g \in I), f+g\in I.$
3. $\forall f \in I, \forall h \in k[x_1,\dots,x_n], f\cdot h \in I$.

The ideal generated by a set of polynomials is the smallest ideal containing that set. We call this set a **basis** for the ideal. Lemma is that this is an ideal.
$$
\langle f_1, \dots, f_s\rangle = \left\{ \sum_{i=1}^s h_i f_i \;\middle|\; \forall i, h_i \in k[x_1,\dots,x_n] \right\}.
$$

Example: $f \in \langle x, y \rangle \iff c_{00} = 0 \iff f(0,0) = 0$.

Proposition 1: For all $g \in \langle f_1, \dots, f_s \rangle$ and $a \in V(f_1, \dots, f_s)$, we have $g(a) = 0$.
- Proof: $g = \sum h_i f_i$, and $g(a) = \sum h_i(a) \cancel{f_i(a)} = 0$.

Proposition 2: If $\langle f_1, \dots, f_s \rangle = \langle g_1, \dots g_t \rangle$, then $V(f_1,\dots,f_s) = V(g_1,\dots,g_t)$.
- Proof: We can show $V(\vec f) \subseteq V(\vec g)$. Let $a \in V(f_1,\dots, f_s)$. Then for all $1\le j \le t$, we have $g_j = \sum h_i f_i$, so $g_j(a) = \sum h_i(a) \cancel{f_i(a)} = 0$, and $a \in V(g_1,\dots,g_s)$. Symmetric logic for reverse containment.

Given a subset $V \subseteq k^n$, we define the **ideal of $V$** to be $$\mathcal I(V) = \left\{f \in k[x_1,\dots,x_n] \mid \forall a\in V,f(a)=0\right\}.$$ Lemma: This is an ideal. Just use definition of polynomial addition and multiplication.

Example: $\mathcal I(k^n) = \{0\}$ when $k$ is infinite (by theorem from day 1). 

Example: $\mathcal I(\varnothing) = k[x_1,\dots,x_n]$.

Example ($n=2$): $\mathcal I(\{(0,0)\})=\langle x, y\rangle$ from previous example (look at the coefficient of the constant $x^0 y^0$ term monomial).

Example: $\mathcal I(\{1\}) = \langle x - 1 \rangle$. Note that this does not require our field $k$ to be algebraically closed!

Ok, is this an adjoint functor or something? Let us examine what happens if you do
$$
\mathcal I(V(f_1, \dots, f_s)).
$$

Lemma: $\langle f_s, \dots, f_s \rangle \subseteq \mathcal I(V)$ by definitions. However, the reverse containment is false: Take for example $\mathcal I(V(x^2, y^2))=\langle x,y\rangle$ since that variety only contains the single point $(0, 0)$. For proposition 2, note that $V(x^2,y^2) = V(x,y)$, but $\langle x^2, y^2 \rangle \ne \langle x, y \rangle$.


2026-04-08 - (Extended) Euclidean Algo
===

Questions: Are all ideals of the polynomial ring generated by a finite set of polynomials? How can we test if a polynomial is in an ideal?

For $f \in k[x]$, the **leading term** of $f$ is $\text{LT}(f) = c_d x^d$, the term with the highest degree along with its coefficient $c_d \ne 0$. Note that for $f,g \in k[x]$,
$$\text{deg}(f) \le \text{deg}(g) \iff \text{LT}(f) \text{ divides } \text{LT}(g).$$
Note that over a field, all nonzero coefficients divide each other, so we only need to consider the $x$ term. 

Division algorithm (Euclidean algorithm): Given $f,g \in k[x]$ with $g \ne 0$, we find $q,r\in k[x]$ such that $f = q\cdot g + r$ with either $r = 0$ or $\text{deg}(r) < \text{deg}(g)$.
- Initialize $q=0$ and $r=f$.
- While $r\ne 0$ and $\text{deg}(r) \ge \text{deg}(g)$, we update:
	- $q = q + \text{LT}(r)/\text{LT}(g)$
	- $r = r - g\cdot \text{LT}(r)/\text{LT}(g)$
- Return $q$ and $r$.

This algorithm terminates and the outputs have the desired properties. 
- First check the update step preserves $f = q \cdot g + r$: After update $q' = q + L(r) / L(g)$ and $r' = r - g\cdot L(r) / L(g)$, therefore $$q' \cdot g + r' = g \cdot q + g \cdot L(r) / L(g) + r - g \cdot L(r)/L(g) = g \cdot q + r = f.$$
- Termination: We prove that at each step the degree of $r$ drops by one. Since $r$ starts with positive finite degree, this terminates. Write $r = \sum a_k x^k$ and $g = \sum b_j x^j$.  Expand out $r'$ and see that the leading term goes away: $$r' = \sum a_k x^k -\left(\sum b_jx^j\right)\frac{a_k x^k}{b_jx^j}$$ Remember that at each step $\text{deg}(r) \ge \text{deg}(g)$ so we can do the division, so either $r'$ is 0 or the leading $a_k x^k$ term goes to zero and the degree of $r$ drops.

Proposition: The result of division is unique (Given $f,g\in k[x]$ there is a unique pair $q,r \in k[x]$ such that $f = q\cdot g + r$ with $r=0$ or $\deg r < \deg g$)

Corollary: If $f \in k[x]$ is nonzero and $a \in k$, then $f(a) = 0 \iff (x-a) \text{ divides } f$.
- Take $g = x-a$, and by the division algo, we have $f(x) = q(x)(x-a) + r(x)$. Because $\deg g = 1$, we have that $r(x) \in k$ is a constant by the degree bound. Thus, $f(a) = q(a) \cdot 0 + r(x) = 0$, so $r(x) = 0$ and $x-a$ divides $f$. The other direction of the if and only if is just evaluating $f(x) = q(x) \cdot (x - a)$ at $a$.

Corollary: If $f \in k[x]$ is nonzero then $|V(f)| \le \deg f$.
- Induct on $\deg f$. If $\deg f = 0$ so that $f \in k$, we know that $f \ne 0$ so $V(f) = \varnothing$, and $|V(f)| = 0 \le \deg f$. 
- Inductive case: If $V(f) = \varnothing$, we are already done, so $f(a) = 0$ for some $a \in k$. Then, do the division algo so that $f(x) + q(x) \cdot (x - a)$ with $\deg q = \deg f - 1$. We have that for all $b \ne a$, $f(b) = q(b)(b-a)=0 \iff q(b) = 0$. Thus, $|V(f)| \le |V(q)| + 1 \le deg q = \deg f$.


2026-04-10  - GCD
===

Corollary of Euclidean algorithm: Every ideal $I \subseteq k[x]$ is generated by a single polynomial $\langle f \rangle$. All ideals of $k[x]$ are principal ideals, i.e. $k[x]$ is a principal ideal domain.
- Proof: If $I = \{ 0\}$, then obviously $I = \langle 0 \rangle$. Let $f \in I \setminus \{0\}$ be some nonzero polynomial of the smallest degree (by well order of the naturals). We can show that $\langle f \rangle = I$. Obviously, $\langle f \rangle \subseteq I$. To show the nontrivial direction, let $g \in I$ be some element, and by the division algorithm write $g = q \cdot f + r$ where either $r=0$ or $\deg r < \deg f$. Then we have $r = g - q \cdot f$, and since $g \in I$ and $f \in I$, we have that $r \in I$. If $r \ne 0$, then we have that $\deg r < \deg f$ and $r \in I$, contradicting the fact that $f$ has the smallest degree found in $I$. Thus, $r = 0$, and $g = q\cdot f \in \langle f \rangle$.

Question: Given $f_1,\dots,f_s \in k[x]$, what is the polynomial $g\in k[x]$ such that $\langle g \rangle = \langle f_1,\dots, f_s \rangle$? It turns out that $g = \gcd(f_1,\cdots,f_s)$. The gcd is the polynomial with the following properties:
- $\forall i, g \mid f_i$
- For all $p \in k[x]$ such that $\forall i, p \mid f_i$, then $p \mid g$.

Proposition: 
- GCDs exist and are unique up to scalar multiplication
- $\langle \gcd(f_1, \dots, f_s)\rangle = \langle f_1,\dots,f_s\rangle$ (use property of principal ideal domain and prove the generator satisfies properties of gcd).
- $\gcd(f_1, \dots, f_s) = \gcd(f_1, \gcd(f_2, \dots, f_s))$ so we can do induction.
- There is an algorithm for computing gcd.


To compute $\gcd(f_1, f_2)$, do this:
- WLOG, let $\deg(f_1) \ge \deg(f_2)$. Compute $f_1 = q\cdot f_2 + r$ using division algo. We show that $\langle f_1, f_2 \rangle = \langle f_2, r\rangle$. We have $f_1 \subseteq \langle f_2, r \rangle$ by the equation given by division algo, and since $r = f_1 - q\cdot f_2$ we also have $r \subseteq \langle f_1, f_2\rangle$. Thus, $\gcd(f_1, f_2) = \gcd(f_2, r)$, and either $r=0$ and we can output $f_2$ or we just repeat with $\langle f_2,r\rangle$, and since $\deg r < \deg f_2$ we are guaranteed to terminate.

(From the construction of the algo) we can also inductively find $a,b \in k[x]$ such that $a f_1 + b f_2 = \gcd(f_1, f_2)$. At each step, write $r = f_1 - q\cdot f_2$ and track back the coefficients (extended euclidean algorithm). This is equivalent to the equality of the two ideals.

Given $h, f_1, \dots, f_s \in k[x]$, we can test if $h \in \langle f_1,\dots f_s\rangle$ by computing $g = \gcd(f_1,\dots, f_s)$. Since $\langle g \rangle = \langle f_1,\dots,f_s \rangle$, divide $h = q\cdot g + r$, and $h \in \langle g\rangle \iff r=0$. 


Note that $k[x,y]$ is NOT a principal ideal domain! We can get more complicated ideals like $\langle x , y \rangle$.

Question: Is every ideal $I \subseteq k[x_1, \dots, x_s]$ finitely generated? (Yes, Hilbert Basis theorem). Given $h, f_1,\dots, f_s \in k[x_1,\dots, x_n]$, can we generalize the algorithm to test $h \in \langle f_1, \dots, f_s \rangle$? How do we describe affine varieties? How do we do implicitization: get equations for a variety given equations $x_i = g_i(\vec t)$?


2026-04-13 - Monomial Orderings 
===

In the univariate case, we could see that the $\deg r \le \deg g \iff \text{LT}(g) \text{ divides } \text{LT}(r)$, and degree of the remainder strictly decreases. In general, monomials in $k[x_1,\dots,x_n]$ are in bijection with $\mathbb Z^n_{\ge 0}$.

To extend to multivariable, we want a **monomial ordering**, a relation on $\mathbb Z^n_{\ge 0}$ that is
1. a total order ($a > b \lor b < a$ or $a = b$), 
2. respects multiplication: $x^\alpha > x^\beta \implies \forall \gamma \in \mathbb Z^n_{\ge 0},\;x^{\alpha + \gamma} > x^{\beta + \gamma}$
3. a well-order: Every nonempty subset has a least element. 

Example: The reverse of the normal ordering, where $1 > x > x^2 > \dots$, fails (3) since monomials are only bounded on one side, and we flipped it to the wrong side. It satisfies (1) and (2) though.

It turns out that the ONLY monomial order on $\mathbb Z^1_{\ge 0}$ is the normal one where $1 < x < x^2<\dots$!

Lexicographic orderings are monomial orderings. For $\alpha, \beta \in Z^n_{\ge 0}$, then $\alpha >_\text{lex} \beta$  if the leftmost nonzero entry of $\alpha - \beta$ is positive. Note that this means $x_1 > x_2 > \dots > c$!
- Proof that this is a monomial ordering: Note that for $\alpha, \beta \in \mathbb Z^n_{\ge 0}$, if $\alpha \ne \beta$ then $\alpha - \beta \ne 0$ so there is a leftmost nonzero entry. If it is positive, $\alpha > \beta$, and if it is negative $\beta < \alpha$, so it is a total order. We satisfy multiplication rule since to compare $\alpha + \gamma > \beta + \gamma$, we look at $(\alpha + \gamma) - (\beta + \gamma) = \alpha - \gamma$, so we have the same leftmost nonzero entry. Finally, to prove that we have a least element for all subsets: Let $A \subseteq \mathbb Z^n_{\ge 0}$. If we look at the set of first elements $\{\alpha_1 \mid (\alpha_1,\dots,\alpha_n) \in A\} \subseteq \mathbb N$, this is a set of nonnegative integers and thus has a least element $m_1$. Then consider the set of second elements where first coord is equal to $m_1$: $\{\alpha_2 \mid (m_1,\alpha_2,\dots,\alpha_n)\in A\}\subseteq \mathbb N$. This set is nonempty and has a least element $m_2$. We can just repeat until we reach $n$: Then $m=(m_1,\dots,m_n)\in A$ and $\alpha > m$ for all $\alpha$. Note that this proof relies on the fact that we have finite number of variables!

Other monomial orderings: 
- Graded lexicographic order: Define $|\alpha| = \sum_i^n \alpha_i$. We say $\alpha >_\text{grlex} \beta$ if $|\alpha| > |\beta|$ or $|\alpha| = |\beta|$ and $\alpha >_\text{lex} \beta$.  Wants the most total degree, then prefers the most in the greatest variables $x_1 >$. We have $x^2yz^2 >_\text{grlex}xy^3z$ since the $x$ is important.
- Graded reverse lexicographical order: We say $\alpha >_\text{grevlex} \beta$ if $|\alpha| > |\beta|$ or $|\alpha| = |\beta|$ and the rightmost nonzero entry of $\alpha - \beta$ is negative. Wants the most total degree, then prefers the least in the least variables $> x_n$. We have $xy^3z >_\text{grevlex} x^2yz^2$ since the $z$ is important.

Why do we want well-ordering? A total order $>$ on $\mathbb Z^n_{\ge 0}$ is a well order if and only if every decreasing sequence terminates. Artinian???? This means division algorithms MUST TERMINATE!!!
- Proof: It's just the contrapositive. If we have $A \subseteq \mathbb Z^n_{\ge 0}$ is nonempty with no minimal element, just keep choosing some $a_1$ and then $a_2 < a_1$ and so on infinitely $a_1 > a_2 > \dots$ since no element is ever the minimum. Similarly, if you have an infinite decreasing sequence, just put it into a set and it is nonempty with no least element.

2026-04-15 - Multivariate Division Algo
===
Let $f = \sum_\alpha c_\alpha x^\alpha \in k[x_1,\dots,x_n]$, and consider a monomial order $>$. Define the **multidegree** of $f$ to be $\text{multideg}(f) = \max \{\alpha : c_\alpha \ne 0\} \in \mathbb Z^n_{\ge 0}$ where $\max$ is according to our monomial order. Define the leading coefficient $\text{LC}(f) = c_{\text{multideg}(f)}$, the leading monomial $\text{LM} = x^{\text{multideg}(f)} \in k[x_1,\dots,x_n]$, and the leading term to be $\text{LT}(f) = \text{LC}(f)\cdot\text{LM}(f)$.

If $f,g \in k[x_1,\dots,x_n]$ are nonzero, then
- $\text{multideg}(f\cdot g) = \text{multideg}(f) + \text{multideg}(g)$
- If $f+g\ne 0$, then $\text{multideg}(f+g) \le \max\{\text{multideg}(f),\text{multideg}(g)\}$ 
	- If $\text{multideg}(f) \ne \text{multideg}(g)$, this is a strict equality.

Theorem: Fix a monomial order $>$ on $k[x_1,\dots,x_n]$.  Given $f_1,\dots,f_s \in k[x_1,\dots,,x_n]]$, any new polynomial $f \in k[x_1,\dots,x_n]$ can be written
$f=q_1f_1+q_2f_2+\dots + q_sf_s + r$ where any monomial appearing in $r$ is not divisible by any $\text{LT}(f_i)$ for any $i$. Furthermore, if $q_i f_i \ne 0$, then $\text{multideg}(f) \ge \text{multideg}(q_if_i)$.

Division Algorithm: Start with $q_1,\dots,q_s := 0$, $r := 0$, and a partial remainder $p := f$. While $p \ne 0$, we do
- If $\text{LT}(f_i)$ divides $\text{LT}(p)$ (try the $f_i$s in a deterministic order) for some $i$, then
	- $q_i \leftarrow q_i + \text{LT}(p) / \text{LT}(f_i)$
	- $p \leftarrow p - f_i \cdot \text{LT}(p) / \text{LT}(f_i)$
- Otherwise, move that term from $p$ to $r$:
	- $r \leftarrow r + \text{LT}(p)$
	- $p \leftarrow p - \text{LT}(p)$
- Keep repeating until $p=0$, then return $q_1,\dots,q_s,r$.

 NOTE: This does NOT say that the remainder and quotients are unique, nor does it say that $r = 0$ if and only if $f \in \langle f_1,\dots,f_s\rangle$!! Look at the statement of the theorem. The ordering on the $f_i$s also matters.
- Example ($n=1$): $f = x^2 -1$ and $f_1 = x^4 - 1$ with $f_2 = x^6 - 1$, this division algo gives $f = 0 \cdot f_1 + 0 \cdot f_2 + f$, but on inspection we see that $f = -x^2 f_1 + f_2$!

Main ideas of proof that the div algo does what I claim (TODO: Read book)
- At every iteration, $f = q_1f_1 + q_2f_2 + \dots + q_sf_s + p + r$
- At every update, $\text{LM}(p)$ strictly decreases w.r.t. $<$ so our algo terminates ($<$ is a well-order)


2026-04-17 - Monomial Ideals
===

An ideal $I \subseteq k[x_1,\dots,x_n]$ is a **monomial ideal** if it has the form $$I = \langle x^\alpha : \alpha \in A\rangle = \left\{\sum_{\alpha \in A}h_\alpha x^\alpha : h_\alpha \in k[x_1,\dots,x_n] \land h_\alpha \ne 0 \text{ for only finitely many }\alpha\in A\right\}$$
for $A \subseteq \mathbb Z^n_{\ge 0}$ (with $A$ being possibly infinite). Example: $A = \{(a,b) : a + b \ge 2\} \subseteq \mathbb Z^2_{\ge 0}$. Is this equal to $\langle x^2, xy,y^2\rangle$, and in general is every monomial ideal finitely generated? (Ans to both: Yes, Dickson's lemma, Hilbert Basis Theorem).
- Proof for this example: One containment is obvious. Other containment is just writing any $f \in \langle x^\alpha : \alpha \in A\rangle$ as $$f = \sum_{a=1,b\ge1} h_{ab}x^ay^b + \sum_{a=0,b\ge 2} h_{ab} x^ay^b + \sum_{a\ge 2} h_{ab} x^ay^b$$

Lemma: $$x^\beta \in \langle x^\alpha : \alpha \in A \rangle \iff \exists \alpha \in A, x^\alpha \text{ divides }x^\beta$$
- Proof: Backwards direction is obvious. To prove forward direction, let $$x^\beta = \sum_\alpha h_\alpha x^\alpha$$ for some collection of $h_\alpha = \sum_\gamma c_{\alpha\gamma}x^\gamma \in k[x_1,\dots,x_n].$ Expanding out, we get $$x^\beta = \sum_{\alpha} \sum_\gamma c_{\alpha\gamma} x^{\alpha + \gamma},$$ so since we need some nonzero $x^\beta$ term somewhere in that sum we know $x^\beta = x^{\alpha + \beta}$ for some $\alpha \in A$ and $\gamma \in \mathbb Z^n_{\ge 0}$, so $x^\beta = x^\alpha \cdot x^\gamma$ as desired.

Rephrasing: $$\{\beta : x^\beta \in \langle x^\alpha : \alpha \in A\rangle\} = \bigcup_{\alpha \in A}(\alpha + \mathbb Z^n_{\ge 0}).$$

**Dickson's Lemma**: Let $I = \langle x^\alpha : \alpha \in A\rangle$ for some potentially infinite $A \subseteq \mathbb Z^n_{\ge 0}$. Then $I = \langle x^{\alpha(1)},\dots x^{\alpha(s)}\rangle$ for some finite collection $\alpha(1),\dots,\alpha(s) \in A$.
- Proof by induction on $n$: For $n=1$, by the previous theorem we have $\langle x^\alpha : a \in A\rangle = \langle x^m\rangle$ where $m = \min A$. More detail: we have that for all $\alpha \in A$, $x^m$ divides $x^\alpha$ by minimality (we are in $k[x]$) and the previous theorem says that some $x^\alpha$ divides every $f \in \langle x^\alpha : a \in A \rangle$. 
- For $n > 1$, we can consider any ideal $$I = \langle x^\alpha y^m : (a,m) \in A\rangle \subseteq k[x_1,\dots,x_{n-1},y].$$ $$J = \langle x^\alpha : \exists m,x^\alpha y^m \in I \rangle \subseteq k[x_1,\dots,x_{n-1}].$$ By inductive hypothesis, write $J = \langle x^{\alpha(1)}, \dots, x^{\alpha(s)}\rangle$. By definition of $J$, for each $x^{\alpha(i)}$ we have $x^{\alpha(i)}y^{m(i)} \in I$ for some $m(i) \in \mathbb N$, so we can take the $m = \max m(i)$, maximizing across $1 \le i \le s$. Thus, $x^{\alpha(i)}y^m \in I$ for all $i$. 
	- Then for each $0 \le \ell \le m-1$, define $$J_\ell = \langle x^\alpha : x^\alpha y^\ell \in I\rangle\subseteq k[x_1,\dots,x_{n-1}]$$
	- By the inductive hypothesis, $J_\ell$ is finitely generated by $\langle x^{\alpha_\ell(1)},\dots,x^{\alpha_\ell(s_\ell)}\rangle$.
	- Consider $\bigcup \{\}$


2026-04-20 - Gröbner Bases
===

Dickson's lemma says that all monomial ideals have a finite basis, but it is not unique. Turns out there is always a unique finite basis where no generator divides any other generator! This is the **minimal basis**, and finding it is easy: just get rid of the bigger generator whenever one divides another, and you get a smaller basis without changing the ideal generated.

**Hilbert Basis Theorem**: Every ideal $I \subseteq k[x_1,\dots,x_n]$ is finitely generated.
- Proof: Fix a monomial order, and given a nonzero ideal $I$, define $$\text{LT}(I) = \{\text{LT}(f) : f \in I \setminus \{0\}\}.$$ Then $\langle \text{LT}(I)\rangle$ is a monomial ideal, so by Dickson's lemma there is a finite basis. Let $G = \{g_1,\dots,g_t\} \subseteq I$ such that $\langle \text{LT}(I)\rangle = \langle \text{LT}(g_1),\dots,\text{LT}(g_t)\rangle$. We call such a set a **Gröbner Basis** for $I$ with respect to the monomial order. 
- It turns out that ANY Groebner basis $G$ for an ideal $I$ also generates $I$. We wish to prove $\langle G \rangle = I$. Clearly, since $G \subseteq I$, the $\subseteq$ containment is trivial. To show the other direction, let $f \in I$ be any nonzero polynomial. By the division algorithm, we can divide $f$ by $(g_1,\dots,g_t)$ such that $$f = q_1 g_1 + \dots + q_tg_t + r$$ where either $r = 0$ or no term of $r$ is divisible by $\text{LT}(g_i)$ for any $1\le i\le t$. Note that $r \in I$ since $f \in I$ and every $g_i \in I$. Since $r\in I$ and is nonzero, $\text{LT}(r) \in \langle \text{LT}(I)\rangle = \langle\text{LT}(g_1),\dots,\text{LT}(g_t)\rangle$. Thus, $\text{LT}(r)$ is divisible by $\text{LT}(g_i)$ for some $1 \le i \le t$ by the lemma on monomial ideals, so the only possibility is that $r = 0$ and $f \in \langle g_1, \dots, g_t\rangle$.

There is such a thing as a minimal Gröbner basis.

Note about the proof: If you have $I = \langle f_1,\dots,f_s\rangle$, it can happen that $\langle \text{LT}(I)\rangle \ne \langle \text{LT}(f_1),\dots,\text{LT}(f_s) \rangle$! Consider in one variable $f_1 = x^4-1$ and $f_2 = x^6-1$, then $I=\langle f_1, f_2 \rangle = \langle \gcd(f_1,f_2) \rangle = \langle x^2-1\rangle$ by PID. Thus, we have $\langle \text{LT}(I) \rangle = \langle x^2 \rangle$, but $\langle \text{LT}(f_1), \text{LT}(f_2)\rangle = \langle x^4, x^6 \rangle = \langle x^4 \rangle$.

Example of Gröbner basis for $I=\langle x-1,y-2\rangle \subseteq k[x,y]$ is $G = \{x-1,y-2\}$. We claim that $\langle \text{LT}(I)\rangle = \langle x,y\rangle$, and the $\supseteq$ direction is obvious. Assume for contradiction that $f \in k[x,y]\setminus\{0\}$ and $\text{LT}(f) \not\in \langle x, y \rangle$. Then $f$ is a nonzero constant, so $f(1,2) \ne 0$ and $f \not \in I$. However, be careful: note that with $I = \langle x^3 - 1, x^2 y - x \rangle$, the set $\{x^3-1,x^2y-x\}$ is NOT a Gröbner basis since we can find $g=y(x^3-1)-x(x^2y-x) \in I$ but $\text{LT}(g) \not\in \langle x^3, x^2y\rangle$. 

2026-04-22 - More Gröbner bases
===
Every ideal $I$ has a Groebner basis, and the Groebner basis is a basis for $I$ by division algo. 

Let $\{g_1,\dots,g_t\}$ be a Gröbner basis for $I \subseteq k[x_1,\dots,x_n]$. Then the result of division is unique: for all $f \in k[x_1,\dots,x_n]$, there exists some unique $r \in k[x_1,\dots,x_n$]$ such that
1. $f = g+r$ for $g \in I$ 
2. No term of $r$ is divisible by any $\text{LT}(g_i)$.

- By Division algorithm, we have $f = q_1 g_1 + \dots q_tg_t + r$ where no term of $r$ is divisible by any $\text{LT}(g_i)$. This gives us $f=g+r$ with the desired properties, and we show that it is unique: Suppose that $f = g + r = \tilde g + \tilde r$ where $g,\tilde g \in I$ and no term of $r$ or $\tilde r$ is divisible by any $\text{LT}(g_i)$. Then by algebra $r-\tilde r = \tilde g -g \in I$. If $r -\tilde r \ne 0$, then $\text{LT}(r - \tilde r) \in \langle \text{LT}(I)\rangle = \langle \text{LT}(g_1),\dots,\text{LT}(g_t)\rangle$, so $\text{LT}(r - \tilde r)$ is divisible by some $\text{LT}(g_i)$. However, $\text{LT}(r - \tilde r)$ must have come from some term of $r$ or $\tilde r$, leading us to conclude that either $r$ or $\tilde r$ contradicts this property of division algorithm. Thus, $r - \tilde r = 0$ and this remainder is unique.
- Note that this implies the remainder of $f$ upon dividing does not depend on the order of the $g_1,\dots,g_t$ in the Groebner basis. Also note that we have $g = \tilde g$, but the quotients $q_1,\dots,q_t$ are NOT be unique since there might be linear dependence among the $g_i$s.
- We have solved the ideal membership problem: $f \in I \iff r = 0$. If you have $f \in I$, obviously $f = g + 0$ is a valid representation, and since this is unique the division algo will always give us this same representation.

For monomial ideals, every monomial basis is a Groebner basis.

Consequences of Hilbert Basis Theorem:
1. For any possibly infinite ideal $I \in k[x_1,dots,x_n]$, we can define the variety of this ideal as $\mathbf V(I) = \{a \in k^n : \forall f \in I, f(a) = 0\} = V(f_1,\dots,f_s)$ where $I = \langle f_1,\dots,f_s\rangle$ by Hilbert Basis theorem.
2. Contrast: $\mathbf I(V) = \{f \in k[x_1,\dots,x_n] : \forall a \in V, f(a) = 0\}$. Now we can consider both $\mathbf I(\mathbf V(I))$ (Nullstellsatz guy) and $\mathbf V(\mathbf I(V))$ (algebraic closure of a set?) (yay adjoint functors)
3. The ring of polynomials is **Noetherian**: Any ascending chain of ideals in $k[x_1,\dots,x_n]$ stabilizes. If $I_1 \subseteq I_2 \subseteq I_3 \subseteq \dots \subseteq k[x_1,\dots,x_n]$, then $\exists N$ where $I_N = I_{N+j}$ for all $j$.
	1. Sketch of proof: $I = \bigcup_{i=1}^\infty I_i$ is an ideal because they are all contained in each other. Since $I$ is finitely generated, we can write $I = \langle f_1,\dots,f_s \rangle$ and since we have an ascending chain there must be some $N$ for which $f_i \in I_n$ for all $i$. 

2026-04-24 - Buchberger's Criterion for Gröbner Basis
===
When does $\{f_1,\dots,f_s\}$ fail to be a Groebner basis for the ideal they generate? I.e. $\exists f \in \langle f_1,\dots,f_s\rangle, \text{LT}(f) \not\in \langle \text{LT}(f_1),\dots,\text{LT}(f_s)\rangle$.

Write $f = \sum_i h_i f_i$, and take $x^\delta = \max \{\text{LM}(h_i f_i) : 1 \le i \le s\}$, (and remember from homework that $\text{LM}(h_i f_i) = \text{LM}(h_i)\text{LM}(f_i)$). If $\text{LM}(f) = x^\delta$, then since $\text{LM}(f_i)$ divides $x^\delta$ for some $i$, this $f$ is not interesting (does not disprove the $f_i$s not being a Groebner basis). If $\text{LM}(f) < x^\delta$, then the terms of multidegree $\delta$ in $f = \sum_i h_i f_i$ must cancel out! 
- Example: $f_1 = xy-1$ and $f_2 = y^2 - 1$. Then $f = yf_1 - x f_2 = x - y$, and $x^\delta = xy^2$ does not appear anywhere in this polynomial. (This example is actually an example of an S-polynomial)

For nonzero $f,g \in k[x_1,\dots,x_n]$, define their **S-polynomial** ("Syzygy polynomial") to be
$$
S(f,g) = \frac{x^\gamma}{\text{LT}(f)} f - \frac{x^\gamma}{\text{LT}(g)} g
$$
where $x^\gamma$ is the least common multiple of $\text{LM}(f)$ and $\text{LM}(g)$: if $\text{LM}(f) = x^\alpha$ and $\text{LM}(g) = x^\beta$, then we would have $\gamma_i = \max\{\alpha_i,\beta_i\}$ for $1 \le i \le n$. By construction, this polynomial has the property that $\text{LM}(S(f,g)) < x^\delta = \max\left\{\text{LM}\left(\frac{x^\gamma}{\text{LM}(f)}f\right), \text{LM}\left(\frac{x^\gamma}{\text{LM}(g)}g\right)\right\}$.

- Example: Fix the $>_\text{grlex}$ order on $k[x,y]$, and consider $f = x^3 y^2 - x^2 y^3 + x$ and $g = 3x^4y+y^2$. Then $x^\gamma = x^4 y^2$, and
	$$
	\begin{align*}S(f,g) &= \frac{x^4y^2}{x^3y^2}f-\frac{x^4y^2}{3x^4y}g \\ &= x f - \frac{1}{3}yg \\&= -x^3y^3 + x^2-\frac{1}{3}y^2\end{align*}
	$$
	Note that we still have that $\text{LT}(S)$ is divisible by $\text{LT}(f)$! So this still does NOT disprove that $f$ and $g$ form a Groebner basis. So we need to consider $$S(f,g)+y \cdot f = -x^2y^2 +x^2+xy-\frac{1}{3}y^2$$ and finally the leading term of this polynomial $\in \langle f, g \rangle$ is NOT divisible by $\text{LT}(f)$ or $\text{LT}(g)$. Thus, $f$ and $g$ do not form a Groebner basis. The polynomial $S(f,g) + y \cdot f$ is the remainder of dividing $S(f,g)$ by $(f, g)$. 

For $F = (f_1,\dots,f_s)$ with $f_i \in k[x_1,\dots,x_n]$ and $g \in k[x_1,\dots,x_n]$, the book denotes the remainder of dividing $g$ by $F$ as $\overline{g}^F$. Why don't we just write $g \mod F$ bruh.

Theorem (**Buchberger's Criterion**): The set $F=\{ f_1, \dots, f_s \}$ is a Groebner basis for $\langle f_1,\dots,f_s\rangle$ if and only if for $i \ne j$, $\overline{S(f_i, f_j)}^F = 0$.  Note that the order that you divide the $f_i$s in does not matter, even if that changes the remainders you get, so you only have to compute $\binom{s}{2}$ remainders, not $s!$.
- Proof: For $(\implies)$, for any $i$ and $j$, $S(f_i, f_j) \in \langle f_1,\dots,f_s\rangle$, and since its a Gröbner basis, we can solve the ideal membership problem with division so we get 0. The other direction $(\impliedby)$ is too hard, we're not doing it :(. The idea: (1) all cancellations of leading terms in $\sum h_i f_i$ "come from" some  $S(f_i, f_j)$. Then, (2) If $\overline{S(f_i,f_j)}^F = 0 \quad \forall i,j$ then the new leading terms of $\sum h_i f_i$ must be divisible by some $\text{LT}(f_i)$.

- Example: Fix $>_\text{lex}$ with $z > y > x$ and consider $f_1 = z-x^3$ and $f_2 = y-x^2$. Then $x^\gamma = yz$, and $$S(f_1,f_2) = y f_1 - z f_2 = -x^3 y + x^2 z,$$ and we divide $$S(f_1,f_2) = (x^2)\cdot f_1 + (-x^3) \cdot f_2 +0.$$ Thus, $\langle f_1, f_2 \rangle$ is a Grobner basis.

2026-04-27 - Computing Gröbner Bases
===
Algorithm: Given some ideal $I = \langle f_1, \dots, f_s \rangle$, start with $G = F= (f_1,\dots, f_s)$. While $G$ is not a Gröbner basis for $I$, simply add all nonzero $\overline{S(f_i, f_j)}^G$ to the list $G$ (which must exist by Buchberger's Criterion).

Theorem: This algorithm terminates and outputs a Gröbner basis for $I$.
- Proof: Note that at every step, $\langle G\rangle  \subseteq I$ since every $\overline{S(f_i, f_j)}^G \in I$. Also, $\{f_1,\dots,f_s\} \subseteq G$ so $I = \langle G \rangle$. At the end, if all the remainders are 0 we have a Gröbner basis by Buchberger's criterion.
- Proof of termination: Keep track of $\langle \text{LT}(G) \rangle$. If the remainder $r_{pq} \ne 0$, then $\text{LT}(r_{pq}) \not\in \langle \text{LT}(G)\rangle$. So for $G' = G \cup \{r_{pq}\}$, we know $\langle \text{LT}(G') \rangle \supset \langle \text{LT}(G)\rangle$ and so we have a strictly ascending chain of ideals, which must terminate (Noetherian ring).

After doing this algorithm, you can prune your basis.


2026-04-29 - Reducing Gröbner Bases
===

Lemma: If $G=(g_1,\dots,g_s)$ is a Groebner basis and some $p \in G$ has the property that $\text{LT}(p) \in \langle \text{LT}(G \setminus \{p\}) \rangle$, then $G \setminus \{p\}$ is also a Groebner basis for $\langle G \rangle$. 
- Clearly, we have $\langle \text{LT}(G \setminus \{p\}) \rangle = \langle \text{LT}(G)\rangle = \text{LT}(I)$, so $G \setminus \{p\}$ is a Groebner basis for $I$.

A **reduced Groebner basis** satisfies
1. $\text{LC}(g_i) = 1$ for every polynomial in the basis.
2. For every $g_i$, no term of $g_i$ belongs to $\langle \text{LT}(G \setminus \{g_i\})\rangle$.

These reduced Groebner bases always exist and are unique for all ideals and monomial orders. We can compute any Groebner basis (Buchberger) and 
1. Drop any redundant elements according to the lemma (any $g$ where $\text{LM}(g) \in \langle\text{LT}(G\setminus \{g\})\rangle$)
2. Then replace every $g_i$ by its remainder upon division by all the others (iterate this),
3. And finally rescale to $\text{LC}(g_i) = 1$.

This is the analogue of RREF of a matrix?? For linear polynomials $\sum a_i x_i$, this algorithm is actually just equivalent to RREF. Its not really trivial to show that a linear basis yields a linear reduced groebner though.

2026-05-04 - Elimination
===

When solving a system of equations/ideal $I \subseteq k[x_1,\dots,x_n]$, we want polynomials involving only some of the $x_1,\dots,x_n$. Define the **$\ell$th elimination ideal** of $I$ as $$ I_\ell = I \cap k[x_{\ell+1},\dots,x_n].$$
Note that this thing is an ideal of the subring $k[x_{\ell+1},\dots,x_n]=k^{n-\ell}$, but it is NOT an ideal of $k[x_1,\dots,x_n]=k^n$. 

Lemma: Let $V = \mathbf V(I)$ for some ideal $I \subseteq k[x_1,\dots,x_n]$. Then $$\pi_\ell(V) \subseteq \mathbf V(I_\ell) \subseteq k^{n-\ell}$$ where $\pi_\ell : k^n \to k^{n-\ell}$ is given by $\pi_\ell(a_1,\dots,a_n) = (a_{\ell+1},\dots,a_n)$. Note that $\pi_a \circ \pi_b = \pi_{a + b}$. Some functor hiding in here? Geometric interpretation of elimination ideals as projection.

This is the Groebner equivalent of back-substitution. We start with $I_n \subseteq k[x_n]$, find the solutions, then plug them into $I_{n-1} \subseteq k[x_1,x_n]$, and keep going until we get $I$. This will give us extra solutions that we have to check against the full variety by the lemma above. Question: When is $\pi_\ell(V) = V(I_\ell)$?

Elimination theorem: Let $G$ be a Groebner basis for $I \subseteq k[x_1,\dots,x_n]$ with respect to lex order $x_1>x_2>\dots>x_n>c$. Let $$G_\ell = G\cap k[x_{\ell+1},\dots,x_n],$$ then $G_\ell$ is a Groebner basis for the elimination basis $I_\ell$ under the same monomial order $x_{\ell+1} > \dots > x_n > c$. In particular $I_\ell = \langle G_\ell \rangle$. 
- Proof: Since $G_\ell \subseteq G \subseteq I$ and $G_\ell \subseteq k[x_{\ell+1},\dots,x_n]$, we know $G_\ell \subseteq I_\ell = I \cap k[x_{\ell+1},\dots,x_n]$. It suffices to show that $\text{LT}(I_\ell)\subseteq \langle \text{LT}(G_\ell) \rangle$. Let $f \in I_\ell\subseteq I$, and since $G$ is a Groebner basis for $I$, some $\text{LT}(g)$ divides $\text{LT}(f)$ for $g \in G$. Since $f \in k[x_{\ell+1},\dots,x_n]$, this means that $\text{LT}(g) \in k[x_{\ell+1},\dots,x_n]$. By the monomial order, we have that in fact $g \in k[x_{\ell+1},\dots,x_n]$ since if a term in $g$ involved $x^i$ with $i \le \ell$, that term would become the leading term and contradict the condition of $\text{LT}(g)$. Thus, $g \in G$ and $g \in k[x_{\ell+1},\dots,x_n]$, so $g \in G_\ell$ and $\text{LT}(f) \in \langle \text{LT}(G_\ell)\rangle$. 

# 2026-05-06 - Closure and extension in elimination

Remember the idea is to get rid of the first $\ell$ biggest variables, projecting the variety. Let us investigate the relationship $$\pi_\ell(\mathbf V(I)) \subseteq \mathbf V(I_\ell) \subseteq k^{n-\ell}.$$ Turns out for finite varieties this is an equality (?). However:
1. Problems when $k$ is not algebraically closed: Consider $I = \langle y-x^2 \rangle$, which is a parabola. Then $I_1 = I \cap k[y] = \langle 0 \rangle$, so $\mathbf V(I_1) = k$. When $k = \mathbb R$, however, $\pi_1(\mathbf V(I)) = \{r : r \ge 0\}$, yet when $k = \mathbb C$ we get $\pi_1(\mathbf V(I)) = \mathbb C = k$.
2. There can also be missing points even in ACF: consider the hyperbola $I = \langle xy - 1 \rangle$. Again we get that $I_1 = \langle 0 \rangle$ so $\mathbf V(I_1) = k$, but $\pi_1(\mathbf V(I)) = k \setminus \{0\}$. Projective space instead of affine space will fix this problem!!

Closure theorem: For any ideal $I \subseteq k[x_1,\dots,x_n]$ over an algebraically closed field $k$: 
1. $\mathbf V(I_\ell)$ is the smallest variety containing $\pi_\ell(\mathbf V(I))$
2. If $\mathbf V(I) \ne \varnothing$, then for each $\ell$ there is an affine variety $W \subsetneq \mathbf V(I_\ell)$ such that $\mathbf V(I_\ell) \setminus W \subseteq \pi_\ell(\mathbf V(I))$. I.e. there is a strict sub-variety containing all the extra points introduced by closure.

Extension theorem: Let $I$ be an ideal $I = \langle f_1,\dots,f_s \rangle \subseteq k[x_1,\dots,x_n]$ over an algebraically closed field $k$. Write each generator as $$f_i = c(x_2,\dots,x_n) x_1^{N_i} + g_i(x_1,\dots,x_n)$$ where $N_i \ge 0$ and $g_i$ contains no terms in which $\deg(x_1) \ge N_i$. If $(a_2,\dots,a_n) \in \mathbf V(I_1)$ and $(a_2,\dots,a_n) \not \in \mathbf V(c_1,\dots,c_s)$, then $\exists a_1 \in k$ such that $(a_1,a_2,\dots,a_n) \in \mathbf V(I)$. That is, $\mathbf V(I_1) = \pi_1(\mathbf V(I)) \cup (\mathbf V(I_1) \cap \mathbf V(c_1,\dots,c_s))$.
- The fact that $(a_2,\dots,a_n) \not \in \mathbf V(c_1,\dots,c_s)$ implies that at least one of the $c_i(a_2,\dots,a_n)\ne 0$, and $f_i(x_1,a_2,\dots,a_n)$ has degree $N_i > 0$ so it must have a solution. We have shown we solve one of the $f_i$s, but we need to do more work to prove that this solution in fact solves all the $f_i$s simultaneously (by applying the fact that $(a_2,\dots,a_n) \in \mathbf V(I_1)$).

# 2026-05-08 - Elimination for Implicitization
Let $f_1,\dots,f_n\in k[t_1,\dots,t_m]$ with $F = (f_1,\dots,f_n)$. Then we can consider $F : k^m \to k^n$. What equations in $x_1,\dots,x_n$ hold on the image of $F$, $F(k^m)$? On the homework we have shown that this image is always a subset of some ideal (the "monomials" and linearly dependence argument on $F(a)=(f_1(a),\dots,f_n(a))$).

Consider $$I = \langle x_1 - f_1(t),\dots, x_n - f_n(t)\rangle \in k[t_1,\dots,t_m,x_1,\dots,x_n].$$
Note that $$\mathbf V(I) = \text{Graph}(F) = \{(a, F(a)) : a \in k^m\} \subseteq k^{m+n}.$$

We have that $F(k^m) = \pi_m(\text{Graph}(F)) = \{F(a) : a \in k^m\}$ since $\pi_m$ forgets all the $t$s under our monomial order that $t_1 > \dots > t_m > x_1 > \dots > x_n$. 

Theorem: If $k$ is an infinite field (not necessarily ACF), then for $I_m = I \cap k[x_1,\dots,x_n]$ we have that $\mathbf V(I_m)$ is the smallest variety containing $F(k^m)$. We have implicitized our parametric equation! A polynomial vanishes on the entire image iff it is in $I_m$.
- ($\supseteq$) Note that $F(k^m) = \pi_m(\mathbf V(I)) \subseteq \mathbf V(I_m)$.
- ($\subseteq$) Now we will show that if we have some variety $\mathbf V(h_1,\dots, h_s) \supseteq F(k^m)$, then for all $i$ we have $h_i \in I_m$ so $\pi_m(\mathbf V(I)) \subseteq \mathbf V(I_m) \subseteq \mathbf V(h_1,\dots,h_s)$. Choose any generator $h$, so $h(b) = 0$ for all $b \in F(k^m)$, i.e. $h(F(a)) = 0$ for all $a \in k^m$. Divide $h$ by $I$ with $x_1 > \dots > x_n > t_1 > \dots > t_m$. $$h=q_1 \cdot(x_1-f_1(t))+\dots + q_n\cdot(x_n-f_n(t))+r$$ where no term of $r$ is divisible by any $\text{LT}(x_j - f_j(t)) = x_j$. Thus, $r \in x[t_1,\dots,t_m]$, and we wish to show that $r = 0$ so $h \in I$. Let us evaluate $$h(a, F(a)) = q_1(a,F(a)) \cdot (f_1(a)-f_1(a)) + \dots + q_n(a,F(A)) \cdot (f_n(a)-f_n(a)) + r(a) = 0.$$
Here, we are treating $h \in k[x_1,\dots,x_n] \subseteq k[t_1,\dots,t_m,x_1,\dots,x_n]$, so $h(a, F(a)) = h(F(a))$ and similarly $r(a, F(a)) = r(a)$.  Finishing up, $r(a)=0$ for all $a \in k^m$, so $r= 0$ and $h \in I$. Thus, $h \in I_m = I \cap k[x_1,\dots,x_n]$, so every polynomial that vanishes on the image is in this ideal. Thus, the variety must be the smallest.

# 2026-05-11 - Rational Implicitization, Elimination
Note that the previous Implicitization theorem is closely related to the first case of the closure theorem: it applies to only ideals of a specific form (graph), but it works over non-algebraically closed fields! Both are statements that $\mathbf V(I_\ell)$ is the smallest variety containing $\pi_\ell(\mathbf V(I))$.

As with the previous setup, let $f_1,\dots,f_n,g_1,\dots,g_n \in k[t_1,\dots,t_m]$. What about the graph of $F = (f_1/g_1,\dots,f_n/g_n)$? We need to avoid points where $g_i$ is zero, so define $g = \prod g_i \in k[t_1,\dots,t_m]$ and consider $F(k^m \setminus \mathbf V(g))$. Define
$$
J = \langle g_1 x_1 - f_1,\dots, g_n x_n - f_n , \quad u\cdot  g-1\rangle \subseteq k[u,x_1,\dots, x_n,t_1,\dots, t_m]
$$
$$
V(J) = \left\{\frac{1}{g(a)},\frac{f_1(a)}{g_1(a)},\dots, \frac{f_n(a)}{g_n(a)}, a_1,\dots,a_m  : a \in k^m \setminus \mathbf V(g)\right\} \in k^{m+n+1}
$$

Define $u>t_1>\dots>t_m>x_1>\dots>x_n$, and note that $\pi_{m+1}(\mathbf V(J)) \subseteq F(k^m \setminus \mathbf V(g))$, and we get the same theorem that $\mathbf V(J_{m+1})$ is the smallest variety containing the image $F(k^m \setminus \mathbf V(g))$. 

# 2026-05-13 - Nullstellensatz

Given $f_1,\dots,f_s \in k[x_1,\dots,x_n]$...
1. When do we have $f \in \mathbf I (\mathbf V(\langle f_1,\dots,f_s\rangle))$? When does $f(a) = 0$ for all $a \in \mathbf V(\langle f_1,\dots,f_s\rangle)$? 
2. When is $\mathbf V(f_1,\dots,f_s) = \varnothing$?

For $n=1$ case: For any $I = \langle f_1,\dots,f_s \rangle = \langle g \rangle \subseteq k[x]$ (principal ideal domain), we can factor $g$ completely as $$g = c \prod_{i=1}^d (x-r_i)^{m_i}$$ with $c,r_1,\dots,r_d\in k$ and $m_1,\dots,m_d \in \mathbb Z_{>0}$. Every polynomial vanishing on $\mathbf V(g) = \{r_1,\dots,r_d\}$ is divisible by every $x-r_i$, so then $\mathbf I(\mathbf V(g)) = \langle g_\text{red} \rangle$ where $g_\text{red} = \prod\limits^d_{i=1} (x-r_i)$.

And $\mathbf V(f_1,\dots,f_s) = \varnothing$ if and only if $\langle f_1,\dots, f_s\rangle = \langle 1 \rangle = k[x]$ (again by principal ideal  domain). In this case, $f_1,\dots,f_s$ have no common factors as $\gcd(f_1,\dots,f_s) = 1$. 

**Hilbert's Nullstellensatz**: Let $k$ be an algebraically closed field, and let $f,f_1,\dots,f_s \in k[x_1,\dots,x_n]$. Then 
$$
f \in \mathbf I(\mathbf V(f_1,\dots,f_s)) \iff \exists m \in \mathbb Z{>0},f^m \in \langle f_1,\dots,f_s\rangle.
$$
($\impliedby$) Clearly, if $f^m \in \langle f_1,\dots,f_s\rangle$, then $\forall a \in \mathbf V(f_1,\dots,f_s)$ we have $f^m(a)=0$ directly.

**Weak Nullstellensatz** (the case when the variety is empty): Over an algebraically closed field $k$, let $f_1,\dots,f_s \in k[x_1,\dots,x_n]$. Then $$\mathbf V(f_1,\dots,f_s) = \varnothing \iff 1 \in \langle f_1,\dots,f_s\rangle.$$

(Null $\implies$ Weak): the hard direction is implied by the previous statement, since if $\mathbf V(f_1,\dots,f_s) = \varnothing$ then $1 \in \mathbf I(\mathbf V(f_1,\dots, f_s))$ so $1^m = 1 \in \langle f_1,\dots,f_s\rangle$. 

(Weak $\implies$ Null): https://en.wikipedia.org/wiki/Rabinowitsch_trick Proof of the hard direction. Let $I = \langle f_1,\dots,f_s \rangle$, and suppose that $f \in \mathbf I (\mathbf V(I))$ with $f \neq 0$. Define $\tilde I = \langle f_1,\dots,f_s,yf-1\rangle\subseteq k[y,x_1,\dots,x_n]$. Then $\mathbf V(\tilde I)$ is empty since for all $a \in \mathbf V(\tilde I) \subseteq k^{n+1}$ we need to have $f_1(a) = \dots = f_s(a) = 0$ and so $f(a) = 0$ as $f \in \mathbf I(\mathbf V(I))$. Thus, it is impossible to satisfy $(yf - 1)(a) = 0$ with any possible $a$, so $\mathbf V(\tilde I) = \varnothing$. By the weak Nullstellensatz, $1 \in \tilde I$, so $$1 = p_1 f_1 + \dots + p_s f_s + q(yf-1)$$ for some $p_1,\dots,p_s,q \in k[x_1,\dots,x_n,y]$. Plug in $y = 1/f$ to get a rational function:
$$
1=\sum_{i=1}^s p_i(x_1,\dots,x_n,1/f) \cdot f_i +0
$$
For large enough $m$, we have that $f^m \cdot p_i(x_1,\dots,x_n,1/f)$ will become a polynomial in $k[x_1,\dots,x_n]$. We just need $m > \max \deg_y(p_i)$. Thus, there exists some $m \in \mathbb N$ where $f^m \in \langle f_1,\dots,f_s\rangle$.

# 2026-05-15 - Radical Left Ideals and the Nullstellensatz

An ideal $I \subseteq k[x_1,\dots,x_n]$ is **radical** if $f^m \in I$ for some $m \ge 1$ implies $f \in I$.

For any variety $V$, we have that $\mathbf I(V)$ is radical. $f^m \in \mathbf I(V)$ implies $f^m(a) = f(a)^m = 0$ for all $a \in V$, so $f(a) = 0$ and $f \in \mathbf I(V)$. 

The **radical of an ideal** $I \subseteq k[x_1,\dots,x_n]$ is defined as $$ \sqrt I = \{f \in k[x_1,\dots,x_n] : \exists m \ge 1, f^m \in I \}. $$
Lemma: For any ideal, $\sqrt I$ is a radical ideal containing $I$. 
- Closed under sums. Let $f,g \in \sqrt I$, so $f^{m_1} \in I$ and $g^{m_2} \in I$. Let $M = m_1 + m_2 - 1$, and consider $(f+g)^M = \sum\limits_{i=1}^M \binom{M}{i} f^i g^{M-i}$. Either $i \ge m_1$ or $M-i \ge m_2$ for all $i$, so every element of our sum is in $I$. Thus, $f+g \in \sqrt I$.
- Closed under multiplication. Let $f \in \sqrt I$ (so $f^m \in I$) and $h \in k[x_1,\dots,x_n]$. Then $(h \cdot f)^m = h^m f^m \in I$, so $h \cdot f \in \sqrt I$.
- This is a radical ideal. Let $f^m \in \sqrt I$, i.e. $(f^m)^n \in I$. Then $f^{m\cdot n} \in I$, so $f \in \sqrt I$.

Prop (Testing membership in the radical of an ideal): For any $I = \langle f_1,\dots,f_s\rangle \in k[x_1,\dots,x_n]$ and $f \in k[x_1,\dots,x_n]$, $$f \in \sqrt I \iff 1 \in \langle f_1,\dots,f_s,yf-1\rangle\subseteq k[x_1,\dots,x_n,y].$$
Note that this applies to non-algebraically closed $k$, unlike weak nullstellensatz.

Restated **strong nullstellensatz**: If $k$ is algebraically closed, then for all $I \subseteq k[x_1,\dots,x_n]$, $$\mathbf I(\mathbf V(I)) = \sqrt I$$
There is a bijection between varieties and radical ideals.

# 2026-05-18 - Ideal Operations (4.3)

Let $I, J \subseteq k[x_1,\dots,x_n]$. We can define the
1. **ideal sum** $I + J = \{ i + j : i \in I, j \in J \}$. This corresponds to an intersection of varieties. $I + J$ is the smallest ideal that contains both $I$ and $J$ (coproduct).
	1. $\mathbf V(I + J) = \mathbf  V(I) \cap \mathbf  V(J)$. The $\mathbf  V$ functor preserves coproducts and is contravariant? Adjoint with $\mathbf I$?
2. **ideal product** $I \cdot J = \langle i \cdot j : i \in I, j \in J \rangle$. This corresponds to the union of varieties. Note that $I \cdot J \subseteq I$ and $I \cdot J \subseteq J$, but this is NOT the category-theoretic product (that is the ideal intersection $I \cap J$).
	1. $\mathbf V(I \cdot J) = \mathbf V(I) \cup \mathbf V(J)$. 
		1. ($\subseteq$) For any $a \in \mathbf V(I \cdot J)$ we must have $\forall i \in I, j \in J, i\cdot j (a) = 0$ (this is a subset of $I \cdot J$). If $\forall i \in I, i(a) = 0$ we are good to go. So, let $i \in I$ be such that $i(a) \neq 0$. Then $\forall j \in J, (i \cdot j)(a) = 0$, so $j(a) = 0$ by integral domain. 
		2. ($\supseteq$) For any $a \in \mathbf V(I) \cup \mathbf V(J)$, either $\forall i \in I, i(a) = 0$ or $\forall j \in J, j(a) = 0$, so $\forall (\sum ij) \in I \cdot J, (\sum ij)(a) = 0$. 
	2. $I \cap J = (t I +(1-t) J ) \cap k[x_1,\dots,x_n]$.
	3. Intersection preserves radical ideals but product doesn't.

# 2026-05-20 - Zariski Topology

**Zariski Closure** of $S \subseteq k^n$ is $$\overline{S} = \mathbf V(\mathbf I(S))$$
Smallest variety containing $S$, or the smallest closed set in the Zariski topology containing $S$.

Contravariant functor: Let $W$ be a variety and $S$ be any subset. If $S \subseteq W$, $\mathbf I(S) \supseteq \mathbf I(W)$, and $\overline{S} = \mathbf V(\mathbf I(S)) \subseteq \mathbf V(\mathbf I(W)) = W$.

Parallel with the nullstellensatz: if $I = \sqrt{I}$, then $\mathbf I(\mathbf V(I)) = I$. The Zariski topology on a ring has radical ideals as its closed sets!!

Finally proof of Closure Theorem: If $I \subseteq k[x_1,\dots,x_n]$ with $k$ an algebraically closed field and $\pi_\ell : k^n \to k^{n-\ell}$ is the projection map dropping the first $\ell$ coordinates, then $\mathbf V(I_\ell)$ is the Zariski closure of $\pi_\ell(\mathbf V(I))$ where $I_\ell = I \cap k[x_{\ell+1},\dots,x_n]$.
- $(\subseteq)$ Note that $\pi_\ell(\mathbf V(I)) \subseteq \mathbf V(I_\ell)$, and since Zariski closure is the smallest variety $\overline{\pi_\ell(\mathbf V(I))} \subseteq \mathbf V(I_\ell)$.
- $(\supseteq)$ Let $f \in \mathbf I(\pi_\ell(\mathbf V (I))) \subseteq k[x_{\ell+1},\dots,x_n]$. Then $\forall a \in \mathbf V(I)$, $f(a_{\ell+1},\dots,a_n) = 0$. Then, if we consider instead the lift $f \in k[x_1,\dots,x_n]$, we have $f(a) = 0$ for all $a \in \mathbf V(I)$, and so $f \in \mathbf V(\mathbf V(I))\subseteq k[x_1,\dots,x_n]$. Thus, by the nullstellensatz, there is some $m \ge 1$ such that $f^m \in I$. Since our original $f$ was in $k[x_{\ell+1},\dots,x_n]$, this means $f^m \in I\cap k[x_{\ell+1},\dots,x_n] = I_\ell$. Thus, $f \in \sqrt{I_\ell} = \mathbf I(\mathbf V(I_\ell))$, and $\mathbf I(\pi_\ell(\mathbf V(I))) \subseteq \mathbf I(\mathbf V(I_\ell))$. This means that $\overline{\pi_\ell(\mathbf V(I))} =\mathbf V(\mathbf I(\pi_\ell(\mathbf V(I)))) \supseteq \mathbf V( \mathbf I(\mathbf V(I_\ell))) = \mathbf V(I_\ell)$

Ideal quotients: What operations on $I$ and $J$ corresponds to doing $\mathbf V(I) \setminus \mathbf V(J)$?


# 2026-05-22 - Ideal Quotients

Let $I, J \subseteq k[x_1,\dots,x_n]$ be ideals. We define the **ideal quotient** $I:J$ as 
$$
I:J=\{f\in k[x_1,\dots,x_n] : \forall g \in J, fg \in I\},
$$ 
the set of polynomials $f$ such that $fI \subseteq J$. 

Proposition: $I:J$ is an ideal, and $I \subseteq I : J$. (If $f \in I$, then $\forall g, f \cdot g \in I$. Thus, $f \in I:J$.)

Proposition: $$\overline{\mathbf V(I) \setminus \mathbf V(J)} \subseteq \mathbf V(I:J) \subseteq \mathbf V(I)$$
- We wish to show that $\mathbf I(\mathbf V(I) \setminus \mathbf V(J)) \supseteq I:J$ for the first containment. Let $f \in I:J$ and $a \in \mathbf V(I) \setminus \mathbf V(J)$, and we are to show that $f(a) = 0$. Then, let $g \in J$ such that $g(a) \neq 0$, but since $f \in I:J$ we get that $f \cdot g \in I$. Thus, $(f \cdot g)(a) = 0$, but this implies that $f(a) = 0$ as $g(a)\neq 0$ and we are in an integral domain. 

We can define the **saturation** of $I$ by $J$ as
$$
I:J^\infty = \{f\in k[x_1,\dots,x_n] : \forall g \in J, \exists N \ge 0,fg^N \in I\}
$$

Example: $\langle x^2y^3z^4 \rangle : \langle yz\rangle^\infty = \langle x^2\rangle$.

Proposition: 
1. $I:J^\infty$ is an ideal, and $I \subseteq I:J \subseteq I:J^\infty$. 
2. $I:J^\infty = I:J^N$ for some large enough $N$, where $J^N$ is repeated ideal product $J^N = J\cdot J \cdot (\dots)\cdot  J$. Proof by the fact that our ring is Noetherian: $I \subseteq I:J \subseteq I:J^2 \subseteq \dots \subseteq I:J^\infty$
3. $\sqrt{I:J^\infty} = \sqrt{I} : J$

Theorem:
$$
\overline{\mathbf V(I) \setminus \mathbf V(J)} \subseteq \mathbf V(I:J^\infty),
$$ 
with equality when $k$ is an algebraically closed field.
- We wish to show that $\mathbf I(\mathbf V(I) \setminus \mathbf V(J)) \supseteq I:J^\infty$ for the first containment. Let $f \in I:J^\infty$ and $a \in \mathbf V(I) \setminus \mathbf V(J)$, and we are to show that $f(a) = 0$. Then, let $g \in J$ such that $g(a) \neq 0$, but since $f \in I:J^\infty$ we get that $f \cdot g^N \in I$ for some $N \in \mathbb N$. Thus, $(f \cdot g^N)(a) = 0$, but this implies that $f(a) = 0$ as $g^N(a)\neq 0$ and we are in an integral domain. 
- ($\supseteq$ for algebraically closed): Let $f \in \mathbf I(\mathbf V(I) \setminus \mathbf V(J))$, and let $g \in J$. Then $fg \in \mathbf V(I) = \sqrt{I}$ (Nullstellensatz). This means that $f^m g^m \in I$ for some $m \in \mathbb N$, so $f \in \sqrt{I}:J^\infty = \sqrt{I:J^\infty}=\mathbf I(\mathbf V(I:J^\infty))$ (Nullstellensatz).

If $I =\langle f_1,\dots,f_s \rangle \subseteq k[x_1,\dots,x_n]$ and we have $g \in k[x_1,\dots,x_n]$, then for $\tilde I = \langle f_1,\dots,f_s, yg-1\rangle \subseteq k[x_1,\dots,x_n,y]$, we have $I:\langle g\rangle^\infty = \tilde I \cap k[x_1,\dots,x_n]$. If $J = \langle g_1,\dots, g_t \rangle$, then 
$$
I:J^\infty = \bigcap_{i=1}^t (I:\langle g_i\rangle^\infty)
$$

**Computation**: Thus, to compute $I:\langle g_1,\dots, g_t \rangle^\infty$, we first compute a Groebner basis for $I + \langle y_1 g_1 - 1,\dots, y_t g_t - 1\rangle$ and eliminate all the $y$ variables. Very easy!

# 2026-05-27 - Irreducible Varieties $\S4.5$
Example: $I = \langle (y^2-x^3)(x-2), (y^2-x^3)(y-1)\rangle$ and $J = \langle x-2 \rangle$. We can show $I:J^\infty = \langle y^2 - x^3\rangle$. Obviously $\langle y^2 -x^3 \rangle \subseteq I:J^\infty$, but to show the other direction we can show that if $(x-2)^N f \in I$, then for all $t$ we get $(t^3-2)^N f(t^2,t^3) = 0$ so $f(t^2,t^3) = 0$ for all $t \neq 2^{1/3}$. Thus, $f(t^2,t^3)$ is the 0 polynomial in $\mathbb C[t]$, and $f \in \langle y^2 - x^3 \rangle$.

Funny example: Robotic kinematics with $$I = \langle x^2+y^2-1,(z-1)^2+w^2-1,(z-x)^2+(w-y)^2-1\rangle.$$ This is a parallelogram with side length 1 and points fixed at $(0,0)$ and $(1,0)$, but all the joints are free to rotate wherever. However, not all solutions look like a parallelogram: we can collapse $(x,y)$ or $(z,w)$ onto $(1,0)$ or $(0,0)$ respectively, and we just get a single joint. We can throw these solutions away by taking $I:\langle yz\rangle^\infty$. However, we need to work over algebraically closed $\mathbb C$ in order for $\mathbf V(I:J^\infty)$ to be the smallest variety containing $\mathbf V(I) \setminus \mathbf V(J)$.

Def: A variety $V \subseteq k^n$ is **reducible** if we can write $V = V_1 \cup V_2$ where $V_1,V_2 \subseteq V$ are varieties with $V_1 \neq V$ and $V_2 \neq V$. Otherwise, it is **irreducible**.

Def: An ideal $I \subseteq k[x_1,\dots,x_n]$ is **prime** if for  all $f, g \in k[x_1,\dots,x_n]$, $fg \in I$ implies $f \in I$ or $g \in I$.
- Note that every prime ideal is radical.

Prop: A variety $V$ is irreducible if and only if $\mathbf I(V)$ is prime.
- $(\implies)$ Suppose $fg \in \mathbf I(V)$. Take $V_1 = V \cap \mathbf V(f)$ and $V_2 = V \cap \mathbf V(g)$. Then, we know $V = V_1 \cup V_2$. The intersection of varieties is a variety, and since $V$ is irreducible, either $V=V_1$ or $V = V_2$. WLOG take $V=V_1$, so $V \subseteq \mathbf V(f)$ and $f \in \mathbf I(V)$.
- $(\impliedby)$ Suppose $\mathbf I(V)$ is prime and $V = V_1 \cup V_2$ where $V_1$ and $V_2$ are varieties with $V \neq V_1$. Since $V_1 \subsetneq V$, we have $\mathbf I(V_1) \supsetneq \mathbf I(V)$. Thus, we can find $f \in \mathbf I(V_1) \setminus \mathbf I(V)$. Let $g \in \mathbf I(V_2)$, and $fg \in \mathbf I(V)$ as every $a \in V$ either vanishes on $V_1$ or $V_2$. Since $\mathbf I(V)$ is prime and $f \not\in \mathbf I(V)$, we must have $g \in \mathbf I(V)$ so $\mathbf I(V_2) \subseteq \mathbf I(V)$ and since $V_2 \subseteq V$ we have $\mathbf I(V_2) = \mathbf I(V)$. Thus, $V_2 = V$ and $V$ is irreducible.

# 2026-05-29 - Irreducible Decompositions
Let $k$ be an infinite field, and let $f_1,\dots,f_n \in k[t_1,\dots,t_m]$. Let $F : k^m \to k^n$ be given by $F(\mathbf t) = (f_1(\mathbf t),\dots,f_n(\mathbf t))$. Then $V = \overline{F(k^m)}$ is an irreducible variety.
- Note $$\mathbf I(V) = \{ h \in k[x_1,\dots,x_n] : \forall t \in k^m,h(F(t)) = 0\}.$$ $$h \in \mathbf I(V) \iff h(F(t)) = 0 \in k[t_1,\dots,t_m].$$ Suppose $g \cdot h \in \mathbf I(V)$. Then $(g\cdot h)(F(t)) = g(F(t))\cdot h(F(t))=0 \in k[t_1,\dots,t_m]$. This means that either $g(F(t)) = 0$ or $h(F(t)) = 0$, so $\mathbf I(V)$ is a prime ideal. Thus, $\overline{F(k^m)}$ is irreducible.
- This is closely related to the fact that $k^m$ is an irreducible variety since $\langle 0 \rangle$ is prime. 

A similar theorem can be proven for rational parameterizations $(\S4.5 \text{ Theorem } 6).$

The contrapositive implies that a reducible variety does not have any polynomial or rational parametrization.

Theorem: Any affine variety $V \subseteq k^n$ is a union $V = V_1 \cup \dots \cup V_m$ of finitely many irreducible varieties.
- If $V$ is reducible, we can break up $V$ into $V = V_1 \cup V_2$ with $V_1 \neq V$ and recurse down into $V_1$. We can show that this must terminate, because if we can write $V = V_1\cup \dots$ then we get an infinite ascending chain of ideals $V \supsetneq V_1 \supsetneq V_2 \supsetneq \dots$. Hilbert Basis Theorem: Polynomial rings are Noetherian.

We call a decomposition $V = V_1 \cup \dots \cup V_m$ with $V_i$ irreducible a **minimal decomposition** if none of the varieties contain each other: $V_i \not\subseteq V_j$ for any $i \neq j$. Every variety has a unique minimal decomposition.
- From Nullstellensatz, if $k$ is ACF, then every radical ideal $I \subseteq k[x_1,\dots,x_n]$ is the intersection of finitely many prime ideals $I = P_1\cap P_2 \cap \dots \cap P_m$ and has a unique minimal decomposition. We can show that $V=V_1\cup V_2\implies \mathbf I(V) = \mathbf I(V_1) \cap \mathbf I(V_2)$ since contravariant functor preserving (co)limits?
	- There are computer algebra techniques for computing this prime decomposition of radical polynomial ideals.

# 2026-06-03 - Groebner Bases with Parameters

Take the inverse kinematics example. If we want to vary the target point, we need to compute a new Groebner basis each time! To solve this, compute a G.B. in this polynomial ring:
$$
k(a,b,\ell_1,\dots,\ell_n)[c_1,s_1,\dots,c_n,s_n]
$$
Here, $k(a,b,\ell_1,\dots,\ell_n)$ is the field of rational functions on those variables??? The $(a,b)$ is our target point, the $\ell$s are the lengths of our joints, and our IK problem gives us back the $c$s and $s$s, the sines and cosines of the angles of each joint. 

A point in the variety of this ideal gives the data that for each $c_i$ and $s_i$, we have a rational function in $(a,b,\ell_1,\dots,\ell_n)$ such that plugging everything in satisfies our equations.


**Parametric G.B.** Let $f_1,\dots,f_s \in k[x_1,\dots,x_n,t_1,\dots,t_m]$, and $I = \langle f_1,\dots,f_s\rangle$. If $I \cap k[t_1,\dots,t_m] = \{0\}$ and $G$ is a Groebner basis for $I$ wrt lex order with $x_1>\dots>x_n>t_1>\dots>t_m$, then 
1. $G$ is a Groebner basis for $\langle f_1,\dots, f_s \rangle \subseteq k(t_1,\dots,t_m)[x_1,\dots,x_n]$.
2. There exists a variety $W \subsetneq k^m$ such that for every $a \in k^m \setminus W$, then $G \mid_{t=a}$ is a Groebner Basis for $\langle f_1(x,a),\dots, f_s(x,a)\rangle \subseteq k[x_1,\dots,x_n]$. 

# 2026-06-05 - Computer Vision

Projective plane: A camera $(C, H)$ is a point $C \in \mathbb R^3$ along with a plane $H$, and we project a point $W \in \mathbb R^3$ onto the intersection of $\overline{CW}$ with $H$, a point $x \in H \cong \mathbb R^2$.

Given the projections $x$, $x'$ onto cameras $(C,H)$ and $(C',H')$, we can deduce the point $W$ that produced this.

Problem: Given $x_1,\dots,x_n$ and $x'_1,\dots,x'_n \in \mathbb R^2$, can we test whether these are images of some unknown points $w_1,\dots,w_n \in \mathbb R^3$ under some unknown cameras $(C,H)$ and $(C',H')$?
- A point $\mathbf x \in H$ gives a line in $H'$ (between $\pi_{C'}(\mathbf x)$ and $\pi_{C'}(C)$), so let this line be $\{(x',y') : a x'+b y' + c = 0\}$ parametrized by coeff $(a,b,c)$. There is a linear transformation taking $\mathbf x$ to $(a,b,c)$, so $$\exists F \in \mathbb R^{3\times 3}, \begin{bmatrix} x &y &1 \end{bmatrix} F \begin{bmatrix} x' \\ y'\\ 1 \end{bmatrix} = 0.$$
- For $\mathbf e =\pi_C(C')$, we have $\begin{bmatrix} \mathbf e & 1 \end{bmatrix} F = \mathbf 0$, and similarly $\mathbf e' = \pi_{C'}(C)$ we have $F\begin{bmatrix}\mathbf e' \\ 1\end{bmatrix}= \mathbf 0$. We have $\text{rank}(F) \le 2$, and the $\mathbf e'$ point belongs to the line $\ell'$ for every $\begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$.
- Points $x_1,\dots,x_n,x'_1,\dots,x'_n \in \mathbb R^2$ are images of some world points $w_1,\dots,w_n \in \mathbb R^3$ under the images of two cameras if and only if $\exists F \in \mathbb R^{3\times 3}$ with $\text{rank}(F) = 2$ such that $\begin{bmatrix} x_i & 1 \end{bmatrix} F \begin{bmatrix} x'_i \\ 1 \end{bmatrix} = \mathbf 0$ for all $1 \le i \le n$.
	- Set up some equations for Groebner basis: Take some $F_{ij}$ and constrain $\det F_{ij} = 0$ (so that $\text{rank}(F) \le 2$) and $\forall 1 \le i \le n, \begin{bmatrix} x_i & 1 \end{bmatrix} F \begin{bmatrix} x'_i \\ 1 \end{bmatrix} = \mathbf 0$, and $F_{11} = 1$ (normalization).
	- Turns out $n=7$ is the magic number where we have 9 equations in 9 variables, so usually we get finitely many solutions.
	- General strategy: given $n$ points, randomly choose 7 of the points and solve for $F$. Then, check $\begin{bmatrix} x_i & 1 \end{bmatrix} F \begin{bmatrix} x'_i \\ 1 \end{bmatrix} = \mathbf 0$ for the other points. If yes, keep it, otherwise try again.
	- $F$ is called the **fundamental matrix**.
- For most choices of $x_1,\dots,x_7,x'_1,\dots,x'_7 \in \mathbb R^2$, the reduced Groebner basis for the $F_{ij}$ is nice. We get a cubic polynomial in $F_{33}$ and every other entry is just a linear combo of this parameter.
	- Phones do this for panoramas
