---
title: 'notes: math 327, math 300, phys 143, math 207'
subhead: 'real analysis, intro to proofs, physics waves and fake quantum, and differential equations'
created: 'Jun 26 2026'
tags: 'hide-ls'
---


Hi! These notes are part of this [larger collection](/granty29/blog/2026/notes/) of notes from my freshman year at UW.

## Table of Contents
<!-- toc -->


# MATH 327 - Real Analysis
Matthew Conroy, Spring 2026.

Field axioms and Order axioms: 
Reals are an ordered field.

Absolute value.
- $\forall x, |x| \ge 0$
- $|x y| = |x| |y|$
- $|x + y| \le |x| + |y|$

If $\forall x \in \mathbb R, f(f(x)) = f(x)$, then $f$ is idempotent. E.g. $\lfloor x \rfloor$, $|x|$, $x$, $1$.

If $S$ is finite and nonempty, both $\min S$ and $\max S$ exist.

Completeness axiom: Bounded above and nonempty implies supremum exists in $\mathbb R$, but not in $\mathbb Q$.
 - This statement is equivalent to "bounded below and nonempty implies infimum exists".

"Bounded" = bounded both above and below.

If $S$ is bounded below, then $\{-x \mid x \in S\}$ is bounded above.

Archimedean property is a consequence of the completeness axiom: For all $x,y \in \mathbb R$ with $x>0$, there exists $n \in \mathbb N$ such that $n x > y$. There are no infinitely big or small reals.
- Proof: Because $x>0$, it suffices to show that $\exists n, n > y/x$. Assume FTSOC that $\forall n \in \mathbb N, n \le y/x$.  Then $\mathbb N \subseteq \mathbb R$ is bounded above and this has a supremum by the completeness axiom. Then $\sup \mathbb N - 1$ is not a natural bound, so let $n'\in\mathbb N$ be a natural such that $n' > \sup \mathbb N - 1$. Adding $1$ to both sides, we get $n' + 1 > \sup \mathbb N$, contradicting the fact that it is an upper bound. Our assumption was false and there is such an $n$ that $n > y/x$.

All nonempty finite sets have a maximum (Induction on set cardinality).

A set $S\subseteq \mathbb R$ is dense if for all $x \in \mathbb R$ and all $\varepsilon > 0$, there exists $s \in S$ such that $|x -s| < \varepsilon$.

Lemma: Let $a,b \in \mathbb R$ be reals with $b - a > 1$. Then $\exists n \in \mathbb Z, n \in (a, b)$.
- Proof: Suppose $a > 1$. Let $S = \{n \in \mathbb N : n < a\}$, and this must be nonempty since $1 \in S$. Again since $a > 1$, by the archimedean property we have $m \in \mathbb N$ where $m > a$. Thus, $S \subseteq \mathbb N_{<m}$, so $S$ is finite. Thus, $S$ has a max $M = \max S$, and $M \in S$ with $M < a$. And then $M + 1 \not\in S$ so $M + 1 \ge a$. Transitive property: $M < a$, and $< + 1 < a + 1 < b$. Thus, $a \le M + 1 < b$.  Suppose that $M + 1 = a$. Then $a < a + 1 \le M + 2 < b$. Thus, we either have $M + 1$ or $M + 2$ in the interval $(a, b)$.
- Now suppose that $a \le 1$: then $1 - a \ge 0$, so by the archimedean principle we have $n \in \mathbb N$ such that $n > 1 - a$. So $a + n > 1$. Now we apply our weaker version to obtain $m \in \mathbb N$ in the interval $(a +n, b+ n)$, and thus $m - n \in (a, b)$ and $m - n \in \mathbb Z$.

Theorem: $\mathbb Q$ is dense in the reals. Let $a,b\in\mathbb R$ with $a < b$, then $\exists q \in \mathbb Q$ with $a < q < b$.
- Proof: We have $b-a>0$, so by the archimedean principle we can find $n \in \mathbb N$ with $n(b-a) > 1$. Thus, $(na, nb)$ is an interval of length $>1$, so there must exist $m \in \mathbb Z$ in that interval by the previous lemma. Thus, $a < \frac{m}{n} < b$.


A sequence $a_n : \mathbb N \to \mathbb R$ has a limit $L \in \mathbb R$ if
$$
\forall \varepsilon > 0, \exists N \in \mathbb N, \forall n > N, |a_n - L | < \varepsilon.
$$


Irrationals are dense in the reals: Suppose $\forall x \in (a,b), x \in \mathbb Q$. Then we have an injection $(a,b) \to \mathbb Q$, so $(a,b)$ is countable. This is a contradiction with the fact that $(a,b)$ is uncountable.

## Convergence Theorems

If $(a_n)$ is a convergent sequence, then $(a_n)$ is bounded: Choose some $\varepsilon$, and for $n > N$ $\varepsilon$ is the bound, but $n \le N$ is a finite set and is this bounded. 
- Therefore, if $(a_n)$ is not bounded, it does not converge.

