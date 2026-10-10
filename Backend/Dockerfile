FROM node:22

# the folder our project will live in inside the container:
WORKDIR /app

# copy the package files first, so docker can cache the install step:
COPY package*.json ./

RUN npm install

# copy the rest of the project:
COPY . .

EXPOSE 4000

CMD ["npm", "start"]
