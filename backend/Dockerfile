FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure the uploads directory exists
RUN mkdir -p uploads

EXPOSE 7860
ENV PORT=7860

CMD ["npm", "start"]