Abuse of notation: 
- If $\forall B>0, \exists N$ such that $\forall n > N, a_n > B$, then $(a_n)$ does not converge (it is unbounded) and we write $\lim a_n = +\infty$.
- If $\forall B<0, \exists N, \forall n>N, a_n < B$, then $(a_n)$ divergens and $\lim a_n = -\infty$.

Theorem: If $(a_n)$ and $(b_n)$ both converge, then 
- $c_n = a_n + b_n$ also converges with $\lim c_n = \lim a_n + \lim b_n$.
- $\forall s \in \mathbb R$, the sequence $c_n = s a_n$ converges with $\lim c_n = s \lim a_n$.
- $c_n = a_n \cdot b_n$ converges with $\lim c_n = \lim a_n \cdot \lim b_n$.


Squeeze theorem: If for all $n \in \mathbb N$, $a_n \le b_n \le c_n$ and $\lim a_n = \lim b_n=L$, then $\lim c_n = L$.

Let $(S_n)$ be a sequence where $\forall n, S_n \ne 0$ and $\lim S_n \ne 0$. Then $\exists m > 0$ such that $\forall n, |S_n| > m$. We say $S_n$ is bounded away from zero.

Let $(S_n)$ be a sequence where $L = \lim S_n \ne 0$ and $\forall n, S_n \ne 0$. Then the sequence $\left(\frac{1}{S_n}\right)$ also converges to $1/L$.

Let $(a_n)$ and $(b_n)$ be convergent sequences with $\lim b_n \ne 0$. Then 
$$
\lim \left(\frac{a_n}{b_n}\right) = \frac{\lim a_n}{\lim b_n}.
$$

==Monotone Sequences==: A sequence $(a_n)$ is increasing or non-decreasing if $\forall n, a_{n+1} \ge a_n$ and decreasing or non-increasing if $\forall n, a_{n+1} \le a_n$. These sequences are **monotone**. 
- Theorem: All monotone and bounded sequences converge: For the sequence $(a_n)$ consider the set $A = \{a_n : n \in \mathbb N \}$. WLOG take that $a_n$ is increasing and bounded above. Then by the *completeness axiom* $A$ has a supremum, and $\lim a_n = \sup A$ by definition of supremum (for any $\varepsilon$ we can find some $a_N \in A$ where $a_N > \sup A - \varepsilon$, and since the sequence is monotone we get all $a_n$ after this one are also greater and thus $\forall n > N, |a_n - \sup A| < \varepsilon$).
	- Cursed example: $a_{n+1} = \frac{1}{2} a_n + \frac{1}{a_n}$ with $a_1 = 2$ is monotone and converges to $\sqrt{2}$. First show that $a_n > \sqrt{2}$ implies that
  $$
  \begin{align}\frac{1}{2} a_n + \frac{1}{a_n} &> \sqrt{2} \\ \frac{1}{4} a_n^2 + \frac{1}{a_n^2} + 1&>2 \\ \frac{1}{4}a_n^2 + \frac{1}{a_n^2}&>1 \\ \frac{1}{4}a_n^4 + 1&>a_n^2 \\ \left(\frac{1}{4}a_n^2 -1\right)a_n^2&>-1\end{align}
  $$
  And since $a_n > \sqrt{2}$ we know $a_n^2 > 2$ so $\frac{1}{4} a_n^4 > 1$ and so $\frac{1}{4} a_n^2 - 1 > 0$ and we get the desired result. So $a_n$ is bounded below by $\sqrt{2}$, and we can show it is decreasing by evaluating $\frac{1}{2} a_n + \frac{1}{a_n} \le a_n$. Then we can say $\lim a_{n+1} - \lim \frac{a_n}{2} - \lim \frac{1}{a_n} = 0$, and then solve for $\lim a_n$! *This sequence actually comes from doing newtons method on $x^2 - 2$.*

## Cauchy Sequences
A sequence $(x_n)$ is **Cauchy** iff for all $\varepsilon > 0$, there exists some $N \in \mathbb N$ such that for all $n,m > N$, we have $|x_m - x_n| < \varepsilon$.

A sequence converges if and only if it is Cauchy.

Let $(a_n)$ be a sequence, and let $n_k$ be a strictly increasing sequence of positive integers. Then $(a_{n_k})$ is a **subsequence** of $(a_n)$.
- If $(a_n)$ converges to $L$, every subsequence also converges to $L$. The contrapositive is very useful to prove non convergence.

## Series

Comparison test: Suppose $\sum a_n$ and $\sum c_n$ are series.
1. If $|a_n| < c_n$ for $n \ge N_0$ for $N_0 \in \mathbb N$ and $\sum c_n$ converges, then $\sum a_n$ converges. 
2. If $a_n \ge c_n \ge 0$ for $n \ge N_0$ for $N_0 \in \mathbb N$ and $\sum c_n$ diverges, then $\sum a_n$ diverges.

