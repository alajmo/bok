layout: pages/post.ts
type: post
date: 2018-12-19
draft: true
title: PGP
---

This post will cover the basics when it comes to secure communications on the internet, the lingo / terms used, between clients and servers.

## PGP - Pretty Good Privacy

Encrypt data / messages by ways of private / public keys. Verify the messenger as well as the integrity of the data. Sender / Receiver. Signing / encrypting / decrypting

### Files

`$HOME/.gnupg` - This is the default home directory w
`$HOME/.gnugpg/gpg-agent.conf` - configuration file for gpg-agent [backup]
`$HOME/.gnugpg/gpg.conf` - default configurations for gpg. [backup]
`$HOME/.gnugpg/private-keys-v1.d/` - directory that gpg-agent uses to store private keys [backup]
`$HOME/.gnugpg/secring.gpg` - [superseded by private-keys-v1.d]
`$HOME/.gnugpg/pubring.kbx` - public key ring. This a database file storing the certificates as well as meta information. [backup]
`$HOME/.gnugpg/pubring.gpg` - [superseded by pubring.kbx]
`$HOME/.gnugpg/random_seed` - A file used to preserve the state of the internal random pool.
`$HOME/.gnugpg/S.gpg-agent` - socket that gpg-agent uses to communicate
`$HOME/.gnugpg/trustdb.gpg` - the trust database

`trustlist`.txt - This is the global list of trusted keys [backup]

https://www.gnupg.org/documentation/manuals/gnupg/GPG-Configuration.html#GPG-Configuration

Note some of the files have lock files associated with them when the files are being modified.

## Terms

### Key Ring

A key ring is a file which contains multiple public keys of certificate authority (CA).
A key ring is a file which is necessary for Secure Sockets Layer (SSL) connection over the web. It is securely stored on the server which hosts the website. It contains the public/private key pair for the particular website. It also contains the public/private key pairs from various certificate authorities and the trusted root certificate for the various certification authorities.
An entity or website administrator has to send a certificate signing request (CSR) to the CA. The CA then returns a signed certificate to the entity. This certificate received from the CA has to be stored in the key ring.
