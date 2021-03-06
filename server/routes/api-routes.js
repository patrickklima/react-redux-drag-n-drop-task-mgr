const express = require('express');
const router = express.Router();
const {getBoardAndLists} = require('../services/get-data-service');
const {updateAnyDoc, moveCard} = require('../services/update-data-service');
const {createCard, createList, createBoard} = require('../services/create-data-service');

//Gets a full board by ID
router.get('/get/board/:id', (req, res, next) => {
  console.log("boards - received request")
  getBoardAndLists(req.params.id)
  .then(data => {
    console.log("Boards - sending data",data)
    res.json(data)})
  .catch(e => next(e));
});

//Updates any existing doc: card, list, or board
router.put('/put/:docType/:id', (req, res, next) => {
  const {docType, id} = req.params;
  const {data, boardId} = req.body;
  updateAnyDoc(docType, id, data, boardId)
  .then(response => {
    console.log(`update ${docType} - sending response`,response);
    return response;
  })
  .then(response => res.json(response))
  .catch(err => next(err));
});

//Creates a new card
router.post('/post/card', (req, res, next) => {
  const {cardTitle, listId, boardId} = req.body;
  createCard(cardTitle, listId, boardId)
  .then(() => getBoardAndLists(boardId))
  .then(board => res.json(board))
  .catch(err => next(err));
});

//Creates a new list
router.post('/post/list', (req, res, next) => {
  const {listTitle, boardId} = req.body;
  createList(listTitle, boardId)
  .then(() => getBoardAndLists(boardId))
  .then(board => res.json(board))
  .catch(err => next(err));
});

//Creates a new Board
router.post('/post/board', (req, res, next) => {
  const {boardTitle, userId} = req.body;
  createBoard(boardTitle, userId)
  .then(newBoard => getBoardAndLists(newBoard._id))
  .then(board => res.json(board))
  .catch(err => next(err));
});

//Moves a Card to a new List
router.put('/put/moveCard', (req, res, next) => {
  const {movingCardId, fromListId, toListId, boardId} = req.body;
  moveCard(movingCardId, fromListId, toListId, boardId)
  .then(updatedBoard => res.json(updatedBoard))
  .catch(err => next(err));
});

module.exports = router;