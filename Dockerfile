FROM node:14

# build the client app

RUN mkdir -p /opt/sunspotter

# Create app directory
WORKDIR /opt/sunspotter

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./app.js .
COPY ./build ./public

RUN mkdir -p /opt/sunspotter/public/images/predicted


WORKDIR /opt/sunspotter

EXPOSE 3000
CMD [ "npm", "run", "app" ]
