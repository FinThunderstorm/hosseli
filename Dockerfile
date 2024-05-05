FROM node:20.12.2

WORKDIR /hosseli

COPY . .
RUN ls -la
RUN bash ./build.sh

EXPOSE 3000

ENV PORT 3000

CMD bash ./scripts/start-prod-server.sh