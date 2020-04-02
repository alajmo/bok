layout: pages/post.ts
type: post
date: 2018-08-18
title: Setting up a private Docker Registry
---

This tutorial covers setting up a private **Docker Registry** on **AWS** with **Nginx** setup as a reverse proxy and generated **Let's Encrypt** **SSL** certificates.
While the steps are specific to particular environments (Ubuntu, S3), they can easily be replicated to others. Also keep in mind that **Let's Encrypt** certificates are only valid for a limited amount of time (something like three months).

## Prerequisites

Some knowledge of the following software/services is beneficial:

- Docker - should be installed on the server
- Nginx - must be installed on the server
- EC2 instance (port's 22, 443, 80 should be open)
- AWS s3 storage

## Concepts

> **SSL, Secure Sockets Layer** - ensures communication between client & server is encrypted

> **Docker Registry** - a stateless, highly scalable server side application that stores and lets you distribute Docker images

> **Nginx** - a web server (can be used as a reverse proxy, load balancer, mail proxy and HTTP cache)

> **Reverse proxy** - a reverse proxy is a type of proxy server that retrieves resources on behalf of a client from one or more servers

## Steps

1.  Create password auth for registry
2.  Setup SSL using **Let's Encrypt**
3.  Start **Docker Registry**
4.  Push & pull an image from the registry

This is basically what we have:
![docker-registry](/assets/images/svg/docker-registry.svg)

## 1. Create password auth for registry

Create password authentication for **Docker Registry**, replace `<user>` and `<password>` with appropriate values:
```sh
mkdir /auth
docker run –entrypoint htpasswd registry:2 -bn <user> <password> > /auth/.htpasswd
```

## 2. Setup SSL using **Let's Encrypt**

Install [certbot](https://certbot.eff.org/), software which lets us automatically enable HTTPS on websites by deploying **Let's Encrypt** certificates:
```sh
# Ubuntu steps:
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx
```

Before running certbot, make sure the DNS settings include an *A* record that points to the intended **Docker Registry** server. For instance, mine *A* record looks like the following:

| Type  | Name          | Value   |
|-------|---------------|---------|
| A     | docker        | x.x.x.x |
| CNAME | alajmovic.com | y.y.y.y |

So the sub-domain will be `docker` and the **Docker Registry** will be accessible by `https://docker.alajmovic.com/v2/`.

Running the below command will create **Let's Encrypt** certificates and update the default `nginx.conf` config automatically:
```sh
certbot --nginx
```

Running the above command will hopefully have generated the following files:


| file            | description                                                                                         |
|-----------------|-----------------------------------------------------------------------------------------------------|
| privkey.pem   | the private key for your certificate                                                                |
| fullchain.pem | the certificate file used in most server software                                                   |
| chain.pem     | used for OCSP stapling in Nginx >=1.3.7                                                             |
| cert.pem      | will break many server configurations, and should not be used without reading further documentation |

Now update the Nginx config to look like the below config (replace <host> with the intended **Docker Registry** host, mine is `docker.alajmovic.com` for instance):
```nginx
# /etc/nginx/nginx.conf

server {
    server_name <host>;
    listen 443 ssl; # managed by Certbot

    add_header Docker-Distribution-Api-Version: registry/2.0 always;

    ssl on;
    ssl_certificate /etc/letsencrypt/live/<host>/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/<host>/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Original-URI $request_uri;
    proxy_set_header Docker-Distribution-Api-Version registry/2.0;

    location / {
        auth_basic "Restricted";
        auth_basic_user_file /auth/.htpasswd;

        proxy_read_timeout 900;
        proxy_pass http://localhost:5000;
    }
}
```

You can then test and reload your config:
```sh
# Test the nginx.conf config
sudo service nginx configtest
sudo service status nginx # Used to debug if configtest fails

# Hot reload (doesn't restart Nginx) of config
sudo service nginx reload
```

### Renew Certificates

If you want to renew the certificates you can run the following command:

```sh
# Use flag --dry-run if you want to test first
certbot renew
```

## 3. Start **Docker Registry**

We will use [s3](https://github.com/docker/docker.github.io/blob/master/registry/storage-drivers/s3.md) storage drivers which allows us to interface the running Docker Registry with AWS s3 storage by supplying some environment variables.

```sh
# Stop registry if started already
sudo docker container stop registry && docker container rm -v registry

# Run the registry
docker run -d \
  -p 5000:5000 \
  -v `pwd`/auth:/auth \
  -e registry_auth=htpasswd \
  -e registry_auth_htpasswd_realm="registry realm" \
  -e registry_auth_htpasswd_path=/auth/.htpasswd \
  -e REGISTRY_STORAGE=s3 \
  -e REGISTRY_STORAGE_S3_ACCESSKEY=<access-key> \
  -e REGISTRY_STORAGE_S3_SECRETKEY=<secret> \
  -e REGISTRY_STORAGE_S3_REGION=<region>\
  -e REGISTRY_STORAGE_S3_BUCKET=<bucket-name> \
  -e REGISTRY_STORAGE_CACHE_BLOBDESCRIPTOR=inmemory \
  --restart=always \
  --name registry \
  registry:2
```

## 4. Push & pull an image from the registry

Now, let's test our newly deployed **Docker Registry**:
```sh
# From the server
docker pull busybox
docker login -u=<user> -p=<password> localhost:5000
docker tag busybox localhost:5000/busybox
docker push localhost:5000/busybox
docker pull localhost:5000/busybox

# From a client
docker pull busybox
docker login -u=<user> -p=<password> <host>
docker tag busybox <host>/busybox
docker push <host>/busybox
docker pull <host>/busybox
```

It is also possible to curl the registry:
```sh
# From the server
curl  localhost:5000/v2/_catalog

# From a client
curl https://<host>/v2/_catalog -u <user>:<password>
```

## Bonus

View the images in a browser using [klausmeyer/docker-registry-browser](https://github.com/klausmeyer/docker-registry-browser).

Run the following command from a client's terminal:
```sh
sudo docker run --name registry-browser \
            -it \
            -p 8080:8080 \
            -e BASIC_AUTH_USER=<user> \
            -e BASIC_AUTH_PASSWORD=<password> \
            -e DOCKER_REGISTRY_URL=https://<host> \
            klausmeyer/docker-registry-browser
```

## Troubleshooting

### Can't get Let's Encrypt to generate the certificate

Make sure inbound traffic is set up correctly, and the DNS settings include a **A** record to the subdomain.

### Keep getting 5xx

Something is wrong with the `docker run registry...` command, try running `sudo docker logs registry` to debug.

### Keep getting 4xx

Something is wrong with Nginx or auth credentials, try running `sudo docker port registry` to verify correct ports are open. May also be that the ports 443/80 are not open for inbound communication.

## References

- [Deploying Docker Registry](https://github.com/docker/docker.github.io/blob/master/registry/deploying.md)
- [The Docker toolset to pack, ship, store, and deliver content](https://github.com/docker/distribution)
- [Storage drivers for Docker](https://github.com/docker/docker.github.io/blob/master/registry/storage-drivers/index.md)
- [Find more info about AWS s3 drivers for docker](https://github.com/docker/docker.github.io/blob/master/registry/storage-drivers/s3.md)
- [Docker Nginx Recipes](https://docs.docker.com/registry/recipes/nginx/#setting-things-up)
