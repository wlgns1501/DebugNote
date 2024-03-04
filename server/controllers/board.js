const db = require('../models');
const Board = require('../models/board');
const Comment = require('../models/comment');
const User = require('../models/user');
const Sequelize = require('sequelize');
const SequelModel = Sequelize.Sequelize;

module.exports = {
  post: async (req, res) => {
    // id: 게시글 PK
    const userId = req.userId;
    const { title, content } = req.body;
    const board = await Board.create({ title, content, UserId: userId });

    // const userId = await newComment.getUser({ attributes: ['id'] });

    res.status(200).json({
      board,
      boardId: board.id,
      message: '게시물을 추가하였습니다.',
    });
  },
  get: async (req, res) => {
    const boardId = req.params.id;

    const board = await Board.findOne({
      where: {
        id: boardId,
      },
      attributes: [
        'id',
        'title',
        'content',
        'createdAt',
        'userId',
        [SequelModel.col('User.nickname'), 'nickname'],
      ],
      include: [
        {
          model: User,
          attributes: [],
        },
        {
          model: Comment,
          attributes: [],
        },
      ],
    });

    if (!board) {
      res.status(404).json({ message: '해당 게시물이 존재하지 않습니다.' });
    }

    const comment = await Comment.findAll({
      where: { boardId: board.id },
      attributes: [
        'id',
        'comment',
        'createdAt',
        'userId',
        [SequelModel.col('User.nickname'), 'nickname'],
      ],

      include: [
        {
          model: User,
          attributes: [],
        },
      ],
    });

    const bookmark = await db.sequelize.models.Bookmark.findAll({
      where: {
        boardId: board.id,
      },
    });

    res.status(200).json({ board, comment, bookmark, message: 'success' });
  },
  put: async (req, res) => {
    const { id } = req.params; // 게시물의 id
    const { title, content } = req.body;

    const board = await Board.findOne({
      where: {
        id,
        UserId: req.userId,
      },
    });

    if (!board) {
      return res.status(400).json({ message: '유저가 일치하지 않습니다' });
    }

    const updateBoard = await Board.update(
      {
        title,
        content,
      },
      {
        where: {
          id,
          UserId: req.userId,
        },
      },
    );

    res
      .status(200)
      .json({ board: updateBoard, message: '댓글을 수정 했습니다.' });
  },
  remove: async (req, res) => {
    const { id } = req.params;

    const board = await Board.findOne({
      where: {
        id,
        UserId: req.userId,
      },
    });

    if (!board) {
      return res.status(400).json({ message: '유저가 일치하지 않습니다' });
    }

    await Board.destroy({
      where: {
        id,
        UserId: req.userId,
      },
    });

    return res.status(200).json({ message: '게시물을 삭제했습니다.' });
  },
  // 게시글 수정
  put: async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const findBoard = await Board.findByPk(id);

    if (findBoard.UserId != req.userId) {
      return res.status(400).json({ message: '유저가 일치하지 않습니다' });
    }

    if (!findBoard)
      return res
        .status(400)
        .json({ message: '해당 게시물이 존재하지 않습니다' });

    await Board.update(
      {
        title,
        content,
      },
      {
        where: {
          id,
        },
      },
    );

    res.status(200).json({ message: '게시물이 수정 되었습니다' });
  },
  // 게시글 삭제
  remove: async (req, res) => {
    const { id } = req.params;

    const findBoard = await Board.findByPk(id);

    if (findBoard.UserId != req.userId) {
      return res.status(400).json({ message: '유저가 일치하지 않습니다' });
    }

    if (!findBoard)
      return res
        .status(400)
        .json({ message: '해당 게시물이 존재하지 않습니다' });

    await Board.destroy({
      where: {
        id,
      },
    });

    res
      .status(200)
      .json({ comment: newComment, message: '댓글을 삭제했습니다.' });
  },
};