Cauchy condensation test: Suppose $\sum a_n$ is a decreasing positive term series ($\forall n, a_n \ge 0\land a_{n+1}\le a_n$). Then $\sum a_n$ converges if and only if $S=\sum_{i=0}^\infty 2^i a_{2^i}$ converges.
$$
\frac{a_1 + S}{2} =a_1 + \sum_{i=0}^\infty 2^i a_{2^{i+1}}\le \sum a_n\le \sum_{i=0}^\infty 2^i a_{2^i} = S
$$
Easy way to prove convergence/divergence of $p$-series $1/n^p$.

If $\sum a_n$ converges, then $\lim a_n = 0$ (Cauchy criterion it).

**Absolute convergence test**: If $\sum |a_n|$ converges, then $\sum a_n$ also converges. 
- Proof: Since $\sum |a_n|$ converges we have some $N \in \mathbb N$ where for all $\varepsilon > 0$ and $m,k > N$, we get
  $$
  \left|\sum_{i=m}^k a_i\right|\le\sum_{i=m}^k |a_i| = \left|\sum_{i=m}^k |a_i|\right| < \varepsilon
  $$
  so we converge by Cauchy criterion.

**Limit comparison test**: Let $\sum a_n$ and $\sum b_n$ be positive term series ($a_n, b_n > 0$). Suppose that $\lim \frac{a_n}{b_n} = L$ and $L > 0$. Then $\sum a_n$ converges if and only if $\sum b_n$ converges.
- Proof: We can choose some $\varepsilon < L$ and get $L - \varepsilon < \frac{a_n}{b_n} < L + \varepsilon$ so $b_n(L-\varepsilon) < a_n < b_n (L + \varepsilon)$. If $\sum a_n$ converges then $\sum b_n(L-\varepsilon)$ converges by comparison test, and if $\sum a_n$ diverges, then $\sum b_n (L+\varepsilon)$ diverges, so $\sum b_n$ must diverge because otherwise $\sum b_n(L+\varepsilon) = (L + \varepsilon)\sum b_n$. The backward direction of the iff is true since $\lim \frac{a_n}{b_n} = L \implies \lim \frac{b_n}{a_n} = L^{-1}$ (positive term series).

**Ratio test**: Suppose we have a series $\sum a_n$ where $\lim \left|\frac{a_{n+1}}{a_n}\right|= L$. Then $\sum a_n$ converges if $L < 1$ and diverges if $L > 1$. N.B. that $L=1$ tells us nothing.
- If $L < 1$ we find $|a_{n+1}|  \le r |a_n|$ for all $n > N$ for some $N$ and $r<1$. Then $|a_n| < C r^n$ for some $C$ and all $n$, so we have the absolute sum is bounded above by a geometric series that converges, so $\sum a_n$ converges.
- If $L > 1$, we find $|a_{n+1}| \ge r |a_n|$ for all $n > N$ for some $N$ and $r > 1$. Then $|a_n| > C r^n$ for some $C$ and all $n$, so the absolute sequence diverges and the sum definitely diverges.

**Root test**: Let $(a_n)$ be a sequence with $L = \lim |a_n|^{1/n}$. Then $\sum |a_n|$ converges if $L < 1$ and diverges if $L > 1$. N.B. If $L$ does not exist/converge or if $L=1$ this test tells us nothing.

Alternating Series: Let $(a_n)$ be a sequence of non-negative terms. Then we say $\sum (-1)^n a_n$ an alternating series

**Alternating series test**: Let $(a_n)$ be a decreasing sequence of non-negative reals, and suppose $\lim a_n = 0$. Then $\sum (-1)^{n+1} a_n$ converges.
- Proof: Idea is to consider the sequence of partial sums $S_k = \sum\limits_{i=1}^k (-1)^{i+1}a_i$. First consider $S_{2n+3} - S_{2n+1} = a_{2n+3}-a_{2n+2} \le 0$ (summing the sequence 2 terms at a time, odd terms. since $a_n$ is decreasing). Now consider the even terms $S_{2n+2} - S_{2n} = a_{2n} - a_{2n+2}\ge 0$. Then $S_{2n}$ is an increasing sequence, and $S_{2n+1}$ is a decreasing sequence. Then, since $S_{2m+1} = S_{2m} + a_{2m+1}$, note that we have
  $$
  S_2\le S_{2m} \le S_{2m+1}\le S_1.
  $$
  Thus, $S_{2n}$ and $S_{2n+1}$ are bounded and monotonic, so they converge. Then $\lim S_{2m+1} = \lim S_{2m} + \lim a_{2m+1}$, and so $\lim S_{2m} = \lim S_{2m+1}$. We can now prove this is $\lim S_m$ too pretty easily. 


## Continuous Functions
Sequence definition: A function $f : U \to \mathbb R$ is continuous at $x_0 \in U$ if and only if for every sequence $(x_n) : \mathbb N \to U$ with $\lim x_n = x_0$, we have $f(x_0) = \lim f(x_n)$.

$\varepsilon$-$\delta$ definition: A function $f : U \to \mathbb R$ is continuous at $x_0 \in U$ if and only if
$$
\forall \varepsilon > 0, \exists \delta>0,\forall x\in U, |x-x_0|<\delta \implies |f(x) - f(x_0)| < \varepsilon.
$$

