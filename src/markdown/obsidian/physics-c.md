---
title: 'notes for ap physics c'
created: "Aug 23 08:53:11 2024"
modified: "Jun 16 2025"
---

These are some notes I took for Mr. Spenner's AP Physics C class.

## Table of Contents
<!-- toc -->

# Kinematics (2024-08-23)

| Variable                    | Dimensions | Unit |
|-----------------------------|------------|------|
| $\vec{x}$, $\Delta \vec{x}$ | $[L]$      | m    |
| $t$, $\Delta t$             | $[T]$      | s    |

$\Delta \vec{x} = \vec{x}_\text{final} - \vec{x}_\text{initial}$ (displacement, vector) vs. distance (magnitude)

$$
\vec{v} = \frac{d\vec{x}}{dt}\qquad\vec{a}=\frac{d\vec{x}}{dt}
$$

$$
\int |\vec{v}|dt=\text{distance}
$$

Taylor series
$$
\vec{x} = \vec{x_0}+\vec{v_0} t+\frac{1}{2}\vec{a} t^2
$$

## 2024-09-13 Types of Forces
Forces:
**Fundamental forces**:
- $\vec{F_g} = m\vec{g}$ $\qquad \vec{F_g} = -\frac{G M m}{r^2} \hat{r}$
- $\vec{F_E}$
- $\vec{F_B}$

**Derived forces from electromagnetism**:
- $\vec{F}_N$ Push perpendicular to tangent plane
- $|\vec{F}_k| = \mu_k |\vec{F}_n|$ Kinetic friction, opposite direction of relative velocity
- $|\vec{F_s}| \le \mu_s |\vec{F_n}|$ Maximum static friction force, opposes relative motion
- $\vec{F}_T$ Tension force: Long thin bendable things (only pull) in direction of tension
- $\vec{F}_{el}$ Elastic force: $\vec{F_k} = -k \Delta \vec{x}$. Linear response (elastic) regime vs. plastic regime.
- $\vec{F}_b$ Buoyant force
- $\vec{F}_d$ Drag force: Linear drag $\vec{F_d} = -b \vec{v}$ (more for laminar)
    - $|\vec{F}_d| = \frac{1}{2}\rho C A |\vec{v}|^2$ (more for turbulent): Geometry of object determines dimensionless $C$, $A$ is cross-sectional area, $\rho$ is density of fluid.

### 2024-09-23 Drag Forces

Drag forces:
$$
\vec{F}=-b \vec{v} \qquad |\vec{F_{d}}| = \frac{1}{2} \rho c A v^2
$$

For $v^2$ model, terminal velocity is
$$
\begin{align}
0 = F_g - \frac{1}{2} \rho c A v^2 \\
v = \sqrt{\frac{2 F_g}{\rho c A}}
\end{align}
$$

For linear model:
$$
\begin{align}
F_g - b v = 0 \\
v_{term} = \frac{F_g}{b}
\end{align}
$$
Solving position for fun
$$
\begin{align}
m \ddot{x} = -b \dot{x} \qquad \frac{\rm{d}}{\rm{d}t} \left(m \frac{\rm{d}}{\rm{d}t} + b\right) x = 0 \\
x = x_0 + Ce^{-\frac{b}{m} t}
\end{align}
$$

