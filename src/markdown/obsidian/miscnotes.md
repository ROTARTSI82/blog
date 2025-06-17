---
title: 'Miscellaneous Notes'
created: "Jun 16 2024"
---
## Table of Contents
<!-- toc -->

# Lagrange Multipliers
The problem: Maximize scalar function $f(\vec{v})$ under the constraints $c_i(\vec{v}) = 0$.

Solution: Solve for $\nabla f(\vec{v}) = \sum_i \lambda_i \nabla c_i(\vec{v})$. The values of the $\lambda_i$ do not matter, only the value of $\vec{v}$.

If the gradient of $f$ does not lie purely in the space spanned by the gradients of the constraints, then we can always increase $f$ by moving along the constraint manifold (moving along the constraint manifold = moving in a direction perpendicular to the gradients of the constraint functions, think about contours of constant value). Adding constraints removes constraints on the gradient of $f$.

# Cramer's Rule

A system can be represented as
$$
\begin{bmatrix}
i & j & k \\ l & m & n \\ p & q & r
\end{bmatrix}
\begin{bmatrix}
x \\ y \\ z
\end{bmatrix}
=
\begin{bmatrix}
a \\ b \\ c
\end{bmatrix}
$$

^abe765

where we are solving for $x$, $y$, $z$ and know everything else.


Because the area of a parallelepiped is base times height, (diagram most likely needed here)
$$
\begin{vmatrix}
1 & 0 & x \\
0 & 1 & y \\
0 & 0 & z \\
\end{vmatrix}
= z
$$
$$
\begin{vmatrix}
x & 0 & 0 \\
y & 1 & 0 \\
z & 0 & 1
\end{vmatrix}
= x
$$

^ab78d8

For determinants, we know
$$
\det{(A)}\cdot\det{(B)} = \det{(AB)}
$$


