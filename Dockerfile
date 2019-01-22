FROM node:8-alpine
MAINTAINER CoderDojo Foundation <webteam@coderdojo.org>
ENV NODE_ENV=production
RUN apk add --update git build-base python postgresql-client &&\
   mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn && \
    apk del build-base python && \
    rm -rf /tmp/* /root/.npm /root/.node-gyp
EXPOSE 3000
CMD ["yarn", "start"]
