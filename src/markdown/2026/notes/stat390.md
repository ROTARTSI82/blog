---
title: 'stat 390: intro to stats for engineers'
subhead: 'class notes. prof caren marzban, winter 2026 at uw.'
created: 'Jun 26 2026'
tags: 'hide-ls'
---

Hi! These are my notes for STAT 390. These notes are part of this [larger collection](/granty29/blog/2026/notes/) of notes from my freshman year at UW.


## Table of Contents
<!-- toc -->

Jan 5
===

"95% in 95% confidence interval is not a probability"
Inferrential statistics: **population** is unknown, we only have access to the **sample**, a subset of it.

looking to make statements about population, NOT sample

Jan 7
===

"values" (codomain) of a random variable are called "**levels**".
"every variable is a random variable": inherent randomness of measurement

population mean is not a random variable: 
- population mean = fixed ground truth, not accessible

sample mean _is_ a random variable:
- sample mean = random number, specific to your random sample.


data collected in a table: columns = **variables**, rows = **cases**.

| case | x1 | x2 | x3 | x4 | x5 | x6 |
| - | - | - | - | - | -| -| 
|  1 | short | 3.14 | A | B | Mac | 3 |
| 2 | medium | 2.7182 | C | B | HP | 1 |
| ... | ... | ... | ... | ... | ... | ... |

Variable types: Continuous ($\mathbb{R}$), discrete ($\mathbb{Z}$), categorical (some set $S$).
- Ambiguity: If we say $x_2 \in \mathbb{R}$, but we only see $x_2 \in \{3.14, 2.7182, 1.5, 2.6\}$, can we not say that $x_2$ is categorical and not continuous? What the variable is has nothing to do with how we must treat it: we must treat $x_2$ and apply categorical statistical tools, not continuous ones.


Case of say a constant variable $x_7 = 13$: carries no information because it does not change. Info is captured in change, and $H(x_7) = 0$. Actually, this is about **variance** lol: $\text{Var}(x_7) = 0$.

**Histograms**: BEWARE (test Q): histograms of categorical variables *have no shape* because there is no canonical ordering.
- choose the right bin size for continuous variables

Jan 9
===

2 or 3 (qualitative) summary measures should be reported for histograms: 
- center (location): typical value in the data
- spread (width): typical deviation of x
- shape of the histogram (what distribution is it from?)

Distributions
1. Bell-shaped (normal distribution) 
2. Skewed: e.g. income;
3. Bimodal
4. 'Exponential-looking'
	1. Power law/zipf: word ~~length~~ frequency
	2. Poisson: time it takes for an atom to decay, inter-arrival time

Always talking about 1 variable, not 2!

Histogram pertains to sample, while a distribution pertains to population.

$f(x)$ = continuous prob density function, $p(x)$ = discrete probability mass function. Has only 2 conditions: 1) $\forall x \in \mathbb R, f(x) \ge 0$,  2) $\int_{-\infty}^\infty f(x)\,dx = 1$

Gaussian distribution: we have
$$
\int_{-\infty}^\infty e^{-\frac{1}{2}x^2}\,dx=\sqrt{2\pi}
$$
so our density function is $f(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{1}{2}x^2}$ (**standard normal**: $\mu = 0, \sigma = 1$). In general,
$$
f(x)=\frac{1}{\sqrt{2\pi \sigma^2}} e^{-\frac{1}{2 \sigma^2} \left(x-\mu\right)^2}
$$
The **parameters of the distribution** are $\mu$ and $\sigma$.

Histograms are strictly of data: about frequency. Plots of density or mass functions are not histograms.

**Bernoulli distribution**: coin toss with probability $\pi$ $$p(x) = \pi^x (1- \pi)^{1-x}, \qquad x \in\{0, 1\}$$ with parameter $\pi$.

**Binomial distribution**: number of success ($x$) in $n$ trials with probability of success $\pi$ $$p(x) = \frac{n!}{x!(n-x)!} \pi^x (1-\pi)^{n-x} = \binom{n}{x} \pi^x (1-\pi)^{n-x},\qquad x \in \{0,1,\dots,n\}$$