[[Cramer's Rule#^ab78d8|Focus on x]]: The [[Cramer's Rule#^abe765|original equation]] says $\begin{bmatrix} x \\ y \\ z\end{bmatrix}$ transformed by the matrix must be $\begin{bmatrix} a \\ b \\ c\end{bmatrix}$, so we know
$$
\begin{bmatrix}
i & j & k \\ l & m & n \\ p & q & r
\end{bmatrix}
\begin{bmatrix}
x & 0 & 0 \\
y & 1 & 0 \\
z & 0 & 1
\end{bmatrix}
=
\begin{bmatrix}
a & j & k \\ b & m & n \\ c & q & r
\end{bmatrix}
$$

^84f58c



By taking the determinants on both sides of [[Cramer's Rule#^84f58c|this equation]] and substituting in $x$, we get Cramer's rule:
$$
\begin{vmatrix}
x & 0 & 0 \\
y & 1 & 0 \\
z & 0 & 1
\end{vmatrix}
=
x
=
{
\begin{vmatrix}
a & j & k \\ b & m & n \\ c & q & r
\end{vmatrix}
\over
{
\begin{vmatrix}
i & j & k \\ l & m & n \\ p & q & r
\end{vmatrix}
}
}
$$


Similar logic can be applied for $y$ and $z$.


# $\alpha$-$\beta$ pruning Minimax/Negamax search
Returns a lower bound on the true score of a node

**Search function returns a lower bound for the real score, unless

#### Fail hard
```c++
// alpha = best score we can get (from whole search up until this depth)
// beta = best score our opponent can get (from whole search up until this depth)
// fail hard: Only returns values in [alpha, beta]
int search(Position pos, int alpha, int beta) {
	for (auto move : pos.legal_moves()) {
		pos.make(move);
		
		// next beta = our best move
		// next alpha = best score opponent can get (beta)
		// negatives for perspective change
		int score = -search(pos, -beta, -alpha);
		
		pos.unmake(move);

		alpha = std::max(score, alpha);
		if (alpha >= beta) {
			// higher up, the search found a better
			// branch, so this path doesn't need to be explored further
			return beta;
		}
	}

	return alpha;
}
```

#### Fail soft Version
Can return values outside of the $[\alpha, \beta]$ range
```c++
int search(Position pos, int alpha, int beta) {
	int val = std::numeric_limits<int>::min();
	for (auto move : pos.legal_moves()) {
		pos.make(move);
		val = std::max(val, -search(pos, -beta, -alpha));
		pos.unmake(move);

		alpha = std::max(val, alpha);
		if (alpha >= beta)
			return val;
	}

	return val;
}
```


### Null windows
Quick boolean testing
```c++
int test = -search(pos, -alpha - 1, -alpha);
```
- Deeper iterations experience tons of $\beta$ cutoffs & is super quick
- Check `alpha < test && test < beta`


# Comp Arch
## Boolean Problem (2025-01-23)

$$
\left[\left(A^C\cap B^C \cap (A\cap B)^C\right)\cup (A \cap B)\right]\cap C \cup (A\cup B)\cap (A\cap B)^C \cap C^C
$$


Simplify the following expression:
$$
(a+\overline{b})(b+\overline{a})(\overline{ab}\,\overline{b}\,\overline{a}+ab)c+(a+b)\,\overline{ba}\,\overline{c}
$$

**Solution:**
Just expand out using DeMorgan's + axioms and eventually you will get
$$
\begin{align}
&= \overline{a}\,\overline{b}\,c + a b c + a \overline{b}\,\overline{c} + \overline{a}\,b\,\overline{c} \\
&= \boxed{a\oplus b\oplus c}
\end{align}
$$

where $\oplus$ denotes XOR.


**Derivation:** Note that
$$
a\oplus b = \overline{a}\,b+a\,\overline{b} = (a + b)\overline{ab}
$$

We can write a simple expression for $a \oplus b \oplus c$ by nesting these expressions, using both versions for the $a\oplus b$ subexpression in $(a\oplus b)\oplus c$:
$$
\overline{\left(\overline{a}\,b+a\,\overline{b}\right)}\;c+\left[(a+b)\overline{ab}\right]\overline{c}
$$
Expanding the extreme left term with de Morgan's twice:
$$
\overline{\left(\overline{a}\,b+a\,\overline{b}\right)}=\overline{\left[a \overline{b}\right]}\overline{\overline{a}b}=(\overline{a}+b)(a+\overline{b})
$$

However, by the idempotency we can expand it and AND it together with itself with no effect:

$$
= (\overline{a}+b)(a+\overline{b})(\overline{a}+b)(a+\overline{b}) = (\overline{a}+b)(a+\overline{b})(\overline{a}\,\overline{b}+ba)
$$

By the $a + b = a + \overline{a}b$ absorption identity, we can further do
$$
= (\overline{a}+b)(a+\overline{b})(\overline{ab}\,\overline{a}\,\overline{b}+ba)
$$

Substituting this into the original expression, we obtain the full problem.


## Buffer
```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}[american, voltage shift=0.5]
\draw (0, 0) to[short,*-] (2, 0) node[anchor=west] {out};
\draw (0, 0) to[cute open switch,name=A] (0, 2) node[vcc,anchor=south] {5 V};
\draw (0, 0) to[R] (0, -2) node[ground] {};
\draw (A) node[anchor=west] {A};
\end{circuitikz}
\end{document}
```

| $A$ | out = $A$ |
| -- | --|
| 0 | 0 |
| 1 | 1 |


```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}
\draw (0, 0) node[buffer port] (AND) {};
\end{circuitikz}
\end{document}
```

<div style="page-break-after: always;"></div>

### AND

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}[american, voltage shift=0.5]
\draw (0, 0) to[short,*-] (2, 0) node[anchor=west] {out};
\draw (0, 0) to[cute open switch,name=A] (0, 2) to[cute open switch,name=B] (0, 4) node[vcc,anchor=south] {5 V};
\draw (0, 0) to[R] (0, -2) node[ground] {};
\draw (A) node[anchor=west] {B} (B) node[anchor=west] {A};
\end{circuitikz}
\end{document}
```


| $A$ | $B$ | out = $AB$ |
| -- | -- | -- |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}
\draw (0, 0) node[and port] (AND) {};
\end{circuitikz}
\end{document}
```

<div style="page-break-after: always;"></div>

### OR

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}[american, voltage shift=0.5]
\draw (0, 0) to[short,*-] (2, 0) node[anchor=west] {out};
\draw (0, 0) to (0, 1) to (1, 1);
\draw (0,1) to (-1, 1);
\draw (-1, 1) to[cute open switch,name=A] (-1, 3);
\draw (1, 1) to[cute open switch,name=B] (1, 3);
\draw (1, 3) to (0, 3);
\draw (-1, 3) to (0, 3);
\draw (0, 3) to (0, 4) node[vcc] {5 V};
\draw (A) node[anchor=west] {A} (B) node[anchor=west] {B};
%% \draw to[cute open switch] (0, 4) node[vcc,anchor=south] {5 V};
\draw (0, 0) to[R] (0, -2) node[ground] {};
\end{circuitikz}
\end{document}
```

| $A$ | $B$ | out = $A+B$ |
| -- | -- | -- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}
\draw (0, 0) node[or port] (AND) {};
\end{circuitikz}
\end{document}
```

<div style="page-break-after: always;"></div>

## Inverter

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}[american, voltage shift=0.5]
\draw (0, 0) to[short,*-] (2, 0) node[anchor=west] {out};
\draw (0, 0) to[R,] (0, 2) node[vcc,anchor=south] {5 V};
\draw (0, 0) to[cute open switch,name=A] (0, -2) node[ground] {};
\draw (A) node[anchor=east] {A};
\end{circuitikz}
\end{document}
%% test
```

| $A$ | out = $\overline{A}$ |
| -- | --|
| 0 | 1 |
| 1 | 0 |

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}
\draw (0, 0) node[not port] (AND) {};
\end{circuitikz}
\end{document}
```

<div style="page-break-after: always;"></div>

### NAND
```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}[american, voltage shift=0.5]
\draw (0, 0) to[short,*-] (2, 0) node[anchor=west] {out};
\draw (0, 0) to[cute open switch,name=A] (0, -2) to[cute open switch,name=B] (0, -4.5) node[ground,anchor=south] {};
\draw (0, 0) to[R] (0, 2) node[vcc] {5 V};
\draw (A) node[anchor=east] {A} (B) node[anchor=east] {B};
%% recomp
\end{circuitikz}
\end{document}
```


| $A$ | $B$ | out = $\overline{AB}$ |
| -- | -- | -- |
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}
\draw (0, 0) node[nand port] (AND) {};
\end{circuitikz}
\end{document}
```

<div style="page-break-after: always;"></div>

### NOR

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}[american, voltage shift=0.5]
\draw (0, 0) to[short,*-] (2, 0) node[anchor=west] {out};
\draw (0, 0) to (0, -1) to (1, -1);
\draw (0,-1) to (-1, -1);
\draw (-1, -1) to[cute open switch,name=A] (-1, -3);
\draw (1, -1) to[cute open switch,name=B] (1, -3);
\draw (1, -3) to (0, -3);
\draw (-1, -3) to (0, -3);
\draw (0, -3) to (0, -4) node[ground] {};

\draw (A) node[anchor=east] {A} (B) node[anchor=east] {B};

%% \draw to[cute open switch] (0, 4) node[vcc,anchor=south] {5 V};
\draw (0, 0) to[R] (0, 2) node[vcc] {5 V};
\end{circuitikz}
\end{document}
```

