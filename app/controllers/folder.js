'use strict';

const logger = require('../utils/logger');
const folderStore = require('../models/folder-store');
const uuid = require('uuid');
const accounts = require ('./accounts.js');

const folder = {
  
  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  
    const folderId = request.params.id;
    logger.debug('Folder id = ' + folderId);
    if (loggedInUser) {
    const viewData = {
      title: 'Folder',
      folder: folderStore.getFolder(folderId),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    response.render('folder', viewData);
    }
    else response.redirect('/');
},
    deleteGame(request, response) {
    const folderId = request.params.id;
    const gameId = request.params.gameid;
    logger.debug(`Deleting Game ${gameId} from Folder ${folderId}`);
    folderStore.removeGame(folderId, gameId);
    response.redirect('/folder/' + folderId);
  },
  addGame(request, response) {
    const folderId = request.params.id;
    const folder = folderStore.getFolder(folderId);
    const newGame = {
        id: uuid(),
      title: request.body.title,
      developer: request.body.developer,
      genre: request.body.genre,
    };
    folderStore.addGame(folderId, newGame);
    response.redirect('/folder/' + folderId);
  },
  updateGame(request, response) {
    const folderId = request.params.id;
    const gameId = request.params.gameid;
    logger.debug("updating game " + gameId);
    const updatedGame = {
      title: request.body.title,
      developer: request.body.developer,
      genre: request.body.genre,
      
    };
    folderStore.editGame(folderId, gameId, updatedGame);
    response.redirect('/folder/' + folderId);
  }
};

module.exports = folder;