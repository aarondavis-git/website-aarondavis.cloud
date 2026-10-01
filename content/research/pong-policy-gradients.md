---
title: "Pong using Policy Gradients"
summary: "A policy gradient agent trained from raw pixels to learn how to play Pong through self-play."
tags: ["Policy Gradients", "Deep Learning", "Reinforcement Learning"]
github: "https://github.com/aarondavis-git/Pong-PolicyGradients"
date: "2024-03-01"
---

A policy gradient agent trained from raw pixels to learn how to play Pong
through self-play, with no hand-engineered features — just the difference
between consecutive frames as input.

## Objective

The policy $\pi_\theta(a \mid s)$ is a neural network parameterized by
$\theta$, trained to maximize the expected discounted return

$$
J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta} \left[ \sum_{t=0}^{T} \gamma^t r_t \right].
$$

## The REINFORCE gradient

Directly optimizing $J(\theta)$ without a value function uses the
REINFORCE estimator:

$$
\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta} \left[ \sum_{t=0}^{T} \nabla_\theta \log \pi_\theta(a_t \mid s_t) \, G_t \right],
$$

where $G_t = \sum_{k=t}^{T} \gamma^{k-t} r_k$ is the return from timestep
$t$ onward. In practice, $G_t$ is centered and normalized across each batch
of episodes to reduce the variance of the gradient estimate before the
policy update

$$
\theta \leftarrow \theta + \alpha \, \nabla_\theta J(\theta).
$$

## Result

After enough self-play episodes, the agent reliably beats the built-in
Pong AI, learning entirely from the $+1$/$-1$ reward at the end of each
point with no intermediate shaping.

Source code: [github.com/aarondavis-git/Pong-PolicyGradients](https://github.com/aarondavis-git/Pong-PolicyGradients)