These two defs are equivalent. Sequence $\implies$ $\varepsilon$-$\delta$ is a proof by contradiction, as not $\varepsilon$-$\delta$ lets us build a sequence that breaks the sequence definition. $\varepsilon$-$\delta$ $\implies$ Sequence 

Pathological function: Thomae's function is continuous on all irrationals and discontinuous on all rationals.
$$
f(x)=\begin{cases}1/q & x \in \mathbb Q \text{ with } x = p/q \text{ and } p,q \text{ relatively prime.}  \\ 0 & \text{otherwise}\end{cases}
$$

The set of discontinuities of any function must be $F_{\sigma}$, the countable union of closed sets.

$$
f(x) = \begin{cases} -x & x \in \mathbb Q \\ x & x \not \in \mathbb Q.\end{cases}
$$
is continuous at $0$ and discontinuous everywhere else.

## Bolzano-Weierstrass Theorem
Every bounded sequence has a convergent subsequence.  Rephrasing:
A subset of $\mathbb R^n$ is sequentially compact if and only if it is closed and bounded.
- Suppose $(a_n)$ is a bounded sequence with $a_n \in [a,b]$ for all $n$. Then we can binary search as either $[a,m]$ or $[m, b]$ must have infinitely many terms with $m \in [a,b]$. Then apply Cauchy.

Every convergent sequence contained in a closed interval has a limit in the interval.

All subsequences of a convergent sequence $a_n$ converge to $\lim a_n$.

**Extreme value theorem**: If $f$ is continuous on $[a,b]$, then $f$ is bounded on $[a,b]$ and the image of $[a,b]$ has a max and min.
- Assume for contradiction that $f$ is not bounded. Define a sequence $x_n \in \mathbb [a,b]$ where $|f(x_n)| > n$. By Bolzano Weierstrass, there is some convergent subsequence $y_n$. Then $\lim y_n \in [a,b]$, but clearly $\lim f(y_n)$ does not converge. Thus, $f(\lim y_n) \neq \lim f(y_n)$ so our function $f$ is not continuous at $\lim y_n \in [a,b]$, a contradiction.
- Now, consider $M = \sup f([a,b])$. Then we can define a sequence $x_n \in [a,b]$ with $M - f(x_n) < 1/n$. Again by Bolzano Weierstrass there is some convergent subsequence $y_n$, and $\lim y_n \in [a,b]$. Since $f$ is continuous at $\lim y_n$, we know $M = \lim f(y_n) = f(\lim y_n)$, so we attain the sup. Same logic for inf.


## Uniform continuity
A function $f:A \to \mathbb R$ is **uniformly continuous** if and only if 
$$
\forall \varepsilon > 0, \exists \delta > 0, \forall x,y \in A, |x-y|<\delta \implies |f(x)-f(y)| < \varepsilon.
$$

**Theorem**: If $f$ is continuous on a closed interval $[a,b]$, then $f$ is uniformly continuous on $[a,b]$. 
- Assume FTSOC that $f$ is not uniformly continuous. Let $\varepsilon > 0$ be such that for all $\delta > 0, \exists x,y \in [a,b],|x-y|<\delta \land |f(x)-f(y)|\ge \varepsilon$. Define a sequence $\delta_n = \frac{1}{n}$, and we have sequences $x_n$ and $y_n$. Since $x_n, y_n \in [a,b]$, by Bolzano Weierstrass there is a convergent subsequence $x_{n(j)}$. Note that since $|x_n-y_n| < \delta_n$, we must have that $y_{n(j)}$ also converges with $\lim x_{n(j)} = \lim y_{n(j)} \in [a,b]$. Since $f$ must be continuous at this point, $f(\lim x_{n(j)}) = f(\lim y_{n(j)})$ so $\lim |f(\lim x_{n(j)}) - f(\lim y_{n(j)})| = 0$. This means that $f(x_{n(j)})$ and $f(y_{n(j)})$ must get within $\varepsilon$ of each other for big enough $n$ (small enough $\delta$), contradicting the construction of $x_n$ and $y_n$. Our assumption was false, and $f$ is uniformly continuous.


# MATH 300 - Intro to Proofs
Farbod Shokrieh, Winter 2026.

Statement/sentence

Remark: $P \wedge Q$ is not a statement, but a "statement form". We only get a statement when we substitute statements for $P$ and $Q$ like $(1+1=2)\wedge(x=x)$.


Axioms of Set theory
- **axiom of separation**: Let $X$ be a set and $P : X \to \text{Prop}$ be a proposition on $X$. Then $\exists(A \subseteq X), A = \{x \in X \mid P(x)\}$.
	- Note that the ambient set $X$ is required, and we can only define subsets. Otherwise we have **Russel's paradox**

Quantifiers: $\exists!$ = exists unique, etc etc

$\begin{align}A = B &\iff \forall x, (x \in A \iff x \in B) \\ &\iff A \subseteq B \land B\subseteq A\end{align}$

Def Subset: $A \subseteq B \iff \forall x, (x\in A \implies x \in B)$

Union, intersection, setminus:

$A \cup B = \{x \mid x \in A \lor x \in B\}$, 

