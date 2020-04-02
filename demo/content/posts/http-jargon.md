layout: pages/post.ts
type: post
draft: true
date: 2020-02-03
title: Useful Web and Linux Development Terminology
---

This post will cover the most common terms used in web development with the following domains, languages, protocols and software: HTTP, SSL, API, JS, DOM, CSS, HTML, OAuth2, SSH, GPG, CLI.

Communication is one of the most crucial aspects of a Software Development, no matter if you're a single developer or working in a team. It allows you to name semantic structures accordingly, both for yourself when internalizing solutions and reading software documentation, but most importantly, when conveying solutions to other people.

## Table of Contents

* [Glossary](#glossary)
  * [HTTP](#http)
  * [SSL](#ssl)
  * [API](#api)
  * [JS](#js)
  * [DOM](#dom)
  * [CSS](#css)
  * [HTML](#html)
  * [OAuth2](#oauth2)
  * [SSH](#ssh)
  * [GPG](#gpg)
  * [CLI](#cli)
* [Resources](#resources)

## Glossary

https://www.digitalocean.com/community/tutorials/an-introduction-to-networking-terminology-interfaces-and-protocols#network-layers
https://en.wikipedia.org/wiki/Fully_qualified_domain_name
https://answers.microsoft.com/en-us/xbox/forum/xba_neteq/networking-terms-glossary/9d7e4db4-33de-4781-8a96-d0bbc008e650
https://www.digitalocean.com/community/tutorials/an-introduction-to-networking-terminology-interfaces-and-protocols
https://www.computerhope.com/jargon/network.htm

Begin from first principle -> Why is it necessary, A first principle is a basic proposition or assumption that cannot be deduced from any other proposition or assumption. In philosophy, first principles are from First Cause[1] attitudes and taught by Aristotelians, and nuanced versions of first principles are referred to as postulates by Kantians.[2]

### General Network Terminology

We want to relay information from point A to point B.

- Network: A network is a digital telecommunications network for sharing resources between computers of different sorts.
- Network Node: Network nodes are network computer devices that originate, route and terminate data communication.
- Network Address: A network address is an identifier for a network node.
- IP Address (Internet Protocol Address): an IP Address is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication. Identifies the location of your computer on a network.
- Internet: Internet is a public network utilizing the Internet Protocol.
- LAN (Local Area Network): A private/internal network.
- Host: a host is usually a computer that is connected to a computer network and has a unique identifier.
- Host Name: a hostname is a label that is assigned to a device connected to a computer network and that is used to identify the device in various forms of electronic communication, such as the World Wide Web. A hostname is the label assigned to a device (a host) on a network and is used to distinguish one device from another on a specific network or over the internet. The hostname for a computer on a home network may be something like new laptop, Guest-Desktop, or FamilyPC. www.google.com, www is the hostname, images.google.com, images is the hostname.
- Domain Name: a domain name is a unique string value, which is used to find resources on the internet. It is tied to an IP address entry in a DNS. www.google.com google is the domain name.
- DNS (Domain Name System): a DNS is a hierarchical and decentralized naming system for computers connected to to a network. It keeps a key-value list of sorts, with the key being the domain name and the values being various other information, most notably an IP address.
- FQDN (Fully Qualified Domain Name): a FQDN is a domain name that specifies its exact location in the tree hierarchy of the Domain Name System. It includes all the domain levels. Host name precedes domain name, domain name precedes top-level domain (dot-com). A FQDN includes (ordered from lowest level to the top-level domain)
- URI (Uniform Resource Identifier): URI is a web terminology and
- URL (Uniform Resource Locator): URL maps a key to an ip address
- Port: A
- FTP (File Transfer Protocol):
- NAT (Network Address Translation): NAT is a method of remapping one IP address space into another. Used to connect multiple computers to the internet for example. It usually runs inside a router, which acts as an agent between the internet and a local network. https://computer.howstuffworks.com/nat3.htm
- NAS (Network Attached Storage):
- UDP: https://computer.howstuffworks.com/web-server.htm
- TCP: https://computer.howstuffworks.com/web-server.htm

scheme://domain:port/path?query_string#fragment_id
- learn called path param and query param, :id path, ?id query param

### HTTP

We want to standardize communication, so that it is easier to process in-coming data.

**HTTP** (Hypertext Transfer Protocol), is the protocol framework for describing how communication takes place between different entities, such as clients or servers. It deals with **requests** and **responses**. These words are all part of the communication protocol:

- **headers**: Each requests carries some headers, or meta data, which describes the requests
- **method**: The methods are verbs that describe how you want to interact with the state, get/post/put/delete
- **payload**: The payload denotes the data that is transported
- **body**: Body
- **query**: You can send data in multiple ways, a query is one of them. It is the part of the url that comes after `?`.
- **path**: Path is the part of the URL that targets a specific endpoint.
- **form**:

Body, Query, Path,

Path parameters, /:id/
Query parameters, ?
body
form

### SSL

We want the information that we send to point B to only be able to be read by point B, and not anyone else that's passing through the data from one node to another.

SSL (Secure Sockets Layer).

More specifically, SSL is a security protocol

Secure Sockets Layer (SSL) is a standard security technology for establishing an encrypted link between a server and a client—typically a web server (website) and a browser, or a mail server and a mail client (e.g., Outlook).

However, the browser and the server need what is called an SSL Certificate to be able to establish a secure connection.

Files:

/etc/ssl/openssl.cnf

### OAuth

OAuth (Open Authentication)

### SSH

SSH (Secure Shell)

### PGP

PGP (Pretty Good Privacy)

GPG (GNU Privacy Guard), implementation of PGP.

### PKI

Public Key Infrastructure
Certificate
Token

### API

We want to expose our data to other clients.

API (Application Programming Interface)

### JS

We want a general scripting language.

JS (Javascript)
scope
context
property
key
value
attribute

### DOM

We want

DOM (Document Object Model)3000

### CSS

CSS (Cascading style sheets)

### HTML

HTML (Hypertext Markup Language)

### CLI

CLI (Command-Line Interpreter)

Terminal, Shell, Bash, Commandline, Prompt, Declare vs Define

## Resources

https://www2.southeastern.edu/Academics/Faculty/kyang/2014/Fall/CMPS401/ClassNotes/CMPS401ClassNotesChap05.pdf
https://www.lix.polytechnique.fr/~liberti/public/computing/prog/c/C/glossary.html#parameter
http://www.programmingforbeginnersbook.com/blog/expand_your_programming_vocabulary/
https://www.cs.kent.ac.uk/people/staff/djb/oop/glossary.html
https://www.vocabulary.com/dictionary/programming%20language
http://www.jsoftware.com/help/dictionary/vocabul.htm
- [ecma homepage](http://ecma-international.org/)
- [tc39](https://tc39.github.io/)

AJAX https://www.youtube.com/watch?v=6-RpMaef-jg

parser.protocol; // => "http:"
parser.hostname; // => "example.com"
parser.port;     // => "3000"
parser.pathname; // => "/pathname/"
parser.search;   // => "?search=test"
parser.hash;     // => "#hash"
parser.host;

- blog post of common terms in web world DOM element, html tag, attribute, https://dev.to/helenanders26/sql-series-from-a-to-z-2pk9

https://nodesource.com/blog/ABC-of-JavaScript-and-Nodejs

https://prettydiff.com/2/guide/unrelated_dom.xhtml

https://itnext.io/javascript-fundamentals-an-introduction-to-rest-apis-7cbe8a809d3b

https://www.w3.org/2003/glossary/
https://www.lifewire.com/what-is-a-hostname-2625906

https://www.digitalocean.com/community/tutorials/an-introduction-to-networking-terminology-interfaces-and-protocols
https://answers.microsoft.com/en-us/xbox/forum/xba_neteq/networking-terms-glossary/9d7e4db4-33de-4781-8a96-d0bbc008e650
