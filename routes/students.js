const express = require('express');
const router = express.Router();

// bring in article model
let Student = require('../models/student');
// user model
let User = require('../models/user');

//add route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});

// add submit POST route
router.post('/add', function(req,res){
  req.checkBody('title', 'Title is required').notEmpty();
  //req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title: 'Add Article',
      errors:errors
    });
  } else {
    let student = new Student();
    student.title = req.body.title;
    student.author = req.user._id;
    student.body = req.body.body;

    student.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Article Added');
        res.redirect('/');
      }
    });
  }
});

//load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Student.findById(req.params.id, function(err, student){
    if(student.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title: 'Edit Article',
      student:student
    });
  });
});

// update submit POST route
router.post('/edit/:id', function(req,res){
  let student = {};
  student.title = req.body.title;
  student.author = req.body.author;
  student.body = req.body.body;

  let query = {_id:req.params.id}

  Student.update(query, student, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'article updated')
      res.redirect('/');
    }
  });
});

// delete article
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Student.findById(req.params.id, function(err, student){
    if(student.author != req.user._id){
      res.status(500).send();
    } else {
      Student.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

//get single articles
router.get('/:id', function(req, res){
  Student.findById(req.params.id, function(err, student){
    User.findById(student.author, function(err, user){
      res.render('article', {
        student: student,
        author: user.name
      });
    });
  });
});

// access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