$A \cap B = \{x \mid x \in A \land x \in B\}$, 

$A \setminus B = \{x \mid x \in A \land x \not\in B\}$.


Theorems on cartesian product.
1. $(A \cup B) \times C = (A \times C) \cup (B \times C)$
2. $(A \cap B) \times C = (A \times C)\cup (B \times C)$
3. $(A \setminus B)\times C = (A\times C) \setminus (B\times C)$
4. $\varnothing \times A = \varnothing$
5. If $A,B\ne \varnothing$, then $A\times B = B\times A \iff A = B$.
6. If $U_A \subseteq A$ and $U_B \subseteq B$, then $U_A \times U_B \subseteq A \times B$.

## Partitions and Relations
Let $S \ne \varnothing$. A partition $\Pi$ of $S$ is a pairwise disjoint collection of subsets of $S$ that cover $S$. I.e. $\Pi = \{ A_i \in \mathcal P(S) \}_{i \in I}$ such that $A_i \ne \varnothing$, $\forall (i \ne j \in I), A_i \cap A_j = \varnothing$, and $\bigcup A_i = S$.

A relation $R$ is a set $R \subseteq S \times S$. The inverse relation $R^{-1} = \{(x,y)\mid (y,x) \in R\}$ (sends $\ge\;\to\;\le$). The complement is the negation of the relation ($\ge\;\to\;\lt$).

Properties of relations ($\forall x,y,z \in S$):
1. Reflexive: $x R x$.
2. Symmetric: $x R y \implies y R x$.
3. Transitive: $x R y \land y R z \implies x R z$.
4. Antisymmetric: $x R y \land y R x \implies x=y$.
5. Equivalence relation: If reflexivity, transitivity, and symmetry hold.
6. (Partial) ordering: If reflexivity, transitivity, and antisymmetry hold.
	1. Total (or linear) ordering: $x R y \lor y R x$.

Hasse diagrams for orderings: a total ordering's diagram will just be a line

Given a partition $\Pi=\{A_i\}_{i\in I}$ on $S$, there is an induced equivalence relation $R$ where $xRy \iff \exists(i \in I), x,y \in A_i$. In fact, all equivalence relations are induced by a partition.
- Let $\sim$ be an equivalence relation on $S$. Define the equivalence class of $x\in S$ to be $[x] = \{y \in S \mid x \sim y\}$. Then the set $\bigcup_{x\in S} \{[x]\}$ is a partition.

## Functions
A function $f : A \to B$ is a relation $f \subseteq A \times B$ such that $\forall (x \in A), \exists! (y \in B), (x, y) \in f$.

Examples of functions: Inclusion map $\iota : A \xhookrightarrow{} B$ for $A \subseteq B$. Being a subset is the same thing as the existence of an inclusion map. Constant maps. Identity maps.

Equality of functions: $f = g$ if they are equal as sets (i.e. domains are equal and $\forall x$ in the domain, we have $f(x) = g(x)$).
- If $f : \mathbb Z \to \mathbb Z$ and $g : \mathbb R \to \mathbb R$ are both given by $x \mapsto x + 1$, then $f \ne g$, but $g \mid_\mathbb{Z} = f$ and $f$ is an (non-unique) extension of $g$ from $\mathbb{Z}$ to $\mathbb R$.
- Note that the codomain/range doesn't matter. We consider $f : \mathbb R \to \mathbb R$ to be equal to $g : \mathbb R \to \mathbb C$ if they agree on all inputs.

consider the image of $f : A \to B$, given by $f(A) = \{f(x) \mid x \in A\}$. We say $f$ is **surjective** if $f(A) = B$. We say that $f$ is **injective** if $\forall (x,y \in A), f(x) = f(y) \implies x = y$. A function $f$ is **bijective** (one-to-one correspondence) if it is both injective and surjective.


## Cardinality shit

We use $\tan : (-\pi / 2, \pi/2) \to \mathbb R$ as a bijection, and $f : (a, b) \to (0, 1)$ given by $x \mapsto \frac{x-a}{b-a}$ is also a bijection. Thus, $R \approx (a,b)$.

Pigeonhole principle: For $n > m$, there exists no injection $f : \mathbb N_n \to \mathbb N_m$. Proof by inducting on $n$, proving that $\forall (m < n), \lnot \exists(\text{injective } f : \mathbb N_n \to \mathbb N_m)$. Take the convention that $0 \in \mathbb N$, and $\mathbb N_n = \{0,1,\dots, n-1\}$.
- For $n=0$, there is no $m<n$ so its trivial.
- Inductive: We have $\forall (m < n-1), \lnot \exists(\text{injective } f : \mathbb N_{n-1} \to \mathbb N_m)$. Assume FTSOC that we have $m < n$ and injective $f : \mathbb N_n \to \mathbb N_m$.  If $m=0$, we have $n>0$ and no function exists. Thus, WLOG assume $m > 0$. Consider $g:\mathbb N_m \to \mathbb N_m$ given by
  $$
  g(x) = \begin{cases}m-1 & x = f(n-1) \\ f(n-1) & x = m-1 \\ x & \text{otherwise}\end{cases}
  $$
  $g$ is clearly a bijection, and we have injective $g \circ f : \mathbb N_n \to \mathbb N_m$. Consider the restriction $g \circ f |_{\mathbb N_{n-1}}$. By the injectivity of $g\circ f$, there does not exist any other preimage for $g(f(n-1))$, so $g(f(n-1)) \not\in (g\circ f)(\mathbb N_{n-1})$, and $m-1$ is not in the image of $g\circ f|_{\mathbb N_{n-1}}$. Therefore, we can consider $g\circ f : \mathbb N_{n-1} \to \mathbb N_{m-1}$ to be an injective function, contradicting the inductive hypothesis. Our assumption was false, and for all $m < n$ there does not exist any injection $f : \mathbb N_n \to \mathbb N_m$.


