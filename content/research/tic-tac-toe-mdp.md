---
title: "Tic-Tac-Toe using Markov Decision Processes"
summary: "An agent that plays optimal Tic-Tac-Toe by modeling the game as a Markov Decision Process and solving for the best policy."
tags: ["Markov Decision Process", "Game Theory", "Reinforcement Learning"]
github: "https://github.com/aarondavis-git/TicTacToe-MarkovDecisionProcess"
date: "2024-02-01"
---

An agent that plays optimal Tic-Tac-Toe by modeling the game as a **Markov
Decision Process** (MDP) and solving for the optimal policy directly,
rather than learning one through trial and error.

## The MDP formulation

The game is modeled as a tuple $(S, A, P, R, \gamma)$, where each board
state $s \in S$ is a $3 \times 3$ grid of $\{X, O, \text{empty}\}$, and each
action $a \in A(s)$ places the current player's mark on an empty cell.

Since the game is deterministic, the transition function collapses to

$$
P(s' \mid s, a) =
\begin{cases}
1 & \text{if } s' \text{ is the result of playing } a \text{ in } s \\
0 & \text{otherwise}
\end{cases}
$$

and the reward is only ever non-zero at a terminal state:

$$
R(s, a, s') =
\begin{cases}
+1 & \text{agent wins in } s' \\
-1 & \text{opponent wins in } s' \\
0 & \text{draw or non-terminal}
\end{cases}
$$

## Solving for the optimal policy

With the full state space small enough to enumerate, the optimal
value function is computed exactly via the Bellman optimality equation

$$
V^*(s) = \max_{a \in A(s)} \sum_{s'} P(s' \mid s, a) \Big[ R(s, a, s') + \gamma\, V^*(s') \Big],
$$

solved by backward induction from terminal states, and the optimal policy
follows directly:

$$
\pi^*(s) = \arg\max_{a \in A(s)} \sum_{s'} P(s' \mid s, a) \Big[ R(s, a, s') + \gamma\, V^*(s') \Big].
$$

Because $\gamma = 1$ and the game tree is finite, this reduces to ordinary
minimax with no discounting — the MDP framing mainly matters once the
opponent's policy is treated as stochastic rather than adversarial.

## Result

The resulting agent never loses: it wins against any suboptimal opponent
and draws against an optimal one, matching the known game-theoretic result
for Tic-Tac-Toe.

Source code: [github.com/aarondavis-git/TicTacToe-MarkovDecisionProcess](https://github.com/aarondavis-git/TicTacToe-MarkovDecisionProcess)
