var express=require('express');
var router=express.Router();
var auth=require('../config/auth');
var isAdmin=auth.isAdmin;
//get page model
var Page=require('../models/page');

/*
 * get pages index
 */
router.get('/',isAdmin,function(req,res){
   Page.find({}).sort({sorting: 1}).exec(function(err,pages){
      res.render('admin/pages',{
         pages:pages 
      });
   });
});
/*
 * get add  page
 */
router.get('/add-page',isAdmin,function(req,res){
    var title="";
    var slug="";
    var content="";
    
    res.render('admin/add_page',{
       title:title,
       slug:slug,
       content:content
    });
});
/*
 * POST add page
 */

router.post('/add-page',function(req,res){
    req.checkBody('title','title is needed').isLength({min:1});
    req.checkBody('content','Content is needed?').isLength({min:1});
    var title = req.body.title;
    var content = req.body.content;
    var slug = req.body.slug.replace(' ','-').toLowerCase();
    if(slug === "") slug=title.replace(' ','-').toLowerCase();
    var errors=req.validationErrors();
    if(errors){
        console.log(errors);
        res.render('admin/add_page',{
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    }else{
        Page.findOne({slug:slug},function(err,page){
           if(page){
               req.flash('danger','page slug exists,choose another');
               res.render('admin/add_page',{
                    title:title,
                    slug:slug,
                    content:content
                });
           } else {
               var page=new Page({
                   title:title,
                   slug:slug,
                   content:content,
                   sorting:100
               });
               page.save(function(err){
                   if(err) return console.log(err);
                   Page.find({}).sort({sorting: 1}).exec(function(err,pages){
                      if(err) {
                        console.log(err);
                        }else{
                           req.app.locals.pages=pages;
                        }
                   });
                   
                   
                   req.flash('success','page is added');
                   res.redirect('/admin/pages');
               });
           }
        });
    }  
});

//Sort Pages Function

function sortPages(ids, callback) {
    var count = 0;

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;

        (function (count) {
            Page.findById(id, function (err, page) {
                page.sorting = count;
                page.save(function (err) {
                    if (err)
                        return console.log(err);
                    ++count;
                    if (count >= ids.length) {
                        callback();
                    }
                });
            });
        })(count);

    }
}
/*
 * post reorder pages
 */
router.post('/reorder-pages',function(req,res){
  //console.log(req.body);
    var ids=req.body['id[]'];
    sortPages(ids,function(){
        Page.find({}).sort({sorting: 1}).exec(function(err,pages){
            if(err) {
               console.log(err);
            }else{
                  req.app.locals.pages=pages;
            }
       });
    
        
    });
 
    
});
/*
 * get edit  page
 */
router.get('/edit-page/:id',isAdmin,function(req,res){
    Page.findById(req.params.id,function(err,page){
       if(err){
           return console.log(err);
       } 
       res.render('admin/edit_page',{
            title:page.title,
            slug:page.slug,
            content:page.content,
            id:page._id
        });
       
    });
    
    
});
/*
 * POST edit page
 */

router.post('/edit-page/:id',function(req,res){
    req.checkBody('title','tilte must have a value').isLength({min:1});
    req.checkBody('content','Content must have a value').isLength({min:1});
    var title = req.body.title;
    var content = req.body.content;
    var slug = req.body.slug.replace(' ','-').toLowerCase();
    if(slug === "") slug=title.replace(' ','-').toLowerCase();
    var content=req.body.content;
    var id=req.params.id;

    
    var errors=req.validationErrors();
    if(errors){
        console.log(errors);
        res.render('admin/edit_page',{
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id:id
        });
    }else{
        Page.findOne({slug:slug,_id:{'$ne':id}},function(err,page){
           if(page){
               req.flash('danger','page slug exists,choose another');
               res.render('admin/edit_page',{
                    title:title,
                    slug:slug,
                    content:content,
                    id:id
                });
           } else {
               Page.findById(id,function(err,page){
                  if(err){
                      console.log(err);
                  } 
                  page.title=title;
                  page.slug=slug;
                  page.content=content;
                  page.save(function(err){
                        if(err) return console.log(err);
                        Page.find({}).sort({sorting: 1}).exec(function(err,pages){
                      if(err) {
                        console.log(err);
                        }else{
                           req.app.locals.pages=pages;
                        }
                   });
                        req.flash('success','page is added');
                        res.redirect('/admin/pages/edit-page/'+id);
                    });
                  
               });

           }
        });
    }  
});

/*
 * get delete page
 */
router.get('/delete-page/:id',isAdmin,function(req,res){
   Page.findByIdAndRemove(req.params.id,function(err){
      if(err) 
          return console.log(err);
      Page.find({}).sort({sorting: 1}).exec(function(err,pages){
                      if(err) {
                        console.log(err);
                        }else{
                           req.app.locals.pages=pages;
                        }
                   });
      req.flash('success','page is deleted');
      res.redirect('/admin/pages/');
      
   });
});



//Exports
module.exports=router;