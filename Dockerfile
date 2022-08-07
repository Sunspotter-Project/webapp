FROM node:14

# build the client app

RUN mkdir -p /opt/sunspotter \
    mkdir -p /opt/shared

# Create app directory
WORKDIR /opt/sunspotter

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./sunspotter/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./sunspotter/ .
COPY ./sunspotter/client/build ./public

# Install shared project
WORKDIR /opt/shared

COPY ./shared/package*.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./shared/ .

WORKDIR /opt/sunspotter

#RUN apt-get update
#RUN apt-get install python3 python3-pip -y

#RUN pip3 install --upgrade pip
#RUN pip3 install requests pysqlite3 numpy pillow "tensorflow>=2.0" --upgrade tensorflow-hub
#RUN pip3 install "tensorflow>=2.0"
#RUN pip3 install --upgrade tensorflow-hub

EXPOSE 3000
CMD [ "npm", "run", "server" ]