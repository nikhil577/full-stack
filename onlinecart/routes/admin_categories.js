var express=require('express');
var router=express.Router();
var auth=require('../config/auth');
var isAdmin=auth.isAdmin;

//get Category model
var Category=require('../models/category');

/*
 * get Category index
 */
router.get('/',isAdmin,function(req,res){
    Category.find(function(err,categories){
        if(err) {
            return console.log(err);
        }
        res.render('admin/categories',{
          categories:categories 
      });
   });
});

/*
 * get add  category
 */
router.get('/add-category',isAdmin,function(req,res){
    var title="";
    //var slug="";
   // var content="";
    
    res.render('admin/add_category',{
       title:title
       //slug:slug,
       //content:content
    });
});
/*
 * POST add Category
 */

router.post('/add-category',function(req,res){
    req.checkBody('title','Title is needed').isLength({min:1});
    var title = req.body.title;
    var slug = title.replace(' ','-').toLowerCase();
    var errors=req.validationErrors();
    if(errors){
        console.log(errors);
        res.render('admin/add_category',{
            errors: errors,
            title: title
        });
    }else{
        Category.findOne({slug:slug},function(err,category){
           if(category){
               req.flash('danger','category  exists,choose another');
               res.render('admin/add_category',{
                    title:title
                   
                });
           } else {
               var category=new Category({
                   title:title,
                   slug:slug
                   
               });
               category.save(function(err){
                   if(err) return console.log(err);
                   Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        req.app.locals.categories = categories;
    }
});
                   req.flash('success','category is added');
                   res.redirect('/admin/categories');
               });
           }
        });
    }  
});

/*
 * get edit  Category
 */
router.get('/edit-category/:id',isAdmin,function(req,res){
    Category.findById(req.params.id,function(err,category){
       if(err){
           return console.log(err);
       } 
       res.render('admin/edit_category',{
            title:category.title,
            id:category._id
        });
       
    });
    
    
});
/*
 * POST edit category
 */

router.post('/edit-category/:id',function(req,res){
    req.checkBody('title','tilte must have a value').isLength({min:1});
    var title = req.body.title;
    var slug = title.replace(' ','-').toLowerCase();
    var id=req.params.id;

    
    var errors=req.validationErrors();
    if(errors){
        console.log(errors);
        res.render('admin/edit_category',{
            errors: errors,
            title: title,
            id:id
        });
    }else{
        Category.findOne({slug:slug,_id:{'$ne':id}},function(err,category){
           if(category){
               req.flash('danger','category exists,choose another');
               res.render('admin/edit_category',{
                    title:title,
                    id:id
                });
           } else {
               Category.findById(id,function(err,category){
                  if(err){
                      console.log(err);
                  } 
                  category.title=title;
                  category.slug=slug;
                  category.save(function(err){
                        if(err) return console.log(err);
                        Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        req.app.locals.categories = categories;
    }
});
                        req.flash('success','category edited');
                        res.redirect('/admin/categories/edit-category/'+id);
                    });
                  
               });

           }
        });
    }  
});

/*
 * get delete Category
 */
router.get('/delete-category/:id',isAdmin,function(req,res){
   Category.findByIdAndRemove(req.params.id,function(err){
      if(err) 
          return console.log(err);
      Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        req.app.locals.categories = categories;
    }
});
      req.flash('success','category is deleted');
      res.redirect('/admin/categories/');
      
   });
});



//Exports
module.exports=router;