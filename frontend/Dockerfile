FROM node
WORKDIR /app
COPY pakage.json .
RUN npm install
COPY . .
EXPOSE 30001
CMD [ "npm", "start" ]