Jan 12
===

(geometric: $p(x) = \pi (1-\pi)^{x-1} \qquad x\in\mathbb{N}^+$)

**uniform distribution** (parameterized by $a$, $b$): 
$$ f(x) = \frac{1}{b-a} \qquad x \in [a, b] $$

**exponential distribution**: Inter-arrival time of a poisson process.
$$ f(x) = \lambda e^{-\lambda x} \qquad x\in \mathbb{R}^+$$

Parameter $\lambda$ arrival rate: mean = $\lambda^{-1}$.

**Poisson distribution**: $$ p(x) = \frac{1}{x!} e^{-\lambda} \lambda^x  \qquad x\in \mathbb{N}$$

Number of events in a fixed interval. Mean = $\lambda$.

Jan 14
===

$P(X = a)$ for any specific $a$ is exactly $0$ for continuous.

Cumulative distribution function of normal distribution:
$$
\text{CDF}(x) =\frac{1}{2}\left[1+\text{erf}\left(\frac{x-\mu}{\sqrt{2\sigma^2}}\right)\right] = \int_{-\infty}^x f(v)\mathrm{d}v
$$

erf is defined like so
$$
\text{erf}(x) = \frac{2}{\sqrt \pi} \int_0^x e^{-v^2}\mathrm{d}v
$$

Tables will give CDF for $\mu = 0, \sigma=1$.


Jan 16
===

Standardization of Normal distr:
$$\int_a^b f_{\mu,\sigma}(x)\,dx = \int_\frac{a-\mu}{\sigma}^\frac{b-\mu}{\sigma} f_{0,1}(z)dz$$
$$z = \frac{x-\mu}{\sigma}$$

$$
\frac{1}{\sqrt{2\pi \sigma^2}} \int_a^b e^{-\frac{1}{2}(\frac{x-\mu}{\sigma})^2} dx= \frac{\sigma}{\sqrt{2\pi \sigma^2}} \int_\frac{a-\mu}{\sigma}^\frac{b-\mu}{\sigma} e^{-\frac{1}{2}z^2}dz. \qquad \square
$$

This is spiritually just linearity of expectation: $\sigma = \sqrt{\text{Var}[X]}$, and we have $\text{Var}[X] = E[X^2]-E[X]^2 \implies \text{Var}[\alpha X] = \alpha^2 \cdot \text{Var}[X]$. Therefore, we get that $z$ is distributed from $N(0, 1)$.

Definition of percentile/quantile/median/quartile: median = $\text{CDF}^{-1}(0.5)$, 99th percentile = $\text{CDF}^{-1}(0.99)$.

5 number summary: min, max, 25th percentile, median, 75th percentile. box plots!



Jan 23
===

Notation $\bar{x} = \frac{1}{n} \sum x_i$ = sample mean.
Sample median, sample range, sample variance, and sample standard deviation.

"deviations" = $x_i - \bar{x}$, and "average of deviations" is simply $\frac{1}{n}\sum (x_i - \bar{x})=0$, not stddev.

Notation: sample variance
$$
\begin{align*}
s_{xx} = \sum (x_i-\bar x)^2 \\
s^2 = \frac{1}{n-1}s_{xx}
\end{align*}
$$

Expand variance for computational formula for variance
$$
s^2 = \frac{1}{n-1}\left(\sum x_i^2-\sum \bar x^2\right) = \frac{n}{n-1}[\overline{x^2}-\overline{x}^2]
$$


Distribution/population variance: $\sigma_x^2 = V[X] = \sum (x-\mu_x)^2 p(x)=\int (x-\mu_x)^2f(x)\,dx$.