Generalized pigeonhole: If $n$ pigeons go into $m$ holes and $n > km$, then some hole will have at least $k+1$ pigeons. Proof: If not, every hole has at most $k$ pigeons, so we must have had at most $km$ pigeons, but we have $n > km$ pigeons!

Generalization 2: Given a set $A = \{a_1, \dots, a_{n+1}\} \subseteq \mathbb Z$, there exist $x, y \in A$ with $x \ne y$ and $x - y = k n$ for some $k \in \mathbb Z$ (i.e. $x \equiv y \mod n$). Proof: Consider the remainder by $n$ function $f : A \to \mathbb N_n$. If there are no two elements that share remainders, $f$ is injective, a contradiction with pigeonhole principle.

Ramsey theory: $R(3,3)=6$: https://en.wikipedia.org/wiki/Ramsey%27s_theorem#R(3,_3)_=_6


## Feb 27
Proof of PIE: $|A \cup B| = |A| + |B| - |A \cap B|$: do $A \cup B = (A \setminus B) \cup (A \cap B) \cup (B\setminus A)$ as the union of disjoint sets. Then we do $A = (A \setminus B) \cup (A \cap B)$ as the union of disjoint sets (and same for $B$), and we do algebra on the equations.

$|A \times B| = |A| \cdot |B|$: Write $A \times B = \bigcup_{a \in A} \{a\}\times B$ as the union of pairwise disjoint sets.


## Mar 2
Cantor's theorem: $|S| < |\mathcal P(S)|$:  This is true for the empty set, so only look at nonempty sets. Assume FTSOC that we have a bijection $f : S \to \mathcal P(S)$. Consider $U \subseteq S$ defined by $U = \{x \in S \mid x \not\in f(x)\}$. Then consider the element $y = f^{-1}(U)$. We have that $y \in U$ if and only if $y \not\in f(y)$ by the definition of $U$. However, $f(y) = U$ by the definition of $y$, so $y \not\in f(y)$ if and only if $y \not\in U$. We have $y \in U$ if and only if $y \not\in U$, a contradiction. 
- $f:p \to (p \to \text{False})$ and $g : (p \to \text{False})\to p$, so by LEM we either have $p$, in which case we use $f\;p\;p$  to get $\text{False}$, or we have $n : p \to \text{False}$ so we use $n\;(g\;n)$ to get $\text{False}$. Actually, we don't need LEM: we have $h \;p := f\; p\; p$ so $h : p \to \text{False}$!!

## Mar 4
Every subset $A \subseteq B$ of a countable set $B$ is countable: only need to consider countably infinite $A$: use well-order of the naturals to repeatedly select the least element of $A$ to put it into bijection with $\mathbb N$.
- implies that if we have an injection into the naturals, our set is countable.

# PHYS 143 - Honors Waves, Light, & Heat (Fake Quantum edition)
Miguel Morales, Spring 2026.


## Week 1
Simple Harmonic Motion

Energy conservation

```mathematica
In[14]:= x[t_] := A Cos[Sqrt[k/m] t + \[Phi]]
In[15]:= 1/2 k x[t]^2 + 1/2 m (x'[t])^2
Out[15]= 
1/2 A^2 k Cos[Sqrt[k/m] t + \[Phi]]^2 + 
 1/2 A^2 k Sin[Sqrt[k/m] t + \[Phi]]^2
```

Read out $v_\text{max} = A \omega = A \sqrt{\frac{k}{m}}$.

Vertical/external force: $F = F_\text{sp} + F_g = -k (x - x_0) + F_g$, can just set 0 at equilib.

Measurement
- fractional uncertainty. When multiplying two values take the larger of the two, when taking powers multiply by the power (binomial rule on $(x + \delta x)^n$, ignore higher powers). Really dumb.
- Uncertainty = stddev. Report to at max 2 sigfigs, the sigfigs of the uncertainty and the mean estimate must match.
- Take the max of random uncertainty and tool uncertainty. Good starting point for tool uncertainty is half of the interval step.
- Regression: A good fit should pass through 2/3 of the uncertainty bars of the points. Say the model is consistent with the data

Proportional is not the same as linear! Affine...
"Unrelated" = dependent var is constant wrt. independent var.

## Week 2

