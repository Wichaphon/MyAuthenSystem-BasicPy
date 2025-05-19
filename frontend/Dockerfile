
# FROM node:18
# WORKDIR /app
# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5173
# CMD ["npm", "run", "dev"]

# FROM node:18
# WORKDIR /app/frontend
# COPY frontend/package*.json ./
# RUN npm install
# COPY frontend ./
# EXPOSE 5173
# CMD ["npm", "run", "dev"]

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]


