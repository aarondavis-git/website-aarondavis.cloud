---
title: "Pruning using the Lottery Ticket Hypothesis"
summary: "Testing the Lottery Ticket Hypothesis by iteratively pruning networks to find sparse, trainable subnetworks."
tags: ["Neural Networks", "Pruning", "Optimization"]
github: "https://github.com/aarondavis-git/Pruning-LotteryTicketHypothesis"
date: "2024-04-01"
---

Testing the **Lottery Ticket Hypothesis** — the claim that a randomly
initialized dense network contains a much smaller subnetwork which, if
trained in isolation from the *same* initial weights, can match the full
network's accuracy.

## Iterative magnitude pruning

Starting from a dense network with initial weights $\theta_0$, each round:

1. Trains the current network to convergence.
2. Prunes the $p\%$ of remaining weights with the smallest magnitude,
   producing a binary mask $m$.
3. Resets the surviving weights back to their original values from
   $\theta_0$ (not their trained values) — this "rewinding" step is what
   distinguishes a winning ticket from ordinary pruning.

The resulting sparse network at round $k$ is

$$
\theta_k = m_k \odot \theta_0,
$$

where $\odot$ denotes elementwise multiplication and $m_k \in \{0,1\}^{|\theta_0|}$
is the cumulative mask after $k$ rounds of pruning.

## What "winning" means

A subnetwork $(m, \theta_0)$ is a winning ticket if, trained in isolation,
it reaches test accuracy within $\epsilon$ of the original dense network at
the same number of training iterations $j$:

$$
\left| \text{acc}\big(m \odot \theta_0,\, j\big) - \text{acc}(\theta_0^{\text{dense}},\, j) \right| < \epsilon.
$$

## Result

Iterative pruning consistently finds subnetworks at 10–20% of the original
parameter count that match dense-network accuracy — but only when rewound
to the original initialization; pruning to the same sparsity without
rewinding degrades accuracy noticeably, matching the hypothesis's central
claim.

Source code: [github.com/aarondavis-git/Pruning-LotteryTicketHypothesis](https://github.com/aarondavis-git/Pruning-LotteryTicketHypothesis)