Also first order linear for other forces:
$$
\begin{align}
F_g-bv=m\frac{\mathrm{d} v}{\mathrm{d} t} \\
\mathrm{d}t = \frac{m \mathrm{d} v}{F_g - bv} \\
\Delta t = -\frac{m}{b}\left[\ln\left({F_g-bv}\right) \right|_{v=v_i}^{v_f} \\
\Delta t = -\frac{m}{b} \ln\left(\frac{F_g - b v_f}{F_g - b v_i}\right)
\end{align}
$$
Assuming boost symmetry, we can set $v_i =  0$ and $v_f = \Delta v$ and  get
$$
\begin{align}
\Delta t = -\frac{m}{b} \ln\left(\frac{F_g - b \Delta v}{F_g}\right) \\
\Delta t = -\frac{m}{b} \ln\left(1-\frac{\Delta v}{v_{term}}\right) \\
e^{-\frac{b}{m} \Delta t} = 1-\frac{\Delta v}{v_{term}}
\end{align}
$$

Define $\tau = \frac{m}{b}$, has dimensions of time. $b$ has units of $\rm{kg\,s^{-1}}$.
$$
\Delta v = v_{term}(1-e^{-\Delta t / \tau})
$$

$\tau$ can be interpreted as a half-life of sorts


#### Apparent weight:
$$
\left| \left(\sum \vec{F}\right)-\vec{F_g}\right|
$$
You appear heavier when you're climbing up a rope, you appear weightless when in freefall.


#### Atwoods Machine
Remember to do tension forces correctly please

# Systems and Center of Mass

$$
\vec{R}_{CM} = \frac{\sum_i m_i \vec{r}_i}{M}
$$

Internal forces cancel in the force on the COM:
$$
 \vec{F}_{CM} = M \frac{\mathrm{d}^2}{\mathrm{d}t^2} \vec{R}_{CM} = \sum_i m_i\,\vec{a}_i = \sum_i \vec{F}_i
$$
$$
 \vec{F}_{i} = \sum_{j} \vec{F}_{ij}\;+\vec{F}_{ext\,i} 
$$
$$
 \vec{F}_{CM} = \sum_i \left( \sum_j \vec{F}_{ij} + \vec{F}_{ext\,i}\right) = \sum_i \vec{F}_{ext\,i} \qquad \left(\vec{F}_{ij} = -\vec{F}_{ji}\right)
$$

$$
 \vec{F}_{CM} = \frac{\mathrm{d}}{\mathrm{d}t} \vec{p}_{CM} = \sum_i \vec{F}_{ext\,i}
$$

The center of mass will NOT accelerate if there are no external forces on the system, REGARDLESS of internal forces (even if those internal forces don't conserve energy, they MUST conserve momentum). Conversely, momentum conservation also means the center of mass does not accelerate.

## Impulse
Impulse = change in momentum = $\int \vec{F} \mathrm{d}t$.

## 2024-10-25 Center of Mass Anti-mass Trick
Use negative mass to subtract areas from shapes: way easier for circle carved out of some shape for example.

## Rocket Science

Thrust force: Mass being expelled at relative velocity $\vec{u}$ creates a force of 
$$
F_{\text{thrust}} = \vec{u} \frac{\mathrm{d}M}{\mathrm{d}t}.
$$
Think of conservation of momentum for differential masses. We can derive the rocket equation:
$$
\vec{F}_\text{thrust} = \vec{u} \frac{\mathrm{d}M}{\mathrm{d}t} = M \vec{a} = M \frac{\mathrm{d}v}{\mathrm{d}t}
$$
$$
\begin{align}
\vec{u} \int \frac{1}{M} \mathrm{d}M &= \int \mathrm{d}v \\
\vec{u} \ln \left(\frac{M_f}{M_i}\right) &= v_f - v_i \\
\Delta v &= -\vec{u} \ln \left(\frac{M_i}{M_f} \right)
\end{align}
$$
Adding a force of gravity, we see that we have to do it fast because
$$
 \Delta v = -g \Delta t \,+\,u \ln\left(\frac{M_i}{M_f}\right)
$$
where $u$ is the magnitude of the speed.

Also, the equation $\vec{F} = \frac{\mathrm{d}\vec{p}}{\mathrm{d}t}$ CANNOT be right, because accelerations/forces should be invariant under Galilean transformations. Thus, $\vec{F} = m \vec{a}$ is the correct expression.

# Work, Energy, and Power
## 2024-09-25: Work-Energy Theorem stuff

$$
\begin{align}
\sum F &= m a \\
F_{net} &= m \frac{dv}{dx} \frac{dx}{dt} \\
\int F_{net}\,\mathrm{d}x &= \int m v\,\mathrm{d}v \\
&= \frac{1}{2} m v_f^2 - \frac{1}{2} m v_i^2
\end{align}
$$

Derivation of constant accel -> displacement formula:
$$
\begin{align}
m \int a \,\mathrm{d}x &= \frac{1}{2} m v_f^2 - \frac{1}{2} m v_i^2\\
2 a \Delta x &= v_f^2 - v_i^2
\end{align}
$$

Generally:
$$
\begin{align}
\vec{F} &= m \frac{\mathrm{d}\vec{v}}{\mathrm{d}t} \\
\int \vec{F}\cdot \mathrm{d}\vec{r} &= m \int \frac{\mathrm{d}\vec{v}}{\mathrm{d}t}\cdot\mathrm{d}\vec{r} \\
&= m \int \frac{\mathrm{d}\vec{v}}{\mathrm{d}t} \cdot \vec{r}'(t)\,\mathrm{d}t \\
&= m \int \frac{\mathrm{d}\vec{v}}{\mathrm{d}t} \cdot \vec{v}\,\mathrm{d}t \\
&= m \int \frac{1}{2} \frac{\mathrm{d}}{\mathrm{d}t}[\vec{v} \cdot \vec{v}]\,\mathrm{d}t \\
&= \frac{1}{2} m |\vec{v}|^2
\end{align}
$$


## 2024-09-30: More work

Penguin problem: Penguin on spherical igloo with radius $R$. At what angle $\theta$, measured from the ground, would it loose contact when sliding off?

Use work-energy + uniform circular motion equation.
$$
\frac{1}{2} m v^2 = m g R (1-\sin\theta)
$$
$$
a = \frac{v^2}{R} = g \sin\theta
$$
$$
\theta = \sin^{-1}\left(\tfrac{2}{3}\right)
$$

## 2024-10-02: Friction & Work
Conservative vs. Non-conservative forces, gravity vs. friction: gradient theorem

Elastic forces (if small, can be modeled by Hooke's law)

## 2024-10-04: Power & Potential Energy
For any conservative force, it is possible to find a potential energy function (gradient theorem)
$$
U = -\int \vec{F}\cdot d\vec{r}
$$
$$
\begin{align}
U_g(y) &= m g y  \qquad W_g = -\Delta U_g \qquad F_g = -\nabla U_g\\
U_{el}(x) &= \frac{1}{2} k x^2 \qquad W_{el} = - \Delta U_{el} \qquad F_{el} = -\nabla U_{el}
\end{align}
$$

Work done by non conservative forces:
$$
W_{nonc} -\sum_i \Delta U_i = \Delta E_k
$$
$$
\begin{align}
W_{nonc} &= \Delta E_k + \Delta U \\
&= \Delta E_{mech}
\end{align}
$$

Work done from outside the system:
$$
W_{external} = \Delta E_k + \Delta U = \Delta E_{mech}
$$
$$
E_{ki} + U_i + W_{external} = E_{kf} + U_f
$$

2nd order taylor approximation of any potential energy function means basically anything can be thought of as a mass on a spring at local mins.


# Gravity

Gauss's law, shell theorem

$$
\vec F_g = \frac{G m_1 m_2}{|\vec r|^3}\vec r
$$

where $\vec r$ points from the object to the thing exerting the force. Gravitational field $\vec g$ defined such that $\vec F_g = m \vec g$ for a mass in the environment. For only one point mass with mass $m$:

$$
\vec g = \frac{G m}{|\vec r|^3} \vec r
$$

By superposition, we can get total $\vec g$ by just adding up all the contributions:
$$
\begin{align}
\vec{g}(\vec r) &= G\sum_i\frac{ m_i}{|\vec x_i - \vec r|^3} (\vec x_i - \vec r) \\
&= G\int \mathrm{d}^3\vec{x}\,\frac{\rho(\vec x)}{|\vec x - \vec r|^3} (\vec x - \vec r)
\end{align}
$$

Taking the gradient, the $\vec x$ things become constants. Using the fact that the exterior derivative is linear and the fact that we have an identity (allegedly) that
$$
\nabla \cdot \left(\frac{\vec r}{|\vec r|^3} \right) = 4 \pi \delta(\vec r)
$$
$$
\begin{align}
\nabla \cdot \vec{g} = 4\pi G\int \mathrm{d}^3\vec{x}\,\rho(\vec x)[-\delta(\vec x - \vec r)] = \boxed{-4\pi G\rho(\vec r)}
\end{align}
$$

The same can be used to show that $\nabla \times \vec g = \vec 0$, and since the space we are working in is simply connected or something, this shows that its a conservative field and $\vec g = - \nabla U_g$.

# Rotations and Torque

$$
S = R \theta
$$
- $\omega = \dot{\theta}$ angular speed/velocity $\vec{\omega}$
- $v_\text{tan} = \dot{S} = R \omega$ Tangential velocity
- $\alpha = \ddot{\theta}$ angular acceleration
- $a_\text{tan} = R \alpha$ Tangential acceleration => $\vec{\alpha}$.

$\vec{\alpha}$ and $\vec{\omega}$ are bivectors.
Constant $\alpha$, then same equations apply for kinematics.

$$
\begin{align}
\dot{\vec{r}} &= r \dot{\theta} \hat{\theta} + \dot{r} \hat{r} \\
&= v_\text{tan} \hat{\theta} + v_\text{rad} \hat{r}
\end{align}
$$

$$
\begin{align}
\ddot{\vec{r}} &= (\ddot{r}-r \dot{\theta}^2) \hat{r} + (2\dot{r}\dot{\theta}+r\ddot\theta) \hat{\theta} \\
&= (a_\text{rad}+a_\text{centrip}) \hat r + (a_\text{coriolis}+a_\text{tan}) \hat \theta
\end{align}
$$


We can define arbitrary axes of rotation from Euler's rotation theorem or something probably. https://en.wikipedia.org/wiki/Euler%27s_rotation_theorem

## Torque is a bivector

$$
\vec{t} = \vec{r} \times \vec{F}
$$

Assuming point masses.
Angular acceleration -> tangential acceleration: 
$$
\vec{a}_{tan} = \vec \alpha \times \vec r
$$

$$
\begin{align}
\sum \vec F &= m \vec a \\
\vec r \times \vec F_{net} &= \vec r \times m\vec a = \vec r \times m \vec a_{tan} \\
&= m \vec r \times (\vec \alpha \times \vec r) \\
&= m \left[ (\vec r \cdot \vec r)\vec \alpha - (\vec r \cdot \vec \alpha) \vec r \right] \\
&= m r^2 \vec \alpha \\
\vec \tau_{net} &= I \vec \alpha
\end{align}
$$

Where $\vec \tau_{net} = \vec r \times \vec F_{net}$ is net torque, and $I = m r^2$ is the moment of inertia of the point mass. Because the cross product is linear, torque is also additive like forces.

$$
A\times(B\times C) = (A\cdot C)B-(A\cdot B)C
$$
https://en.wikipedia.org/wiki/Triple_product#Vector_triple_product


Kinetic energy of rotating rigidbody: All particles have same $\vec \omega$ (angular speed).
$$
\begin{align}
E_k &= \sum_i \frac{1}{2}m_iv_i^2 \\
&= \frac{1}{2} \sum_i m_i (R_i \omega)^2 \\
&= \frac{1}{2} \left(\sum_i m_i R_i \right) \omega^2
\end{align}
$$

Thus, it looks like moment of inertia is additive like mass for systems

$$
I_{sys} = \sum_i I_i = \sum_i m_i R_i^2
$$
$$
I_{sys} = \int dI = \int r^2 dm
$$

### Moments of Inertia
| shape | moment of inertia |
| --- | --- |
| 1-d ring/hollow cylinder | $I_{ring} = M R^2$ (same as point mass!) |
| disk/solid cylinder | $I_{disk} = \frac{1}{2} M R^2$ |
| spherical shell | $I_{shell} =\frac{2}{3}MR^2$ |
| solid sphere/ball | $I_{ball} = \frac{2}{5} M R^2$|
| rod of length $L$ at the end | $I_{rod} = \frac{1}{3} M L^2$ |
| rod of length $L$ at the center | $I_{rodcent} = \frac{1}{12} M L^2$ |

### Parallel Axis Theorem  & Defn Variance
$$
I = I_{cm} + M h^2
$$

Assume $\vec{r}$ is position as measured from the center of mass. $\vec h$ is the perpendicular displacement of the two parallel axes, and $\hat \omega$ a unit in the direction of the axis of rotation (thus we have $|\vec h \times \hat \omega| = |\vec h|$). Also, by linearity of the cross product and the definition of center of mass and $\vec{r}$:
$$
 \int \mathrm{d}m\,\vec{r} = \vec{0} 
$$
$$
 \int \mathrm{d}m\,(\vec{r}\times\hat\omega) = \vec{0}
$$

(We can also think of this as projecting the entire rigidbody into the plane of rotation: that also projects the center of mass to the same place) Finally, we can do this:
$$
 I_{cm} = \int \mathrm{d}m\,(\vec{r} \times \hat \omega)^2 
$$
$$ 
\begin{align} I &= \int \mathrm{d}m\,[(\vec{r} - \vec{h})\times\hat\omega]^2 \\
&= \int \mathrm{d}m\,\left(\vec{r}\times\hat\omega\right)^2 +\int \mathrm{d}m\,\vec{h}^2-2\int\mathrm{d}m\,(\vec{r}\times\hat\omega)\cdot (\vec{h}\times\hat\omega) \\
&= I_{cm} + \vec{h}^2M-2(\vec{h}\times\hat\omega)\cdot\int\mathrm{d}m\,(\vec{r}\times\hat\omega) \\
&= I_{cm} + \vec{h}^2 M
\end{align}
$$
(remember that $(\vec h \times \hat \omega)^2 = \vec{h}^2$).

We can interpret the mass as a weird unnormalized PDF. Let us consider $\vec{p}$, the positions of point masses for the rigidbody in our reference frame. Thus,
$$
\vec{r}_{cm} = E[\vec{p}] = \int \frac{\mathrm{d}m}{M}\,\vec{p}.
$$
(Here, $\vec{r}_{cm}$ is as measured from the origin of our reference frame). Our moment of inertia about the center of mass is now variance times total mass:
$$
I_{cm} = M \int \frac{\mathrm{d}m}{M}\,(\vec{p}-\vec{r}_{cm})^2 =M\,E[(\vec{p} - \vec{\mu})^2] = M\,\mathrm{Var}[\vec{p}]
$$

$$
\begin{align}
\mathrm{Var}[\vec{p}] &= E[\vec{p}^2] - E[\vec{p}]^2 \\
\therefore I_{cm} &= I_{origin}-M\,\vec{r}_{cm}^2
\end{align}
$$
This is parallel axis theorem! The parallel axis goes through the origin of our reference frame, remembering our definitions.


## Energy Thing
Let $\vec{v_0}$ to be the velocity of the point through which our axis of rotation is defined. The following is only true if we define it through the center of mass:
$$
\begin{align}
E &= E_k + E_{rot} \\&= \frac{1}{2}M\vec{v_0}^2+\frac{1}{2}I\vec{\omega}^2
\end{align}
$$
Otherwise, if we defined our axis to be moving at some arbitrary speed, we can get arbitrary energy without changing reference frames?

Anyways:
$$
\begin{align}
\frac{1}{2} M\,E[\vec{v}^2] &= \frac{1}{2} \int \mathrm{d}m\,(\vec{v_0} + \vec{r}\times\vec\omega)^2 \\
&= \frac{1}{2} \left[\int\mathrm{d}m\,\vec{v_0}^2+\int\mathrm{d}m\,(\vec{r}\times\vec{\omega})^2+2\cdot\int\mathrm{d}m\,[\vec{v_0}\cdot(\vec r\times\vec \omega)]\right] \\
&=\frac{1}{2} M \vec{v_0}^2 + \frac{1}{2} I \vec{\omega}^2 + \vec{v_0}\cdot\int \mathrm{d}m\,(\vec r \times \vec \omega)
\end{align}
$$

We can have $\int\mathrm{d}m\,(\vec{r}\times\vec{\omega})^2 = \vec{\omega}^2\int\mathrm{d}m\,(\vec{r}\times\hat{\omega})^2 = I \vec{\omega}^2$, factoring the magnitude of $\omega$ out of the integral and from the definition of moment of inertia for point masses in 3D.

Now let us examine the extra cross term we got. It is trivially true if the axis of rotation is defined through a stationary point in our reference frame ($\vec{v_0} = \vec{0}$). If the center of mass lies along the axis of rotation (note: this is NOT merely that $\vec{v_0} = \vec v_{cm}$), then $\int \mathrm{d}m\,(\vec r \times \vec \omega) = \vec 0$ since it is the sum of all momenta of point masses as measured from the center of mass reference frame, so by the definition of center of mass it is 0.


## Angular Momentum?

Argument by work done: Consider a lever balanced on a fulcrum. Look at distances $r_1$ and $r_2$ from the fulcrum.

Say we apply a force $F_1$ at $r_1$. Consider the work done over the infinitesimal displacement $dx_1 = r_1 d\theta$: the work done is $F_1\cdot r_1 d\theta$. We have to do the same work at $r_2$ with $F_2\cdot r_1 d\theta$ to balance this work done. (Because the lever is rigid, both $r_1$ and $r_2$ have same $d\theta$). Thus, equating the two works, we get torque/the lever law.

## More Angular Momentum
Momentum and torque measured from the same frame!
$$
\vec L = \vec r \times \vec p
$$
$$
\vec p = m \vec v =  m \dot{\vec r}
$$
$$
\begin{align}
\dot{\vec L} &= \vec r \times \dot{\vec p} + \dot{\vec r} \times \vec p \\
&= \vec r \times \vec{F}_{net} = \tau_{net}
\end{align}
$$
This is Euler's second law of motion: https://en.wikipedia.org/wiki/Euler%27s_laws_of_motion.
The fact that $\vec \tau = \frac{\mathrm{d}\vec L}{\mathrm{d}t}$ means that any change in angular momentum is associated with torque. Angular momentum is also conserved.

$$
\begin{align}
\vec L &= \int\vec{r}\times\vec v\,\mathrm{d}m \\
&= \int \vec r \times(\vec r\times\vec{\omega})\,\mathrm{d}m \\
&= \vec{\omega}\int \mathrm{d}m\,\vec{r}^2=I\vec{\omega}
\end{align}
$$
Remember, momentum/velocity is being measured from the same frame as moment of inertia.

# Electricity & Magnetism


Ohm's law,
$$
\vec J = \sigma \vec E
$$

Current density is the quantity such that
$$
\frac{dQ}{dt} = \int_S \vec J\cdot d\vec A = I_S
$$
$$
\vec \nabla\cdot \vec J = \frac{d\rho}{dt}
$$

From $\nabla \times \vec B = \mu_0 \vec J$, stokes thoerem says we can do $$\int_{\delta C} \vec B\cdot d \vec\ell =\mu_0 I_C$$

Biot Savart law: Use stokes theorem on $\nabla \times \vec B = \mu_0 \vec J + \cdots$.

$$
d\vec B = \frac{\mu_0}{4\pi} \frac{I d\vec\ell \times \vec r}{r^3} =  \frac{\mu_0}{4\pi} \frac{I d\vec\ell \times {\hat r}}{r^2}
$$


Biot Savart on a loop of wire looks like a dipole.


Skin effect: Parallel wires with current in the same direction repel, current in the opposite direction attract.


## Solenoids and Toroidal things

For solenoid, choose a rectangular ampererian loop. We assume field is perpendicular to the windings and there is very weak field outside the solenoid. We have
$$
B = \mu_0 n I
$$
where $n$ is the number of windings per unit length.

Toroid is $B = \frac{\mu_0 N I}{2 \pi r}$.


## Inductance

$$
M_{1,2} = \frac{\Phi_2}{I_1} = M_{2,1} = \frac{\Phi_1}{I_2}
$$

$$
\nabla \times \vec E = - \frac{\partial \vec B}{\partial t}
$$
$$
\varepsilon = \int_{\delta C} \vec E \cdot d\vec \ell = \int_C \nabla\times \vec E \cdot d\vec A= -\frac{d\Phi}{dt}=-\frac{d}{dt}MI=-M\frac{d^2Q}{dt^2}
$$
Oscillations!

In some perspective, one can say that Hall effect gives rize to lenz's law/faraday's law: Pushing the top of a loop of wire into a space with $B$ will induce a voltage by Hall effect, but the $E$ must now curl around the loop.


#### Inductors and LC Circuits

For a resistor/wire:
$$R =\frac{V}{I}= \rho \frac{\ell}{A}$$

For a parallel plate capacitor:
$$C=\frac{Q}{V}=k \frac{\varepsilon_0 A}{d}$$

For a solenoid/inductor:
$$L = \frac{\Phi_B}{I} = \frac{BNA}{I} = \mu_0 n NA = \mu_0 n^2 \ell A$$
where $n$ is the number density of turns (number per unit length). Putting a magnetizable material inside the solenoid increases the $B$ magnitude linearly by some factor that is a function of $\chi_B$, the magnetic susceptibility.

Magnetic dipole moment is $\vec \mu = N I \vec A$.

**Potential energy of an inductor**:
Remember for a capacitor, we can find the energy density like so: $$U = \frac{1}{2} CV^2 = \frac{1}{2} \varepsilon \frac{A}{d} E^2 d^2 = \frac{1}{2} \varepsilon E^2 \cdot \text{Volume}$$
This gives the field energy.

For an inductor, we can calculate the work that needs to be done to get a current of $I$ flowing:
$$
B=\mu_0 N I\qquad I =\frac{B}{\mu_0 N}
$$
$$
L =\frac{\Phi}{I}=\mu_0 N A Nd
$$
where $N$ is the number density of coils and $d$ is the length of the coil. $Nd$ tells us how many times we should count the flux through area $A$, and $\mu_0 N$ is the magnetic field strength when multiplied by $I$.
$$
P=IV=I\frac{d\Phi}{dt}=LI\frac{dI}{dt}
$$
$$
U=\int Pdt=\frac{1}{2}LI^2=\frac{1}{2\mu_0} B^2 Ad
$$
The $Ad$ is a volume element so we have the energy density of magnetic field.

Field energy http://labman.phys.utk.edu/phys222core/modules/m6/field%20energy.html

### LC Circuit
Charged capacitor is connected to an inductor.

Based on our definition of Q being the charge on the capacitor, we define $I$ to be the charge leaving the $+$ plate. The voltage of the capacitor in the resulting direction of current flow is therefore from the $-$ plate to the $+$ plate, leaving us with $-Q/C$ as the voltage across the capacitor.
$$
I = -\frac{dQ}{dt}
$$

$$
\varepsilon =-\frac{Q}{C}= -\frac{d\Phi_B}{dt}=L\frac{dI}{dt}
$$

$$
\frac{d^2Q}{dt^2} = -\frac{1}{LC} Q
$$

Sine wave! Energy alternates being stored in the electric field in the capacitor, and being stored in the magnetic field in the inductor.

Adding a resistor damps the circuit. Yay diffeq.

# Electric Fields

| Electric Field Geometry | $E$ Power Law   | $V$ Power Law |
|-------------------------|-----------------|---------------|
| Point Charge            | $1/r^2$         |
| Dipole                  | $1/r^3$         |
| Line of Charge          | $1/r$           |
| Infinite plane          | $1/r^0$ (const) |


**Line of Charge**
$$2\int_0^\infty \mathrm{d}x\,\rho \frac{k}{x^2+y^2} \frac{y}{\sqrt{x^2+y^2}}$$
$$E = 2 k\rho / y$$

Infinite Line Derivation: Do gauss's law with a cylindrical shell with some set height $h$ and radius $r$. $h$ will cancel out, as we assume flux is symmetric (field lines always perpendicular to the infinite line) and thus only goes through the sides of the cylinder.

**Ring of Charge**
$$E = \int_0^{2\pi} (\dots)\,R\,\mathrm{d}\theta$$
$$E=\frac{kQz}{(R^2+z^2)^{3/2}}$$
where $z$ is the distance from the center along the line perpendicular to the plane of the ring.

**Disk of Charge**: Integrate rings
$$E=\frac{\sigma}{2 \epsilon_0} \left(1-\frac{z}{\sqrt{z^2+R^2}}\right)$$
where $\sigma = \mathrm{C}/\mathrm{m}^2$

**Infinite Plane**: take $\lim_{R\to\infty} E_{disk}$
$$E = \frac{\sigma}{2\epsilon_0}$$
Remember: constant only in magnitude, not direction at the charge boundary!!

This is Gauss's law: $\nabla \cdot E = \rho / \epsilon_0$. Field lines are only ever perpendicular to the plane,

Going across the boundary of any surface of charge, $E$ jumps by $\sigma/\epsilon_0$!!


## Charge Distribution on a Perfect Conductor

Postulate: The conductor must be in static equilibrium where $\vec{E} = \vec{0}$. Therefore, by Gauss's law, any closed surface that stays within the volume of the conductor must enclose 0 net charge. Therefore, the charge must be spread out on the outer surface!

https://q.uiver.app/#q=WzAsNSxbMCwwLCJcXHZlY3tGfSJdLFsyLDAsIlxcdmVje0V9Il0sWzAsMiwiVSJdLFsyLDIsIlYiXSxbNCwxLCJcXHJoby9cXGVwc2lsb25fMCJdLFsxLDAsIlxcdGltZXMgcSIsMl0sWzMsMSwiLVxcdmVje1xcbmFibGF9IiwyXSxbMiwwLCItXFx2ZWMgXFxuYWJsYSJdLFszLDIsIlxcdGltZXMgcSIsMl0sWzEsNCwiXFx2ZWN7XFxuYWJsYX1cXGNkb3QiXSxbMyw0LCItXFxuYWJsYV4yIiwyXV0=

![[Pasted image 20250218111203.png]]


## Calculate the potential of assembling a configuration of charge


$$
\begin{align}
W &= \sum_i\sum_{j\ne i} U_{ij} \\
&= \sum_{i=2}^n V_i q_i
\end{align}
$$
Where $V_i$ is the voltage (with the current state of assembly) at the point where you are to put $q_i$. $U_{ij}$ is the potential of 2 pt charges (think of springs). It is the energy released by releasing those 2 charges (so that one moves to the point at $\infty$) in isolation.

For a sphere, we can think of moving successive shells of charge into place:
$$
W = \int V(r) \mathrm{d}q
$$


## Capacitance
$C = Q/V$
How hard it is to put charge on the object?


Of conducting sphere: $4 \pi \epsilon_0 R$ (voltage measured relative to point at $\infty$)

Of parallel plate capacitor: $\epsilon_0 A / d$ (voltage between the plates)
Applying $V$ volts means $Q$ charge builds up on the plates


## Potential Energy of Capacitor
Consider the work needed to add the $Q$ of charge onto the parallel plates. Each $\mathrm{d}q$ requires $\mathrm{d}U = V(q) \mathrm{d}q$ of work to be done. Substituting that $Q = C V$, we get $$U = \frac{Q^2}{2 C} = \frac{QV}{2} = \frac{1}{2}CV^2.$$

This also leads to **energy density**, derived from the above formula for parallel plate capacitors and using the fact that $\vec E = -\vec \nabla V$:
$$
\frac{U}{\text{Volume}} = \frac{1}{2} \varepsilon_0 \vec E^2
$$


## Ohm's Law and Power
$$
V = IR
$$
Conductance $G = R^{-1}$:  $$I = GV$$ analogous to capacitance.

$$
P = I^2 R = \frac{V^2}{R} = IV
$$


## Kirchhoff's laws and solving circuits
1. Assign currents
2. Assign voltage polarity
3. Use Kirchhoff's laws
4. Use Ohm's law $V=IR$ and $Q=CV$ and such.

Kirchhoff's laws are only true in *electrostatics* (constant current flow and charge distribution) $\nabla \cdot J = 0$, $\nabla \times E = -\frac{\partial B}{\partial t}=0$ (?)

**Kirchhoff's first law,** voltage/loop rule:
$$
\sum_{\text{loop}} V_i = 0
$$
This is like gradient theorem ($E = -\nabla V$). Voltage is a continuous function/scalar field.

**Kirchhoff's second law,** current/node/junction rule:
$$
\sum I=0
$$
at all nodes. Current is the flow of a conserved quantity, this is like saying $\nabla \cdot J = 0$ (?)



## RC Circuits
Simple resistors + capacitor in series:
$$
V_\text{bat} = V_\Omega + V_\text{cap}
$$

$$
V_\Omega = I R_\Omega = \frac{dQ}{dt}R_\Omega
$$

$$
Q = C_\text{cap} V_\text{cap}
$$

Solve the homogenous diff eq:
$$
V_\text{bat} = \frac{dQ}{dt} R_\Omega + \frac{Q}{C_\text{cap}}
$$


**Special Relativity Lagrangian, for some reason:**
$$
L(x,v) = \gamma (mv^2 - mc^2) - U(x)
$$
$$
\gamma = \left(1-\frac{v^2}{c^2}\right)^{-1/2} = \sum_{i=0}^\infty \binom{-\frac{1}{2}}{i} 1^{-1/2-i} (-\beta^2)^{i} \approx 1+\frac{1}{2} \frac{v^2}{c^2}+\cdots
$$
$$
\begin{align}
L(x,v)&=\gamma m v^2 - \gamma m c^2-U(x) \\
&\approx mv^2 + \frac{1}{2c^2} m v^4 - mc^2-\frac{1}{2} mv^2 - U(x) \\
&= \frac{1}{2} mv^2 - mc^2-U(x) + \cancelto{0}{\frac{1}{2c^2}mv^4}
\end{align}
$$