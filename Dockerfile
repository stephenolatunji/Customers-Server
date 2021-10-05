FROM node:14

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/app

#Add environmental variables

ARG CUSTOMER_HOST
ARG CUSTOMER_DB
ARG CUSTONER_PASSWORD
ARG CUSTOMER_


ENV HOST $CUSTOMER_HOST
ENV DB $CUSTOMER_DB
ENV PASSWORD $CUSTOMER_PASSWORD
ENV CUSTOMER $CUSTOMER_


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