| $A$ | $B$ | out = $\overline{A+B}$ |
| -- | -- | -- |
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}
\draw (0, 0) node[nor port] (AND) {};
\end{circuitikz}
\end{document}
```

<div style="page-break-after: always;"></div>

## Curveball 1

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}[american, voltage shift=0.5]
\draw (0, 0) to[short,*-] (2, 0) node[anchor=west] {out};
\draw (0, 0) to (0, 1) to (1, 1);
\draw (0,1) to (-1, 1);
\draw (-1, 1) to[cute open switch, name=C] (-1, 3);
\draw (1, 1) to[cute open switch, name=B] (1, 3);
\draw (1, 3) to (0, 3);
\draw (-1, 3) to (0, 3);
\draw (0, 3) to[cute open switch,name=A] (0, 5) node[vcc] {5 V};
\draw (A) node[anchor=west] {A} (B) node[anchor=west] {C} (C) node[anchor=west] {B};

%% \draw to[cute open switch] (0, 4) node[vcc,anchor=south] {5 V};
\draw (0, 0) to[R] (0, -2) node[ground] {};
\end{circuitikz}
\end{document}
```

| $A$ | $B$ | $C$ | out = $A(B+C)$ |
| -- | -- | -- | -- |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |

<div style="page-break-after: always;"></div>

