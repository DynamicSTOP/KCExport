# Kancolle Export Lists

[![Build Status](https://travis-ci.org/DynamicSTOP/kcexport.svg?branch=master)](https://travis-ci.org/DynamicSTOP/kcexport)

**Website** [https://export.kc-db.info](https://export.kc-db.info). Ship list [example](https://export.kc-db.info/#/ship-list-short/b07429decb38)  

Made for easy sharing **digital** version of ship lists. Equip lists are planned feature.
 
Is actively using following projects:
 - [KC3Kai](https://github.com/KC3Kai/KC3Kai)
 - [WhoCallsTheFleet](https://github.com/TeamFleet/WhoCallsTheFleet)
 
Frameworks and other worse mentioning links:
 - [Vue.js](https://vuejs.org/)
 - [Travis CI](https://travis-ci.org/)

## Installation

### 1. Setup environment  

You have two variants:  

- **Docker way**    
  - install [docker-compose](https://docs.docker.com/compose/).  
  - make `.env` based on `.env.example`. 
  - go to the project directory and run `docker-compose up -d`.
  - after image started, connect to it using `docker-compose exec kcex bash`.
- **Native way** 
  - check Dockerfile for string like this `FROM node:8.11.2`. 
    8.11.2 here is node version that you will need. Download and install it from [nodejs.org](https://nodejs.org/en/).
  - go to project root folder.
   
### 2. Setup modules  

- generally all you need to do now is run `yarn install` to get node_modules

### 3. Update helper files  

This step will most likely would be repeated a lot. Once new ship\remodel is added or new equip is out or stats changed etc.   

- you will need to run script that will download [WCTF db](https://github.com/TeamFleet/WhoCallsTheFleet) files (btw spend a minute and add a star, we use it a lot after all).
  To do so run `yarn WCTF`. If you want to update existing db files you need to manually remove them from `./external` folder.
- now you need to make ship sprites!  
  -  2 options here
     - either copy images **without _d** from `KC3Kai/src/assets/img/ships` to `src/images/ships` (check .gitignore for more info)
     - or run `yarn KC3Avatars`
  - if needed update lock images `src/images/locks`
  - run `yarn sprites`
  
### 4. Run local server

  - run `yarn serve`
  
### 5. Deploy

 - To be discussed. Probably Travis will deploy stuff from master.