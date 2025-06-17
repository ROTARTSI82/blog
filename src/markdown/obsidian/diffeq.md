---
title: 'Notes for Differential Equations'
modified: "Apr 29 09:21:30 2024" 
created: "Jan 30 22:02:32 2024"
---
## Table of Contents
<!-- toc -->

# Chapter 1: Substitution
## 1st Order Linear

$$
y' + P(x)\,y = Q(x)
$$

$$
[I(x)\,y]' = I(x)\,y' + I(x)\,P(x)\,y = I(x)\,Q(x)
$$

$$
I'(x) = I(x) P(x)
$$
$$
I(x) = E^{\int P(x)\,dx}
$$

$$
y = \frac{\int I(x)\,Q(x)\,dx}{I(x)}
$$


## Sigmoid

$$
\frac{dy}{dx} = k\,y\,(M - y)
$$

$$
y(x) = \frac{M}{1+C\,e^{-M\,k\,x}}
$$

## Existence & Uniqueness

<!--TODO
![[Screenshot 2024-03-04 at 9.05.00 AM.png]]-->

For $y' = f(x, y)$ with initial condition $y(a) = b$, solutions MUST exist in some interval $I$ if $f(x, y)$ is continuous on a rectangle $R$ containing $(a, b)$. ($I$ may be "narrower" than the rectangle $R$ if the solution curve happens to leave the rectangle in the middle).