## Curveball 2

```tikz
\usepackage{circuitikz}
\begin{document}
\begin{circuitikz}[american, voltage shift=0.5]
\draw (0, 0) to[short,*-] (2, 0) node[anchor=west] {out};
\draw (0, 0) to (0, 1) to (1, 1);
\draw (0,1) to (-1, 1);
\draw (-1, 1) to[cute open switch, name=A] (-1, 5);
\draw (1, 1) to[cute open switch, name=B] (1, 3) to[cute open switch, name=C] (1, 5);
\draw (1, 5) to (0, 5);
\draw (-1, 5) to (0, 5);
\draw (0, 5) to (0, 6) node[vcc] {5 V};
\draw (A) node[anchor=west] {A} (B) node[anchor=west] {C} (C) node[anchor=west] {B};

%%\draw to[cute open switch] (0, 4) node[vcc,anchor=south] {5 V};
\draw (0, 0) to[R] (0, -2) node[ground] {};
\end{circuitikz}
\end{document}
```

| $A$ | $B$ | $C$ | out = $A+BC$ |
| -- | -- | -- | -- |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |



# Harmonic Series Stuff

$$
P_n(x) = \sum_{k=1}^x {k^n}
$$

$$
P_n(x+d)=P_n(x)+\sum_{k=1}^d {(x+k)^n}
$$
$$
P_{-n}(x+d)=P_{-n}(x)+\sum_{k=1}^d {1\over{(x+k)^n}}
$$

