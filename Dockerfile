FROM node:16.14 AS deps
# Environment
ENV NODE_ENV=development \
    HUSKY=0
WORKDIR /home/app
# Dependencies
COPY package.json yarn.lock .yarnclean /home/app/

# RUN lerna bootstrap
RUN yarn install --frozen-lockfile --non-interactive 


FROM node:16.14 as builder

# Environment
ENV NODE_ENV=development \
    HUSKY=0

WORKDIR /home/app

COPY . /home/app/

COPY --from=deps /home/app/node_modules ./node_modules

RUN yarn build


# Serve

FROM node:16.14-alpine as intemediate
ENV NODE_ENV=production

WORKDIR /home/app

COPY --from=builder /home/app/dist /home/app/dist/
COPY --from=builder /home/app/package.json /home/app/package.json

RUN yarn install --production --no-optional --frozen-lockfile --non-interactive --ignore-scripts --prefer-offline



FROM node:16.14-alpine as runner
ENV NODE_ENV=production \
    TZ='Asia/Colombo'

WORKDIR /home/app

COPY --from=intemediate /home/app /home/app/

CMD [ "node", "dist/index.js" ]
