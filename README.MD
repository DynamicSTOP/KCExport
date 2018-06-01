# Kancolle Export Lists

## installation

### 1. Setup environment  

You have two variants:  

- **Docker way**    
  - install [docker-compose](https://docs.docker.com/compose/).   
  - go to the project directory and run `docker-compose up -d`.
  - after image started, connect to it using `docker-compose exec kcex bash`.
- **Native way** 
  - check Dockerfile for string like this `FROM node:8.11.2`. 
    8.11.2 here is node version that you will need. Download and install it from [nodejs.org](https://nodejs.org/en/).
  - in same Dockerfile look for `npm install` commands like this `npm install -g @vue/cli`
    you will need to run those manually.
  - go to project root folder.
   
### 2. Setup modules  

- generally all you need to do now is run `npm install` to get node_modules

### 3. Update helper files  

This step will most likely would be repeated a lot. Once new ship\remodel is added or new equip is out or stats changed etc.   

- you will need to run script that will download [WCTF db](https://github.com/TeamFleet/WhoCallsTheFleet) files (btw spend a minute and add a star, we use it a lot after all).
  To do so run `yarn WCTF`. If you want to update existing db files you need to manually remove them from `./external` folder.
- now you need to make sprites! 
  - first you will need to get KC3 project (until someone would write a script to get them from github)
  - copy images **without _d** from `KC3Kai/src/assets/img/ships` to `src/images/ships` (check .gitignore for more info)
  - if needed update lock images `src/images/locks`
  - run `yarn sprites`
  
### 4. Run local server

  - run `yarn serve`
  
### 5. Deploy

 - To be discussed. Probably Travis will deploy stuff from master.