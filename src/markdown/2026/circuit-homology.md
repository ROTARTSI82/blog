---
title: "electrical circuits with homology"
subhead: "cursed yet really cool way to think about circuits"
created: "October 24 2026"
tags: "mathposting,featured"
---


Consider the following circuit:

```tikz
\usepackage[american, RPvoltages]{circuitikz}
\begin{document}

\begin{circuitikz}[scale=1.2, transform shape, every node/.style={scale=0.8}]
    % Move + and - polarity signs closer to the resistor ends (0 = at node, 1 = at component)
    \ctikzset{voltage/distance from node=0.8}

    % Left branch: Voltage source
    \draw (0,0) to[V=$V_{\mathrm{src}}$] (0,3);

    % Top rail: Series resistors R1, R3, R5 and nodes n1, n2, n3
    \draw (0,3) to[R=$R_1$, v^=$~$] (3,3)
          node[circ, label={above:$n_2$}] {}
          to[R=$R_3$, v^=$~$] (6,3)
          node[circ, label={above:$n_3$}] {}
          to[R=$R_5$, v^=$~$] (9,3)
          node[circ, label={above:$n_4$}] {};

    % Middle vertical branches: Shunt resistors R2 and R4
    \draw (3,3) to[R=$R_2$, v_=$~$] (3,0)
          node[circ, label={below:$n_1$}] {};
    \draw (6,3) to[R=$R_4$, v_=$~$] (6,0)
          node[circ] {};

    % Right branch: Current source
    \draw (9,0) to[I, l_=$I_{\mathrm{src}}$] (9,3);

    % Bottom reference rail
    \draw (0,0) -- (9,0);
\end{circuitikz}
\end{document}
```

# Graph Homology

We model our circuit as a graph, at first disregarding the voltage and current sources. Replace voltage sources with a short circuit, and current sources with an open circuit. Then, we have a set of nodes $G = \{n_1, n_2, n_3, n_4\}$ and a set of edges $E = \{e_1, e_2, e_3, e_4, e_5\}$ at each resistor.

Let $C_0$ be the space of **0-chains**, which are formal linear combinations of nodes. You can think of this as the vector space of functions $G \to \mathbb R$. Similarly, let $C_1$ be the space of **1-chains**, formal linear combinations of edges. These edges will be directed in order to define current direction, so to agree with our assigned polarities, think of each edge as an arrow pointing from the $+$ terminal to the $-$ terminal of the resistor. We can define a **boundary operator** $\partial : C_1 \to C_0$, a linear operator given by the formula $\partial(\text{edge}) = \text{head} - \text{tail}$
$$
\begin{align*}
\partial e_1 = n_2 - n_1 &\qquad \partial e_2 = n_1 - n_2 \qquad \partial e_3 = n_3 - n_2 \\
\partial e_4 = n_1 - n_3 &\qquad \partial e_5 = n_4 - n_3.
\end{align*}
$$

Our 1-chains will represent branch current flows, and 0-chains will represent current sinks. To represent voltage potentials, we will use the dual space of **0-cochains** $C^0$, and branch voltage differences will be represented as **1-cochains** $C^1$. We will write $\{e^1, e^2, e^3, e^4, e^5\}$ as a basis for $C^1$, and $\{n^1, n^2, n^3, n^4\}$ as a basis for $C^0$.

$$
\langle e^i, e_j \rangle = \begin{cases} 1 & i = j \\ 0 & \text{otherwise} \end{cases} \qquad \langle n^i, n_j \rangle = \begin{cases} 1 & i = j \\ 0 & \text{otherwise} \end{cases}
$$

We can define the **coboundary operator** $\mathrm{d} : C^0 \to C^1$ as the adjoint of the boundary operator. This is taking the gradient, and can be understood as $\mathrm{d}(\text{(co)node}) = \text{(co)edges entering} - \text{(co)edges exiting}$.
$$
\langle \mathrm{d}\psi, i\rangle = \langle \psi, \partial i\rangle \qquad \forall \psi \in C^0, i \in C_1
$$
$$
\begin{align*}
\mathrm{d}n^1 = -e^1 + e^2 + e^4 &\qquad \mathrm{d}n^2 = e^1 - e^2 - e^3 \\
\mathrm{d}n^3 = e^3 - e^4 - e^5 &\qquad \mathrm{d}n^4 = e^5.
\end{align*}
$$

The resistances $R$ can define an inner product on $C_1$. We can define the linear map $\star_R : C_1 \to C^1$ by
$$
\star_R e_i = R_i e^i,
$$
which takes a current flow to voltages across elements. Thus, for any current flow $i \in C_1$, we get that $\langle \star_R i, i\rangle$ is the power dissipated by the resistors ($P = I^2 R$).

# KVL, KCL, and Ohm's law

The configuration of active components in our circuit can be modeled as an element $(v_\mathrm{src}, i_\mathrm{src}) \in C^1 \times C_0$ of the excitation space. To model the configuration in the original diagram, we can take
$$
v_\mathrm{src} = V_\mathrm{src}\,e^1 \qquad i_\mathrm{src} = I_\mathrm{src}\,(n_4 - n_1).
$$

Here, the voltage source is represented as a 1-cochain that we just superimpose on top of the circuit, increasing or decreasing the voltage drop across certain elements. The current source is represented as a 0-chain, representing the currents flowing into and out of certain nodes. We should want to have that $i_\mathrm{src} \in \mathrm{im}(\partial)$ for this thing to be physical.

A solution to our circuit can be represented by an element $(\psi, i) \in C^0 \times C_1$. The branch currents $i$ are a 1-chain, and the voltage potentials $\psi$ are a 0-cochain. Ohm's law can be phrased as
$$
-\mathrm{d}\psi + v_\mathrm{src}= \star_R i.
$$
The negative sign is convention akin to $E = -\nabla V$. KVL is also encoded in the fact that we are using $\mathrm{d}\psi$, so our form is exact. We can also encode the fact that we are allowed to set ground to be anywhere by taking instead $\psi \in C^0 / \mathrm{ker}(\mathrm{d})$, quotienting out by the gauge invariance. Finally, KCL can be written as
$$
\partial i + i_\mathrm{src} = 0.
$$

## Proof of Superposition

Let $\tilde{C}^0 = C^0 / \mathrm{ker}(\mathrm{d})$, and note that we can define a linear map $T : \tilde{C}^0 \times C_1 \to C^1 \times C_0$ that takes a solution state $(\psi, i)$ to the configuration of voltage and current sources $(v_\mathrm{src}, i_\mathrm{src})$ that produced it. Namely,
$$
(\psi, i) \mapsto (\star_R i + \mathrm{d}\psi, -\partial i).
$$

We can show this map is injective by showing it has a trivial kernel. Suppose that $T(\psi, i) = 0$. Then we know that $\partial i = 0$ and $-\mathrm{d}\psi = \star_R i$. We can evaluate the power dissipated by the resistors as
$$
\langle \star_R i, i\rangle = -\langle\mathrm{d}\psi, i\rangle = -\langle \psi, \partial i \rangle = -\langle \psi, 0\rangle = 0.
$$
Since our resistors have positive resistances, we must have that there is no current flowing anywhere, so $i = 0$. Then, we get that $-\mathrm{d}\psi = \star_R 0 = 0$, so $\psi \in \mathrm{ker}(\mathrm{d})$ and thus $\psi = 0 \in \tilde{C}^0$. We have that $\mathrm{ker}(T) = \{0\}$, and our map is injective. $\square$

Yada yada, isomorphism with subspace, unique linear solution map $T^{-1}$ taking active component configuration to solution state.
