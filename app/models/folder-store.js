'use strict';
const cloudinary = require('cloudinary');
const logger = require('../utils/logger');

try {
  const env = require('../.data/.env.json');
  cloudinary.config(env.cloudinary);
}
catch(e) {
  logger.info('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}

const _ = require('lodash');
const JsonStore = require('./json-store');

const folderStore = {

  store: new JsonStore('./models/folder-store.json', { folderCollection: [] }),
  collection: 'folderCollection',

  getAllFolders() {
    return this.store.findAll(this.collection);
  },

  getFolder(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

   addFolder(folder, response) {
    folder.picture.mv('tempimage', err => {
        if (!err) {
          cloudinary.uploader.upload('tempimage', result => {
            console.log(result);
            folder.picture = result.url;
            response();
          });
        }
      });
    this.store.add(this.collection, folder);
  },

  removeFolder(id) {
    const folder = this.getFolder(id);
    this.store.remove(this.collection, folder);
  },

  removeAllFolders() {
    this.store.removeAll(this.collection);
  },

  addGame(id, game) {
    const folder = this.getFolder(id);
    folder.games.push(game);
  },

  removeGame(id, gameId) {
    const folder = this.getFolder(id);
    const games = folder.games;
    _.remove(games, { id: gameId});
  },
  
  editGame(id, gameId, updatedGame) {
    const folder = this.getFolder(id);
    const games = folder.games;
    const index = games.findIndex(game => game.id === gameId);
    games[index].title = updatedGame.title;
    games[index].developer = updatedGame.developer;
    games[index].genre = updatedGame.genre;
    
  },
  
  getUserFolders(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },
    
};

module.exports = folderStore;
