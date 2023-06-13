FROM node:18-alpine
WORKDIR /usr/src/app

COPY .yarn .yarn/
COPY .yarnrc.yml yarn.lock package.json ./
COPY browser/package.json ./browser/
COPY core/package.json ./core/
COPY server/package.json ./server/


RUN yarn install --frozen-lockfile
COPY . .
RUN yarn workspaces foreach --verbose --topological run build

EXPOSE ${PORT}
CMD [ "node", "./server/dist/index.js"]