1. $\text{Binom}(n,\pi): E[X] = n \pi, V[X]=n \pi (1- \pi)$
2. $N(\mu, \sigma): E[X] = \mu, V[X] = \sigma^2$
3. $\text{Poiss}(\lambda): E[X]=\lambda, V[X]=\lambda$
4. $\text{Exp}(\lambda): E[X]=\lambda^{-1}, V[X] = \lambda^{-2}$
5. $\text{Unif}(a,b): E[X] = \frac{1}{2}(a+b), V[X] = \frac{1}{12}(b-a)^2$


Jan 28
===

Q-Q plot: determine if a distribution fits a sample: do we get a straight line when plotting theoretical vs. sample quantiles? `qqnorm` in R. For qqnorm, we plot $N(0,1)$, and y-intercept is $\approx \mu$ and slope $\approx \sigma$.  We parameterize wrt $n$th quantile, plot the point $(x,y)$ where $x$ is the $n$th quantile of $N(0,1)$ and $y$ is the $n$th percentile of data.

Multivariate data: 
- use a contingency table (confusion matrix) "C-matrix" for categorical data.
- Scatterplot/cartesian plot (`plot` in R) for continuous data
	- Random association: no visible relationship
		- If it looks anisotropic, this may indicate that you have independent but identically distributed variables!
	- Linear, constant variance: variables linearly related, line stays the same width (y-direction variance)
	- Linear, non-constant variance: Width of the line changes.
	- Nonlinear, monotonic: sqrt(), exp()
	- Nonlinear and non-monotonic: $x^2$.

Jan 30
===
Pearson's Correlation Coefficient: $$r=\frac{1}{n-1}\sum_i \left(\frac{x_i-\overline x}{s_x}\right)\left( \frac{y_i-\overline y}{s_y}\right).$$ Remember convariance is an inner product (bilinear, etc etc):
$$
\begin{align}
\text{Cov}[X,Y]&=\text{Cov}[Y,X]\\
&= E[(X-\mu_x)(Y-\mu_y)]\\
&=E[XY]-E[X]E[Y]
\end{align}
$$
$$
\text{Var}[X]=\text{Cov}[X,X]
$$

$$
r= \frac{\text{Cov}[X,Y]}{\sqrt{\text{Var}[X]\cdot\text{Var}[Y]}}
$$

Measures the skinniness of the scatterplot of $Y$ vs. $X$, and if its positively or negatively correlated. Only measures linear associations.

Bilinearity, + $\text{Cov}[X,c] = 0$ for any constant c implies that units + constant offsets on $X$ and $Y$ dont affect pearson correlation.

Misleadingly small $r$: Multiple tight clusters appearing as a single wide cluster with no correlation. Nonlinear data. Extreme outliers.

Misleadingly big $r$: Multiple clusters with no internal correlation appear as one cluster with correlation. Extreme outliers from a cluster with no internal correlation make a line by chance.

Feb 2
===

OLS: ordinary least squares criterion: For data $(x_i, y_i)$, use the model $y = \alpha + \beta x$ where $\alpha$ and $\beta$ minimize $\sum_{i=1}^n (\alpha + \beta x_i -y_i)^2$. MSE = $\frac{1}{n}$SSE. Just solve $\nabla_{(\alpha,\beta)} \text{SSE} = 0$.

$$
\begin{align*}
\hat \beta &= \frac{\overline{xy}-\overline{x}\cdot \overline{y}}{\overline{x^2}-(\overline x)^2} = \frac{\text{Cov}[X,Y]}{\text{Var}[X]} \\
\hat \alpha &= \overline{y}-\hat \beta \cdot \overline{x} 
\end{align*}
$$

in R: `lm(y ~ x)` for "linear model".

Don't use prediction equations outside of the range it was built for: you cant extrapolate like that!

Feb 4
===
Formulation of regression: $y_i = \alpha + \beta x_i + \varepsilon_i$, and our model/prediction is $\hat{y}(x) = \hat \alpha + \hat \beta x,$ and $\hat{y}(x_i) = \hat{y}_i$. SSE = $\sum_{i=1}^n \varepsilon_i^2$.

More general, elegant formulation: ANOVA decomposition. Example of reducing variance in table length by factoring in its dependence on temperature.

