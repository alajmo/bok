layout: post.html
date: 2019-03-22
title: A Brief Intro to SSH
draft: false
---

It's not unusual to stumble upon the terms SSH and be a bit perplexed as to just what it is, how it works and what all the files and command line tools are for.

This post will briefly cover some of that!

## Table of Contents

<!-- vim-markdown-toc GFM -->

* [Overview](#overview)
* [Tools and Files](#tools-and-files)
  * [Tools](#tools)
  * [Files](#files)

<!-- vim-markdown-toc -->

## Overview

SSH stands for Secure Shell and is a communication protocol that is characterized by encrypting communication between two ends.

It's most commonly used to securely remote-login to a server and execute some commands, move data between servers, etc.
There is multiple software that implement the SSH protocol, one of the most widely used being <span class="underline_blue">OpenSSH</span> and is the one that comes pre-installed with Ubuntu for instance.

Some other noteworthy points:

- SSH uses a client-server model
- Two major versions released SSH-1 & SSH-2
- Standard TCP port <span class="cositas1">22</span>
- <span class="border_black">Private key</span>, also called an identity key, is a key that only you should have access to
- <span class="border_black">Public key</span>, also known as an authorized key, is a key that is used to prove the identity and is not secret
- <span class="border_black">Identity keys</span> and <span class="border_black">Authorized keys</span> are jointly called <span class="underline">User Keys</span>.

## Tools and Files

There are a lot of CLI tools and files associated with SSH, some of them are:

### Tools

- **ssh-keygen**: creates a key pair for public key authentication
- **ssh-copy-id**: configures a public key as authorized on a server
- **ssh-agent**: agent to hold private key for single sign-on
- **ssh-add**: tool to add a key to the agent
- **scp**: file transfer client with RCP-like command interface (uses the Secure Copy Protocol)
- **sftp**: file transfer client with FTP-like command interface (uses the SSH File Transfer Protocol)
- **sshd**: OpenSSH server

### Files

- <span class="border_black">~/.ssh/known_hosts</span>: file containing list of known hosts, each server contains a host key so next time you connect, it can verify you are connecting to the same server
- <span class="border_black">~/.ssh/id_&lt;algorithm></span>: private key (default naming), algorithm can for instance be RSA, DSA, ECDSA
- <span class="border_black">~/.ssh/id_&lt;algorithm>.pub</span>: public key (default naming)
- <span class="border_black">~/.ssh/authorized_key</span>: list of public keys which can be used to login to the server, usually located at root-owned locations (should only be writable by owner and root)
- <span class="border_black">/etc/ssh/ssh_host_&lt;algorithm></span>: Private host keys stored on SSH servers
- <span class="border_black">/etc/ssh/ssh_host_&lt;algorithm>.pub</span>: Public host keys are stored on and/or distributed to SSH clients