Undamped oscillation: $\omega_0 = \sqrt{k / m}$.
Undamped Pendulum $\omega = \sqrt{g / L}$.

Underdamped oscillator: $$\omega = \sqrt{\omega_0^2 - \frac{b^2}{4m^2}}$$
Full solution is
$$
A \exp\left({-\frac{b}{2m}t}\right) e^{i\omega t}
$$


## Week 3
Wave equation
$$
u_{tt} = \frac{F_T}{\mu} u_{xx}
$$
or more generally
$$
\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u.
$$

Wave speed is $v=\sqrt{\frac{F_T}{\mu}}$. Solution is
$$
u(x,t) = A\exp(i\omega t+ikx)+B\exp(i\omega t-ikx)
$$

Wavenumber $k = 2\pi/\lambda$ where $\lambda$ is wavelength. Wave speed is $v=\lambda f$ or $\omega/k$. Remember $\omega = 2\pi/T$ where T is period, and $f = 1/T$.


## 2026-04-15

General formula for doppler shift:
$$
f_\text{obs} = \frac{v\pm v_\text{obs}}{v \mp v_\text{src}} f_\text{src}
$$
where $v$ is the speed of sound in the medium, $v_\text{src}$ is speed of source relative to medium, and $v_\text{obs}$ is speed of observer relative to medium. For sources moving towards each other, use $+v_\text{obs}$, and otherwise for sources moving away from each other use $-v_\text{obs}$.


Power and intensity of waves is propto amplitude^2, with proportionality constant depending on the type of wave $$I = \frac{P}{\text{Area}} \propto A^2$$
This is because we have total energy = $\int_{\text{wavefront}}\frac{1}{2}kA^2\,dx$ where this pseudo-spring constant $k$ has units $N/m$ per unit area of wavefront (pressure per meter displaced?).

Decibels
$$
\beta = 10 \log_{10}\left(\frac{I}{I_0}\right)
$$


For waves, we take $m =\text{num antinodes} - 1$: we start counting from $m=0,1,2,3$ where $m=0$ is usually no wave? I think that's how it works.
- Standing sound wave = pressure 90deg out of phase from displacement, since $p \propto -\nabla\cdot d$ for some reason. Open end = pressure = 1 atm, so pressure antinode and displacement node. Closed end = 0 displacement, so displacement antinode and pressure node.

Textbook convention for phase constant is $\sin(\omega t + k x + \phi)$. Sin, + phi!!


## 2026-04-20
Young's double slit experiment and their cursed small angle approximations...
1. Distance between the sources = $d$, distance to screen $L$, and $d <<< L$.
2. Parameterize points along screen with angle $\theta$ from midpoint between sources, call distance from point on screen to midpoint $r$.
3. We have that $\Delta r$ between the sources is $r_2 - r_1 = d \sin\theta$, right angle between the parallel lines.
4. Then $y$ along the screen is $y/L = \tan \theta$, and we take small angle $\tan \theta = \theta$.
5. We get constructive interference whenever $d \sin\theta = k \lambda$, and we can plug in our small angle $\theta$ and also take that $\sin\theta = \theta$ to get $d y /L = k \lambda$.
$$
y = \frac{k L \lambda}{d}
$$


For diffraction grating, the analysis is the same except you CANNOT USE THE SMALL ANGLE APPROXIMATION since $d$ (distance between each slit) is too small. Thus, you just end up with $y = L \tan \theta$ and $d \sin \theta = k \lambda$.
- Diffraction grating is useful because slits are narrower and brighter, spaced further apart from small $d$. You can do spectroscopy since small changes in $\lambda$ = relatively large changes in $\theta$.
- if the intensity at a single slit is $I_0$, amplitude at interference will be $N \sqrt{I_0}$ (cause amplitude of wave is sqrt intensity), so we have intensity $I \propto N^2 I_0$. With no interference (random decoherent phase shifts), we expect an intensity of $I \propto N I_0$ instead, so since each fringe is $N$ times as bright they need to be $1/N$ the width to conserve energy? Weird ass argument.

## 2026-04-24 - Single slit, Heuygens-Fresnel principle
For single slit, we can use Heugen's principle and integrate over the width of the slit $a$. That's too hard though, so we can play a trick and pair each point source with a point source $a/2$ away from it, and notice they destructively interfere with the same conditions as the single slit case (we have an $a/2$ double slit, and we need the phase diff to be $\lambda/2$, so the two effects cancel. We can consider $\frac{a}{2} \sin(\theta) = k \lambda / 2$, or we can consider more pairings (maybe pair each source with one $a/4$ away) as $\frac{a}{2k} \sin(\theta) = \lambda / 2$ which is obviously the same thing).
- Dark fringe at $y = \frac{k L \lambda}{a}$, this time for $k=\pm1,\pm2,\dots$ instead of starting at $0$.
- We work with destructive interference since pairwise destructive implies destructive overall, but pairwise constructive does NOT imply constructive overall.