This is pythag in the n-dimensional space with $\text{Cov}[X,Y]$ as the inner product.
$$
\begin{align}
\mathrm{SS}_T &= \sum_{i=1}^n (y_i-\overline{y})^2 \\
 &= \sum_{i=1}^n (\hat y_i - \overline y)^2 + \sum_{i=1}^n (y_i - \hat y_i)^2 \\
 &= \mathrm{SS}_{\text{explained (by x)}} + [\mathrm{SS}_\text{unexplained} =\mathrm{SSE} ]
\end{align}
$$

We have that $E[\hat y_i] = E[y_i] = \overline y$ and $E[\epsilon_i] =0$. Thus, this is actually just
$$
\begin{align}
\mathrm{Var}[y_i]&=\mathrm{Var[\hat y_i]} + \mathrm{Var}[\epsilon_i] \\
y_i &= \hat y_i + \epsilon_i \\
 \mathrm{Cov}[\hat y_i, \epsilon_i] &= 0 
\end{align}
$$
The covariance above is 0 for OLS models since $\hat y_i$ has the property that $E[\epsilon_i] = 0$ (from $\frac{\partial}{\partial \alpha} \text{MSE}=0$) and $\mathrm{Cov}[\epsilon_i, x_i] = 0$ (from $\frac{\partial}{\partial \beta} = 0$). More detail:

$$
\mathrm{Cov}[\epsilon_i, x_i] = \mathrm{Cov}[y_i -\alpha-\beta x_i,x_i] = \mathrm{Cov}[x_i, y_i] - \beta\,\mathrm{Var}[x_i] = 0.
$$

The percentage of the variance in $y$ that can be explained by its dependence on $x$.
$$
R^2 = \frac{\mathrm{SS}_\text{expl}}{\mathrm{SST}}
$$
only for the model $y = \alpha + \beta x$, this value of $R^2$ turns out to be Pearson correlation squared $r^2$.

Standard deviation of the errors (root mean squared error, RMSE):
$$
\begin{align}
s_e = \sqrt{\frac{\mathrm{SSE}}{n-2}} \\
s_e^2 = \frac{1}{n-2} \sum_{i=1}^n (y_i-\hat y )^2.
\end{align}
$$

Feb 6
===

Nonlinearity, interaction, collinearity. Cases:
1. Nonlinear but monotonic: take $\ln(x)$, $1/x$, $\sqrt{x}$, etc. and do linear regression. ANOVA still works: $\text{SST} = \text{SS}_\text{exp} + \text{SSE}$
2. Not monotonic and nonlinear: try polynomial regression: `lm(y ~ x + x^2 + x^3 + ...)`. We still have ANOVA, but $$s_e^2 = \frac{1}{n-(k+1)} \sum_{i=1}^i (y_i - \hat y_i)^2$$ where $k$ is the number of $\beta$s that we have. However, we no longer have that $R^2 = r^2$.
3. Multiple regression: More general than polynomial, where each term doesnt just have to be a power of x. New term $x_1 x_2$ is called an *interaction term* if you multiply multiply two predictors together. `lm(y ~ x1 + x2 + I(x1^2) + I(x1:x2))`

Multiple regression with $x_1$, $x_2$: ANOVA still works, $\text{SS}_\text{explained}$ is simply the variance in $y$ that can be explained by all the predictors put together.

Beware of **collinearity** and **interaction**: consider 
$$
\text{age at death} = \alpha + 2.3\cdot\text{health} -2.1\cdot\text{wealth}.
$$
DO NOT INTERPRET THE REGRESSION COEFFICIENTS! Wealth does not make you die younger, you did not take into account the correlation between health and wealth. Beware of implicitly doing $\frac{d x_1}{d x_2} = 0$ implicitly when its not true.

