FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    default-jdk-headless \
    curl \
    bash \
    git \
    gnupg2 \
    ca-certificates \
    iputils-ping \
    dnsutils \
    supervisor \
    && apt-get clean

ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PATH=$JAVA_HOME/bin:$PATH

RUN curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt-get install -y nodejs \
    && npm install -g npm@latest \
    && rm -f nodesource_setup.sh

COPY package*.json /usr/src/app/
WORKDIR /usr/src/app/
RUN chmod -R 777 /usr/src/app/
RUN npm cache clean --force
RUN curl -I https://registry.npmjs.org/

RUN npm install

COPY . /usr/src/app/

COPY supervisord.conf /app/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/app/supervisord.conf"]
