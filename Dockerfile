FROM node:6.1-slim

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME /home/app

COPY package.json $HOME/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME
RUN npm install

USER root
COPY . $HOME/
RUN chown -R app:app $HOME/*
USER app

CMD ["npm", "run", "build"]
