FROM node:14-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/app

#Add environmental variables

ARG CUSTOMER_HOST
ARG CUSTOMER_USER
ARG CUSTOMER_PASSWORD
ARG CUSTOMER_DB
ARG CUSTOMER_SECRET
ARG CUSTOMER_PORT


ENV HOST $CUSTOMER_HOST
ENV USER $CUSTOMER_USER
ENV PASSWORD $CUSTOMER_PASSWORD
ENV DB $CUSTOMER_DB
ENV JWT_SECRET $CUSTOMER_SECRET
ENV PORT $CUSTOMER_PORT


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /usr/app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /usr/app

EXPOSE 80

CMD [ "npm", "start" ]