Looking for predictors that are linearly related to $y$ is the wrong thing to do for multiple regression. If we model $y \sim \alpha + \beta_1 x_1 + \beta_2 x_2$, then an ideal plane would have that $y \sim x_1$, $y \sim x_2$, and $x_2 \sim x_2$ all look like correlation-less blobs. If there are linear associations between predictors $x_i$ and $x_j$, we have **collinearity**.

Feb 9
===

Overfitting: test-set and validation-set SSE should be comparable. 

Sampling distribution. Let $X \sim N(\mu, \sigma^2)$. Consider a sample of $n$ measurements of $X$. We can calculate the distribution of sample mean: We know that summing and scaling normals is normal, so it's normal. We only need to find mean and stddev: $E[\frac{1}{n}\sum X_i] = \mu$, and $$\text{Var}\left[\frac{1}{n} \sum X_i\right] = \frac{1}{n^2} \text{Var}\left[\sum X_i\right]$$
we know the sum of independent normals: $N(\mu_1, \sigma_1^2) + N(\mu_2, \sigma_2^2) = N(\mu_1 + \mu_2, \sigma_1^2 + \sigma_2^2)$. Actually, this is just the variance of a sum of independent R.Vs: $\text{Var}[X + Y] = \text{Var}[X] + \text{Var}[Y] + 2 \text{Cov}[X,Y]$. Thus,
$$
 = \frac{1}{n^2} n \sigma^2
$$

so we have the standard deviation of the sample mean is $\sigma_x / \sqrt{n}$.

Feb 18
===

Sampling distribution of sample means: Central limit theorem says it's normal in the limit!

Let each $x_i$ be i.i.d. random variables (from any distribution). Then,
$$\frac{\sqrt{n}}{\sigma_x} (\overline{x} - \mu_x) \sim \mathcal N(0,1)$$

Notation:
- $\overline{x}_\text{obs}$ = observed sample mean from our particular sample.
- $\overline{x}$ = random variable across samples of size n from the population.

Confidence intervals: derived from "self-evident facts" of the form $\text{pr}(a < x < b) = p$. i.e. $p(-1.96 < z < 1.96) = 0.95$, then derive with $z = \frac{\overline{x} -\mu_x}{\sigma_x / \sqrt n }$ being normally distribution and solve for $\mu_x$ within the probability.

Thus we derive the 95% confidence interval: $\overline{x} \pm 1.96 \frac{\sigma_x}{\sqrt n}$. This interval has a 95% chance (across $\overline{x}$s from samples of size $n$) of containing $\mu_x$.
(Technical: We need T-distributions to find $\sigma_x$, but for now we approximate $\sigma_x \approx s_x$.)

NOTE!!! We solved for $\mu_x$, not $\overline{x}$!!! That is, we have $p(\overline{x} - 1.96 \frac{\sigma_x}{\sqrt n} < \mu_x < \overline{x}+ 1.96 \frac{\sigma_x}{\sqrt n})$: Here $\mu_x$ is a population parameter but the $\overline{x}$ is the random variable! So the interval is the random part, not $\mu_x$!!!

Observed 95% confidence interval: $\overline{x}_\text{obs} \pm 1.96 \frac{\sigma_x}{\sqrt n}$. Note that all of these are fixed things, no random variables here! We are 95% confident that $\mu_x$ is within this range (no 95% probability here).


Feb 23
===
$t$-distribution: Assumes that your sample is normal, but it turns out Gosset's theorem is robust to violations to the assumption of the distributions of $x_i$. Distributional robustness?

