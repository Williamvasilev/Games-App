'use strict';

// import all required modules
const logger = require('../utils/logger');
const folderStore = require('../models/folder-store.js');
const uuid = require('uuid');
const accounts = require ('./accounts.js');

// create dashboard object
const dashboard = {
  
  // index method - responsible for creating and rendering the view
  
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {
    const viewData = {
      title: 'Folder Dashboard',
      folders: folderStore.getUserFolders(loggedInUser.id),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    logger.info('about to render' + viewData.folders);
    response.render('dashboard', viewData);
    }
    else response.redirect('/');
  },
  
  deleteFolder(request, response) {
    const folderId = request.params.id;
    logger.debug(`Deleting Folder ${folderId}`);
    folderStore.removeFolder(folderId);
    response.redirect('/dashboard');
  },
   addFolder(request, response) {
    const date = new Date();
    const loggedInUser = accounts.getCurrentUser(request);
    const newFolder = {
      id: uuid(),
      userid: loggedInUser.id,
      title: request.body.title,
      picture: request.files.picture,
      date: date,
      games: []
    };
    logger.debug("Creating a new Folder" + newFolder);
    folderStore.addFolder(newFolder, function() {
      response.redirect("/dashboard");
    });
  }
};

// export the dashboard module
module.exports = dashboard;