$$
H(x)=P_{-1}(x)
$$
$$
\lim_{x\to \infty}{[H(x+d)-H(x)]} = 0
$$
$$
\lim_{x \to \infty} {H'(x)} =0
$$

## The *Actual* Stuff

$$
\lim_{x\to \infty}H(d+x) = \lim_{x\to \infty}H(x)
$$
$$
\lim_{x\to \infty}{[H(d) + \sum_{k=1}^x {1\over{d+k}}]} = \lim_{x \to \infty} {\sum_{k=1}^x {1\over{k}}}
$$
$$
H(d)=\lim_{x\to \infty} {\sum_{k=1}^x {({1\over{k}} - {1\over{d+k}})}}
$$

## Extending  Where $n\le0$

$$
\lim_{x\to \infty}P_{n}(d+x) = \lim_{x\to \infty}P_{n}(x)
$$
$$
\lim_{x\to\infty}[P_{n}(d)+\sum_{k=1}^x {{(d+k)^n}}] = \lim_{x\to\infty}\sum_{k=1}^x{{k^n}}
$$

$$
P_n(d) = \lim_{x\to\infty}\sum_{k=1}^x[{k^n}-{(d+k)^n}] \quad\rm{for\space}n\le0
$$

## Cases for $n\gt0$


$$
P_n(d) = \sum_{k=1}^d {k^n} = \lim_{x\to\infty}\sum_{k=1}^x[{k^n}-{(d+k)^n}] \quad\rm{for\space}n\le0
$$


# Cursed U-sub
$$
\int_0^1 {\sqrt{1-x^2}dx}
$$
$$
\sin(u)=x, {dx\over{du}}=\cos{u}
$$
$$
\int_0^{\pi/{2}} {\sqrt{1-\sin^2{u}}\cos(u)du}=\int_0^{\pi/2} {\cos^2(u)du}
$$
$$
\cos^2{u} = \cos{2u} + \sin^2{u} = \cos{2u}+1-\cos^2{u}
$$
$$
\cos^2{u} = {1\over{2}}\cos{2u}+{1\over{2}}
$$
$$
w=2u, \int_0^{\pi} ({1\over{4}}\cos{w}+{1\over{4}})dw
$$
$$
{1\over{4}}[\sin{w}+w|^{\pi}_{0}={\pi\over{4}}
$$

# $e^x$ Stuff
$$
e^x = {d\over{dx}} (e^x) = \lim_{h\to 0} {{e^{x+h}-e^x}\over{h}} = e^x \lim_{h\to 0} {{e^h-1}\over{h}}
$$
$$
\lim_{h\to 0} {{e^h - 1}\over h}=1
$$
$$
\lim_{h\to 0} {e^h\over{h}} = \lim_{h\to 0} [{h\over{h}} + {1\over{h}}]
$$
$$
\lim_{h\to 0} e^h = \lim_{h\to 0} (h + 1)
$$
$$
e = \lim_{h\to 0} (h+1)^{1\over h}
$$
finally:
$$
\int_0^a \int_0^x f(y)\,dy\,dx=\int_0^a (a-y)f(y)\,dy
$$


$$
\rm{\frac{d}{dx}} = \lim_{h\to0}\frac{e^{h \rm{\frac{d}{dx}}}-\mathbb{1}}{h}
$$

## Orgo Chem 2022-09-25

R = carbon-containing thing ()

| Hybridization | End | Internal |
| ---- | --- | -- |
| $sp^2$ | aldehyde ($\ce{R-C(=O)H}$) | ketone $\ce{RC(=O)R'}$ |
| $sp^3$ | alcohol ($\ce{ROH}$) | ether $\ce{R-O-R'}$|
| Both | (carboxyllic) acid ($\ce{C(=O)OH}$) | ester |

Primary Amines: 
$\ce{NH_2R}$
Secondary Amines: $\ce{NHR^1R^2}$
Tertiary Amines: $\ce{NR^1R^2R^3}$

## Le Chatelier's 2022-12-07

$\ce{H2(g) + 3H2(g) <-> 2NH3(g)  \Delta H = -129 kJ/mol}$

Equilibrium will counteract any stress

**Increase in temperature**
- LCP: Reaction runs in direction that is endothermic/opposite of temp change
    - Runs forward
- Q/K Analysis: "Q stays the same," K must increase to agree with LCP

## Math of Kinetics
For the reaction
$\ce{aA + bB + ...-> pP + ...}$

Let $A(t)$ be the concentration of the limiting reactant in the reaction.
Let $a$ be the coefficient that reactant has in the equation.
Let $R(t)$ be the rate of the reaction.
Let $k$ be any positive real number.
Let $n$ be the order of the reaction.
$$
R(t) = k\cdot A(t)^n
$$
$$
A'(t) = -a\cdot R(t) = -a\cdot k\cdot A(t)^n
$$
For zeroth-order $n=0$ reactions,
$$
A'(t) = -a\cdot k
$$
$$
A(t) = A(0)-a\cdot k\cdot t
$$
<!--$\therefore A(t)$ is linear with respect to time, and $k$ is its slope divided by $-a$.-->

For first-order $n=1$ reactions,
$$
A'(t) = - a\cdot k \cdot A(t)
$$
$$
A(t) = A(0)\cdot e^{-a\cdot k\cdot t}
$$
<!--$\therefore \ln(A(t))=\ln(A(0))-k\cdot t$ and is linear with respect to time, and its slope is the value of $-k$.-->

For second order $n=2$ reactions,
$A'(t)=-a\cdot k\cdot A(t)^2$
$A(t)=(kt+A(0)^{-1})^{-1}$
$\therefore {1\over{A(t)}}$ is linear with respect to time, and its slope is the value of $k$.