2-sample confidence interval: Consider the distribution of $\Delta = \overline x_1 - \overline x_2$.  We have $E[\Delta] = E[\overline x_1] - E[\overline x_2]$ and $V[\Delta]=V[\overline x_1]+V[\overline x_2]+ \text{Cov}[\overline x_1, \overline x_2]$, but we assume that $\overline x_1$ and $\overline x_2$ are uncorrelated, so $V[\Delta] = \frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2}$. Central limit theorem says that $\Delta \sim \mathcal N(\mu_1 - \mu_2, \sigma^2 = \frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2})$. We have
$$
z = \frac{\overline x_1 - \overline x_2 - \mu_1 + \mu_2}{\sqrt{\frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2}}} \sim \mathcal{N}(0,1)
$$
$$
t = \frac{\overline x_1 - \overline x_2 - \mu_1 + \mu_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} \sim \mathcal T(\mathrm{df}=\text{Welch's formula})
$$

Thus we get confidence intervals.
Interpretations: 1) we are 95% confident that the difference $\mu_1 - \mu_2$ lies in the range. 2) if we take samples of the same size and calculate the interval according to the formula, our interval will include $\mu_1 - \mu_2$ 95% of the time (probability). 3) If our interval does not include zero, then we are 95% confident that $\mu_1$ and $\mu_2$ are differenet.

If 0 is in the interval, we have no evidence that the means are different. However, it is VERY INCORRECT to say we have evidence that the means are the same.


Feb 25
===

Matched/paired experimental design: Is app X or Y faster? Non paired = mean speed of X on 10 computers vs. mean speed of Y on different 12 computers. Paired = mean speed of X on 10 computers vs. mean speed of Y on those same computers. 

This breaks our existing 2-sample tests because now $\overline{x_1}$ and $\overline{x_2}$ are correlated and variances no longer add cleanly. However, the paired design is much more powerful (stronger p values).