This solution MUST be unique if $f^{(0,1)}(x,y)$ (aka $\frac{\partial y'}{\partial y}$) is continuous on $R$.

Failing these tests does not imply nonexistence or non-uniqueness.

<!-- ## Substitutions

Direct substitution of $u = 1 - x^2$:
$$
\int x\sqrt{1-x^2}\,dx
$$

Indirect substitution of $x = \sin(u)$
$$
\int \sqrt{1-x^2}\,dx
$$ -->

## Bernoulli Equations

$$
y' = P(x) y + Q(x) y^n
$$

Divide by $y^n$ and then substitute $v = y^{1-n}$. The equation becomes linear!

$$
y' y^{-n} = P(x) y^{1-n} + Q(x)
$$

$$
\frac{1}{1-n} v' = P(x) v + Q(x)
$$

## Homogeneous Equations (1st order)

Homogeneous function: $f(\alpha \vec{v}) = \alpha^k f(\vec{v})$

Is "zoom invariant" and said to be order $k$. Zoom operation changes scale by same amount on all axes.

For differential equation:

$$
M(x,y)\,dx + N(x,y)\,dy = 0
$$

When $M$ and $N$ are homogeneous with the same degree, the differential equation can be rewritten into $y' = f(y/x)$ and solved with substitution $y = u x$:

$$
\frac{dy}{dx}=-\frac{M(x,y)}{N(x,y)}=-\frac{M(1,y/x)}{N(1,y/x)}=f(y/x)
$$

$$
u' x + u = f(u)
$$
Becomes a separable differential equation!

<!-- Or think of it as 
$$
\frac{dy}{dx} = F(x,y) = x^{-k} \cdot F(1, y/x)
$$
(the function of $F=M/N$ is guaranteed to have degree $k=0$ if $M$ and $N$ have the same degree. In general $F$ must have degree 0 otherwise it becomes non-separable and non-linear) -->


## Exact Diff Eq
Find potential functions such that

$$
\frac{\,d}{\,dt} [F(x,y)=k]
$$
$$
F^{(1,0)}(x,y)\frac{dx}{dt} + F^{(0,1)}(x,y)\frac{dy}{dt} = 0
$$

Let $M = F^{(1,0)}$ and $N = F^{(0,1)}$. By clairaut's theorem:
$$
\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x} = F^{(1,1)}
$$

Because $M$ and $N$ are the result of taking partial derivatives, we can directly integrate and treat the other variable as a constant to find the original potential function $F$.

# Chapter 2: SOLDEs
## 2nd Order Linear
$$
A(x)\,y'' + B(x)\,y' + C(x)\,y = F(x)
$$


**Uniqueness**: The constraints $y(a) = b$ and $y'(a) = c$ specify a unique solution on an open interval $I$ if $A(x)$, $B(x)$, $C(x)$, and $F(x)$ are continuous on the interval (and $a$ is on that interval).

##### Associated Homogenous Equation
$$
A(x)\,y'' + B(x)\,y' + C(x)\,y = 0
$$

**Superposition**: The space of solutions to a homogenous equation is spanned by any 2 linearly independent solutions. For higher orders this is equal to the order of the equation. 

Uniqueness implies that 2 linearly independent solutions must exist for any homogenous equation, and this holds generally for higher orders. Another argument is that there are that many roots (real or imaginary) to the characteristic equation by the fundamental theorem of algebra.

To solve, we factor a polynomial of the differential operator (the "characteristic polynomial"):

$$
\left[\,A(x)\,\left(\frac{d}{dx}\right)^2 + B(x)\,{\frac{d}{dx}} + C(x)\,\right]\, y(x) = \left(\frac{d}{dx} - r_1\right) \left(\frac{d}{dx} - r_2\right) y(x) = 0
$$


## Duplicated & Imaginary Roots

Roots give the solutions as $y(x) = x^k\,e^{r\,x}$ where $r$ is a root and $k$ is an integer less than the multiplicity of the root (this is exponential shift theorem):

$$
\left(\frac{d}{dx} - r\right)^m\,\left(x^k\,e^{r\,x}\right) = \left(\frac{d}{dx} - r\right)^{m-1}\,\left(k\,x^{k-1}\,e^{r\,x}\right)
$$

By induction, this will go to 0 for any $k$ < $m$. Thus, a root $r$ of multiplicity $m$ will produce the solution $(c_1 + c_2\,x + \ldots + c_{m-1}\,x^{m-1})\,e^{r\,x}$

For imaginary roots with their complex conjugate, the solution is $\sin$ and $\cos$:
$$
y(t) = c_1\,e^{(a\,+\,i\,b)\,t} + c_2\,e^{(a\,-\,i\,b)\,t}
$$
Because we know that $\cos$ is even and $\sin$ is odd and that $e^{i\,x} = \cos(x) + i \sin(x)$, we can rewrite $y$ as:
$$
y = e^a \left[ (c_1 + c_2) \cos(b\,t) + i\,(c_1 - c_2) \sin(b\,t) \right]
$$

Then, we can define new constants $k_1 = c_1 + c_2$ and $k_2 = i\,(c_1-c_2)$, and this basis also spans the same space as the old one!


##### General Solution

First, solve the associated homogenous equation (the "complementary function") and add it to the particular solution. This works because differentiation is linear.

#### Wronskian

A nonzero wronskian proves that all functions are linearly independent, a zero wronskian proves linear dependence for analytic functions. 

$$
W = \begin{vmatrix} 
f(x) & g(x) & h(x) \\
f'(x) & g'(x) & h'(x) \\
f''(x) & g''(x) & h''(x)
\end{vmatrix}
$$

I guess differentiation is the simplest operator that works by iterating it? Cause a simple multiplication wouldn't work because that produces linear dependence across rows. Does adding one work????


## Method of Undetermined Coefficients

For inhomogenous equation $L y = f(x)$, if $f(x)$ is made of $\sin$, $\cos$, $e^x$, and polynomials, this method will work. That is, $f(x)$ is a linear combination of terms of the form $P(x)\,e^{a\,x}\sin(k\,x)$ (or the same with $\cos$).

Find another homogenous equation $D y = 0$ such that $f(x)$ is a solution ($D f(x) = 0$): Then, applying this new operator $D$ to both sides produces a new homogenous equation $D L y = 0$. The particular solution should be of the form of the difference between the solution to $D L y = 0$ and the original associated homogenous equation $L y = 0$, as those are the terms that don't go to 0 after $L$.  We can then solve for the coefficients such that $L y = f(x)$.

Or the shortcut method for finding the trial solution: For each term in $f(x)$, take a linear combination of that term and all its derivatives. Multiply by $x^s$ where $s$ is the smallest integer such that no term appears in the solution to the associated homogenous equation. This should be equivalent to applying $D$ and solving as described above (multiplying by $x^s$ is to account for $D$ increasing the multiplicity of roots).

## Variation of Parameters
The general idea is to find functions to serve as coefficients to the associated homogenous solution such that it works out for the inhomogenous equation.

Very cursed. Wikipedia explanation is actually very good and easy to understand: https://en.wikipedia.org/wiki/Variation_of_parameters#Description_of_method

The only tricky part is that they skip over a step to get to equation **vii**: You must reorder the sum and factor out $c_i(x)$ to see that those terms go to 0 because $y_i$ must follow the homogenous equation (**ii**):

By plugging in $y_p$ to the original equation:
$$
b(x) = \left[\sum_{i=1}^n c_i'(x) y_i^{(n-1)}(x)\right] + \left[\sum_{i=1}^n c_i(x) y_i^{(n)}(x)\right] + \left[\sum_{k=0}^{n-1} a_k(x) \sum_{i=1}^{n} c_i(x) y_i^{(k)}(x)\right]
$$
$$
b(x) = \left[\sum_{i=1}^n c_i'(x) y_i^{(n-1)}(x)\right] + \sum_{i=1}^n c_i(x) \left[y_i^{(n)}(x) + \sum_{k=0}^{n-1} a_k(x) y_i^{(k)}(x)\right]
$$
$$
y_i^{(n)}(x) + \sum_{k=0}^{n-1} a_k(x) y_i^{(k)}(x) = 0
$$

In the end, the system of equations that we must solve is
$$
\begin{bmatrix}
y_1(x) & y_2(x) & \ldots & y_n(x) \\
y_1'(x) & y_2'(x) & \ldots & y_n'(x) \\
\vdots & \vdots & \ddots & \vdots \\
y_1^{(n-1)}(x) & y_2^{(n-1)}(x) & \cdots & y_n^{(n-1)}(x) \\
y_1^{(n)}(x) & y_2^{(n)}(x) & \cdots & y_n^{(n)}(x)
\end{bmatrix}
\begin{bmatrix}
c_1' \\ c_2' \\ \vdots \\ c_{n-1}' \\ c_{n}'
\end{bmatrix}
=
\begin{bmatrix}
0 \\ 0 \\ \vdots \\ 0 \\ b(x)
\end{bmatrix}
$$

To solve for $c_n$ we can use [[Cramer's Rule]]. For the 2nd-order case, the solution to $y'' + a_1(x) y' + a_0(x) y = b(x)$ is:

$$
y_p = y_1(x) \int \frac{\begin{vmatrix}
0 & y_2(x) \\
b(x) & y_2'(x)
\end{vmatrix}}{W(x)}\,dx  + y_2(x) \int \frac{\begin{vmatrix}
y_1(x) & 0 \\
y_1'(x) & b(x)
\end{vmatrix}}{W(x)}\,dx
$$
$$
y_p = y_1(x) \int \frac{-y_2(x)\,b(x)}{W(x)}\,dx  + y_2(x) \int \frac{y_1(x)\,b(x)}{W(x)}\,dx
$$

Where $y_1$ and $y_2$ and two linearly independent solutions to the associated homogenous equation, and $W(x)$ is the wronskian of $y_1$ and $y_2$.

$$
W(x) = \begin{vmatrix}
y_1(x) & y_2(x) \\
y_1'(x) & y_2'(x)
\end{vmatrix}
$$

How did people come up with this shit??
Matrix Form: https://math.stackexchange.com/questions/1215632/variation-of-parameters-why-do-we-assume-the-constraint-v-1-leftt-righty


# Chapter 4: Laplace

Dirac Delta $\delta(t)$ PDF: 
$$
\int_{-\infty}^{\infty} f(x) \delta(x-a) \,dx = f(a)
$$
Unit step (Heaviside theta) $u(x)$ CDF: 
$$
u'(x) = \delta(x)
$$

(One-sided) Laplace transform is **linear**:
$$
\mathcal{L}\{f(t)\} = \int_0^\infty f(t)\,e^{-s\,t} \,dt = F(s)
$$

Laplace transform exists for all piecewise continuous functions with exponential order, and it also always shrinks to 0 in s-domain:
$$
|f(t)| < M e^{c\,t} \space \text{as} \space t \to \infty
$$
 $$
\lim_{s\to\infty} F(s) = 0
$$


Laplace transform of derivative (piecewise smooth with exponential order):
TODO show full expansion and int by parts
$$
\mathcal{L}\{f'(t)\} = -f(0) + s \mathcal{L}\{f(t)\}
$$
$$
\mathcal{L}\{f(t)\} = s^{-1} \left[ f(0) + \mathcal{L}\{f'(t)\} \right]
$$
$$
\mathcal{L}\{f^{(n)}(t)\} = s^n \mathcal{L}\{f(t)\} - \sum_{i=0}^{n-1} s^{n-1-i} f^{(n)}(t)
$$
$$ 
= \\ s^n \mathcal{L}\{f(t)\} - s^{n-1} f(0) - s^{n-2} f'(0) - \cdots - s f^{(n-2)}(0) - f^{(n-1)}
$$


Convolution Theorem:

$$
 \{f \ast g\}(t) = \int_{-\infty}^\infty f(x)g(t-x)\,dx 
$$

$$
 f \ast g = g \ast f
$$

$$
 \mathcal{L}\{f \ast g\} = \mathcal{L}\{f\}\cdot\mathcal{L}\{g\}
$$
$$
 \mathcal{L}^{-1}\{F \cdot G\} = \mathcal{L}^{-1}\{F\} \ast \mathcal{L}^{-1}\{G\} 
$$

Convolution theorem with dirac delta produces a shift (note: only shifts to the right with $a > 0$ otherwise $\mathcal{L}\{\delta(t-a)\} = 0$):

$$
\mathcal{L}\{f(t-a)\} = e^{-a\,s}\cdot \mathcal{L}\{f(t)\}
$$
$$
 f(t) \ast \delta(t-a) = \int_{-\infty}^\infty \delta(x-a)f(t-x)\,dx = f(t-a)
$$

This is just $\mathcal{L}\{f(t)\} \cdot \mathcal{L}\{\delta(t-a)\}$
This is also exponential shift theorem? It can also be seen using a plain old u-sub.

Polynomials:
TODO show full expansion and int by parts
$$
\mathcal{L}\{t^a\} = \frac{a}{s}\mathcal{L}\{t^{a-1}\}
$$
$$
\mathcal{L}\{1\} = s^{-1}
$$
$$
\mathcal{L}\{t^a\} = \frac{a!}{s^{a+1}}
$$


| $$f(t)$$ | $$\mathcal{L}\{f(t)\} \quad (s>0)$$                                |
|-----|--------------------------------------------------------------------|
| $$1$$ | $$s^{-1}$$                                                         |
| $$t$$ | $$s^{-2}$$                                                         |
| $$t^a \quad (a>-1)$$ | $$a!\,s^{-a-1} = \Gamma(a+1)\,s^{-a-1} $$                          |
| $$\delta(t-a) \quad (a>0)$$ | $$e^{-a\,s}$$                                                      |
| $$u(t-a) \quad (a>0)$$ | $$s^{-1} e^{-a\,s}$$                                               |
| $$e^{a\,t}$$ | $$\frac{1}{s-a} \quad \text{for} \quad s > \rm{Re}[a]$$            |
| $$\sin(k\,t)$$ | $$\frac{k}{s^2+k^2} $$                                             | 
| $$\cos(k\,t)$$ | $$\frac{s}{s^2+k^2} $$                                             |
| $$\sinh(k\,t)$$ | $$\frac{k}{s^2-k^2} \quad \text{for} \quad  s > \lvert k \rvert $$ | 
| $$\cosh(k\,t)$$ | $$\frac{s}{s^2-k^2} \quad \text{for} \quad  s > \lvert k\rvert$$   |
