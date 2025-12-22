FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generate TSOA routes
RUN npm run build

ENV PORT=8116

EXPOSE 8116

CMD ["npm", "start"]
