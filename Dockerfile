FROM node:20.10.0
WORKDIR /app
COPY package*.json .
RUN npm install --only=prod
COPY ./dist ./dist
CMD ["npm", "start"]
EXPOSE 5050