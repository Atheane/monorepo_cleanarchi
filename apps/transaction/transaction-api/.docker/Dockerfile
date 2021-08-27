FROM node:15.0.1-alpine3.10


WORKDIR /usr/src/app

RUN mkdir node_modules
RUN mkdir dist
COPY node_modules node_modules
COPY dist dist

RUN apk add openssh \
 && echo "root:Docker!" | chpasswd 
WORKDIR /etc/ssh/
RUN ssh-keygen -A

COPY apps/transaction/transaction-api/.docker/sshd_config /etc/ssh/
COPY apps/transaction/transaction-api/.docker/init.sh /usr/local/bin/

RUN chmod u+x /usr/local/bin/init.sh

EXPOSE 3004 2222

ENTRYPOINT ["/usr/local/bin/init.sh"]


