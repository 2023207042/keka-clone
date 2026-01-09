#Build Docker as keka-clone-api and push to Docker Hub
#docker buildx build --platform linux/amd64,linux/arm64 -t arpudhanaresh/keka-clone-api:latest --push .


FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generate TSOA routes
RUN npm run build

ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]