To deal with double slit, the interference is $$\Delta \phi' = \frac{2\pi d}{\lambda L} y$$ and we can use $$
2a\cos\left(\frac{\Delta \phi'}{2}\right)\exp(i(kx-\omega t))
$$ where we redefine $a=A_0 /\sqrt{L}$ or whatever to conserve energy, and we pretend the wave has the same amplitude over the entire screen? We take the intensity $I \propto \text{Amplitude}^2$ as
$$
I \propto 4 |a|^2\cos^2\left(\frac{\pi d}{\lambda L}y\right)
$$

## 2026-05-04 - Optical Frequency Comb
- A series of lasers spaced $\Delta \omega$ apart after a prism results in a strobing white light at $\Delta \omega$. Bright intensity when all lasers are in phase for constructive interference, which happens every $\Delta \omega$ if $\Delta \omega$ divides $\omega$? If $\Delta \omega$ does not divide $\omega$ fourier transform it. $$ \cos\left([\omega+k\Delta \omega] \left[0 + \frac{2\pi}{\Delta \omega}m\right] \right)$$

## 2026-05-27 - Schrodinger

# MATH 207 - Differential Equations
Guillermo Sanmarco, Winter 2026.

## Linear stuff
$$
y'(x)+P(x)y = Q(x)
$$
$$
[\mu(x) y]' = \mu(x) Q(x)
$$
$$
\mu'(x) = \mu(x)P(x) 
$$
$$
\mu(x) = e^{\int P(x)\,dx}
$$

$$
y = \frac{1}{e^{\int P(x)\,dx}}\int \mu(x) Q(x)\,dx
$$

## IDK
$$\sin(\theta)=-i\frac{1}{2}\left(e^{i\theta} - e^{-i\theta}\right)$$
$$
\cos(\theta) = \frac{1}{2}\left(e^{i\theta} + e^{-i\theta}\right)
$$

$$
\therefore Ae^{iat}+Be^{-iat} \mapsto A \sin(at)+B \cos(at).
$$

$$
\begin{align*}
A \cos(a t) + B \sin(a t) = \sqrt{A^2 + B^2} \cos(at-\varphi)\\
A= \sqrt{A^2+B^2}\cos(\phi),\qquad B=\sqrt{A^2+B^2} \sin(\phi)
\end{align*}
$$


$$
\sin(\theta+\varphi)=\sin(\theta)\cos(\varphi)+\cos(\theta)\sin(\varphi) \qquad \cos(\theta + \varphi) = \cos(\theta) \cos(\varphi) - \sin(\theta)\sin(\varphi)
$$


$$
\cos(x)^2 = \frac{1}{2}
$$

## Laplace Transform

$$
\mathcal L\{f(t)\} = s\mapsto \int_0^\infty f(t) e^{-s t}\,dt
$$
Works for any $f(t)$ bounded by exponential: $f(t) \le e^{r t}$ for some $r \in \mathbb R$. The transformed $F(s)$ may exist for all $s$ or just for all $s > C$. The laplace transform is a bijection on the space of functions.
$$
\mathcal L\{e^{c t}\} = \int_0^\infty e^{c t - s t}\, dt = \left[\frac{1}{c-s}e^{(c-s)t}\right]^\infty_0 = \frac{1}{s-c}
$$

Time-domain Derivative rule (integration by parts):
$$
\mathcal L\{f'(t)\} = \int_0^\infty f'(t)e^{-s t}\,dt = \left[f(t) e^{-s t} + s \int f(t) e^{-s t}\right]_0^\infty = s \cdot \mathcal L\{f(t)\} - f(0).
$$

Frequency-domain Shift rule (variable substitution $s \mapsto s-a$):
$$
\mathcal L\{e^{a t} f(t)\} = \int_0^\infty f(t)e^{-(s-a)t}\,dt = F(s-a)
$$

Time-domain shift rule (u-sub, convolution theorem with dirac delta):
$$
\mathcal L\{f(t-a)u(t-a)\} = \int_0^\infty e^{-s t} f(t-a)u(t-a)\,dt =\int_0^\infty e^{-s(t+a)}f(t)\,dt = e^{- a s} \mathcal L\{f(t)\}.
$$

Frequency-domain derivative rule (time-domain $t$-multiplication): evaluate the derivative of $F(s$)
$$
-\frac{d}{ds} F(s) = -\frac{d}{ds}\int_0^\infty f(t)e^{-s t}\,dt = \mathcal L\{t f(t)\}.
$$


Gamma function:
$$
\mathcal L \{t^n\} = \int_0^\infty t^n e^{-s t}\,dt = -\frac{1}{s}\left[e^{-s t} t^n - n\int e^{-s t} t^{n-1}\right]_0^\infty = \frac{n}{s} \mathcal L\{ t^{n-1}\} = \frac{n!}{s^{n+1}}
$$

Convolution theorem
$$
\mathcal L\{ f \ast g\} = F \cdot G
$$
$$
\mathcal L \{f \cdot g\} = F \ast G
$$

Dirac delta $\delta(t) = u'(t)$. 


Region of convergence: In $s$-domain, everything to the right of the last pole converges (this is when our $e^{-s t}$ damping can overpower our function $f(t)$). One sided: Initial conditions at $f(0)$.

