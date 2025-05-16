FROM node
WORKDIR /app
COPY pakage*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD [ "npm", "start", "dev"]