For paired data: Just take the difference $x_1 - x_2$ and treat it as a 1-sample! Gives much tighter CI. Here when we do $t$-test we have $\text{df} = n-1$ (not Welch's formula as for 2-sample).

Confidence intervals are useful for rejecting hypotheses (or not rejecting), but NEVER really for accepting a hypothesis--- not rejecting is not the same as accepting! We are not collecting data to prove a hypothesis, but collecting data to reject it and seeing if it still stands. We are really doing **proof by contradiction**: we make an assumption and look for a contradiction to reject it. In statistics, this is really our only tool, as the data is what it is, and we cannot *construct* anything.

p-values: Null Hypothesis $H_0 : \mu_x < 34$, now we try to find a contradiction. Calculate
$$
p(\overline{x} > \overline{x}_\text{obs} \mid \mu_x < 34)
$$
is our $p$-value!! The condition that $\mu_x < 34$ is tricky, so do $\mu_x = 34$ for now.
$$
p(\overline x > \overline{x_\text{obs}} \mid \mu_x = 34) = p\left(\frac{\overline{x} - \mu_x}{s_x / \sqrt n} > \frac{\overline{x}_\text{obs} - \mu_x}{s_x / \sqrt n } \right)
$$
here 
$$
t_\text{obs} = \frac{\overline{x}_\text{obs} - \mu_x}{s_x / \sqrt n}
$$
is a number, and the lhs is $t$-distributed with $\text{df} = n-1$, so we can compute this probability.

Interpretation: If $\mu_x = 34$, then only 0.25% of samples produce a $\overline{x}_\text{obs}$ more extreme than what we got!

Hypothesis/belief: An assumption that is prior to data, *a priori*, not based on any data.


Feb 27
===

Significance level $\alpha$: the probability at which $p$-values are considered significant. Common values: $0.05, 0.01, 0.001$. It is $1 -\text{confidence level}$.

The $t^\ast$ of confidence interval has no analogue in the world of significance: $t^\ast$ comes from table and distributions, $t_\text{obs}$ comes from data.

Null hypothesis: $H_0 : \mu = \mu_0$, then the alternative $H_1$ is some (in)equality ($\mu > \mu_0$, $\mu < \mu_0$, $\mu \ne \mu_0$), then we compute $P(\lnot H_1 \mid H_0)$ for inequalities (1-sided test), and for $H_1 : \mu \ne \mu_0$ we do a 2-sided test: $P(\mu < \mu_0 - t_\text{obs} \lor \mu_0 + t_\text{obs} < \mu \mid H_0)$.


Mar 2
===
2-sample p test:
$$
H_0 : \mu_1 - \mu_2 = \Delta
$$
then $\Delta_\text{obs} = \overline{x_1}_\text{obs} -\overline{x_2}_\text{obs}$ is $t$-distributed according to the 2-sample formula above, and we can calculate the probabilities

Proportion p tests and confidence intervals: just plug in variance of binomial R.V. with $p$ = observed value for $\pi$ parameter.
$$
p \pm z^\ast \sqrt{\frac{p(1-p)}{n}}
$$
$$
z=\sqrt{\frac{n}{\pi(1-\pi)}}\cdot(p - \pi)\qquad z\text{-distributed}
$$
$$
(p_1 - p_2) \pm z^\ast \sqrt{\frac{p_1(1-p_1)}{n_1} + \frac{p_2(1-p_2)}{n_2}}
$$
$$
z=\frac{(p_1 - p_2) - \Delta}{\sqrt{\frac{p_1(1-p_1)}{n_1}+\frac{p_2(1-p_2)}{n_2}}}\qquad z\text{-distributed}
$$


Mar 4
===
(1-way) ANOVA F-test:
$$
H_0 : \mu_1 = \mu_2 = \dots = \mu_k \qquad H_1 : \text{At least 2 } \mu_i \text{s are different}.
$$

Compare: variability between groups (variance of means) vs. variability within groups (mean of variances).

Grand mean $\overline{\overline y} = \sum\frac{n_i}{n} \overline{y_i} = \frac{1}{n}\sum\sum y_{ij}$
$$
\begin{align*}
\text{SST} &= \sum \sum (y_{i j} - \overline{\overline y})^2 \\&= \sum n_i(\overline{y_i} - \overline{\overline y})^2 + \sum \sum (y_{i j} - \overline{y_i})^2\\
&= \text{SS}_\text{between} + \text{SS}_\text{within}
\end{align*}
$$

$$
F = \frac{\text{SS}_\text{between}/(k-1)}{\text{SS}_\text{within} / (n-k)}
$$
is $F$-distributed with $\text{df}=(k-1,n-k)$. Our $p$-value is $P(F > F_\text{obs})$, which means we have even more variation between means than within means (probability of observing samples with more different means than our observation).

$$
\text{SS}_\text{within} = \sum (n_i - 1) s_{i}^2
$$


Mar 6
====
We did OLS for samples $\hat a$, $\hat beta$, $\hat y$, etc. but how do we do OLS for populations? Denote these $\alpha$, $\beta$, $y$ (note reusing symbols from the free parameters in optimization). 

Probability model: $y$ is normal at each $x$ with variable $\mu = y(x)$ but a constant variance $\sigma_\varepsilon$. Note the dependent-independent variable relationship. There exists some true/population fit $y(x) = \alpha + \beta \cdot x$ with stddev $\sigma_\varepsilon$.
- At each $x$, we get a CI $y(x) \pm 1.96 \sigma_\varepsilon$. We have $s_e$ (from ANOVA/pearson correlation) as an unbiased estimator for $\sigma_\varepsilon$ (use $t$-distribution to calculate probabilities).
- The observed sample is sampling the $y$s from the fixed $x$s, and $\hat \alpha$ and $\hat \beta$ are unbiased estimators when we do fits.
	- Theorem: If $\varepsilon \sim \mathcal N(0, \sigma_\varepsilon)$, then $\hat\beta \sim \mathcal N(\mu=\beta, \sigma=\sigma_\varepsilon / \sqrt{s_{xx}})$. So, $z = \frac{\hat\beta - \beta}{\sigma_\varepsilon / \sqrt{s_{xx}}}$ (or $t$ with $\sigma_\varepsilon \mapsto s_e$ with $\text{df} = n-2$, the same as the denom of $s_e$).
		- CI: $\hat \beta \pm t^\ast s_e / \sqrt{s_{xx}}$. We can do $p$-values and stuff with $\beta$ now.
		- Note that the distribution of $\hat \beta$ does NOT depend on population $\alpha$ at all, so we can just ignore $\alpha$ in our null hypothesis.

Mar 9
====
OLS prediction and confidence intervals: given a $x$, we can produce a *confidence interval* for the prediction $y(x)$ across different regressions, or we can produce a *prediction interval* for the individual datapoint's $y$.

1. For $\hat y(x) = \hat \alpha + \hat \beta \cdot x$, we have $\hat y(x) \sim \mathcal N(y(x), \sigma_\text{est. error(x)})$, where $\text{est. error}(x) = \hat y(x) - y(x)$ (remembering that $y(x) \sim \mathcal N(\alpha + \beta \cdot x, \sigma_\varepsilon)$ is our model for the true/population relationship).
	1. $V[\text{est. error(x)}] = V[\hat y(x)] + \cancel{V[y(x)]} + \cancel{\text{Cov}[\hat y(x), y(x)]}$ (since $y(x)$ is a population value).
	2. $t = \frac{\hat y(x) - y(x)}{s_\text{est. err(x)}} \sim t\text{-dist}(\text{df}=n-2=n-(k+1))$, so $\hat y(x) \pm t^\ast s_\text{est. error(x)}$.
	3. $s_\text{est. error} = s_\hat{y} = s_e \sqrt{\frac{1}{n} + \frac{(x-\overline x)^2}{s_{xx}}}$
2. Prediction interval for $y^\ast$ is $\hat y \pm t^\ast s_\text{pred. rror} = \hat y(x) \pm t^\ast \sqrt{s_{\hat y(x)}^2 + s_e^2}$ where $\text{df} = n-2=n-(k+1)$. This is $\pm t^\ast s_e \sqrt{1+ \frac{1}{n} + \frac{(x-\overline x)^2}{s_{xx}}}$
	1. This is because we are considering the distribution of $y^\ast - \hat y(x)$ and we just have the sum of two normally distributed values, as $y^\ast \sim \mathcal N(y(x), \sigma_\varepsilon)$.

Mar 11
====
Simple regression to multiple regression: simply $\text{df} = n - (k+1)$ instead of a fixed $n-2$. Remember $s_e = \sqrt{\frac{\text{SSE}}{n-(k+1)}}$, and remember collinearity, interaction, non-linearity, overfitting. 

Test on each of the regression coefficients: We have that $\hat{\beta_i}$ is normal about $\mu=\beta_i$ with stddev. $$\sigma=\frac{s_e}{\sqrt{s_{x_i x_i}}}$$ where $x_i$ is the predictor for $\beta_i$. $t$-dist with $\text{df} = n - (k+1)$, do confidence intervals and $p$-values.

Test of **model utility**: are _any_ of the $\beta_i$s nonzero? Similar to $F$-test, but compare to $0$. We just do $H_0 : \beta_1 = \beta_2 = \dots = 0$ and $H_1 :$ one of the $\beta$s is nonzero. The statistic is $$F = \frac{R^2 / k}{(1-R^2)/(n-(k+1))}$$
which is $F$-distributed with $\text{df} = (k, n-(k+1))$. $p$-value is $P(F > F_\text{obs} \mid H_0)$. If $p < \alpha$, we know that at least one of the $\beta_i$ predictors was useful (nonzero).
Now we have two $F$-tests: The $F$-test of model utility and the (1-way) ANOVA $F$-test.

Multiple hypothesis testing: this is why we do the $F$-test. By the definition of $p$-value, if we tested each $\beta_i$ individually then even if they are all useless we would have $\alpha\%$ of them light up as significant.

Mar 13
===
- Type I error: $\alpha$ is the probability of getting a significant $p$-value under the assumption of $H_0$. Probability of rejecting the null hypothesis when it is in fact true.
- Type II error: $\beta$ is the probability of not being able to reject the null hypothesis when it is in fact false. Statistical power is $1 - \beta$.

What is the worse error/better error? align the worse error with Type I errors and set $H_0$ and $H_1$ appropriately (it should be worse to accept $H_1$ when $H_0$ is true rather than the other way around, since this is the "harder" direction to get wrong)
