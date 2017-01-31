var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DBLP Web Service', message: 'DBLP Web Service' })
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

router.get('/authors', function(req, res) {
  var db = req.neo4j_db;
  
  db.cypherQuery("match (a:Author) return a limit 10 ",
    function(err, result){
      if(err) {
        res.status(500).json({
          errorMessage: err.message
        });
        return;
      };
      console.log(result.data)
      res.send(result.data);
      // res.render('result', { result: JSON.parse(result.data)});
    });    
});

router.get('/coauthor/:name', function(req, res) {
  var db = req.neo4j_db,
      name = req.params.name;//.replace(' ','%20')
  
  db.cypherQuery("match (a:Author{name:'"+name+"'})-[]->()-[]-(b:Author) return distinct(b)",
    function(err, result){
      console.log(result.data);
      if(err) {
        res.status(500).json({
          errorMessage: err.message
        });
        return;
      };
      
      res.send(result.data);
    });    
});

router.get('/detail/:title', function(req, res) {
  var db = req.neo4j_db,
      title = req.params.title;
  
  db.cypherQuery("match (p:Paper{title:'"+title+"'}) return p",
    function(err, result){
      console.log(result.data);
      if(err) {
        res.status(500).json({
          errorMessage: err.message
        });
        return;
      };
      
      res.send(result.data);
      
    });    
});

router.get('/paperlist/:name', function(req, res) {
  var db = req.neo4j_db,
      name = req.params.name;//.replace(' ','%20')
  
  db.cypherQuery("match (a:Author{name:'"+name+"'})-[]-(p:Paper) return p",
    function(err, result){
      console.log(result.data);
      if(err) {
        res.status(500).json({
          errorMessage: err.message
        });
        return;
      };
      
      res.send(result.data);
      
    });    
});

router.get('/keyword/:word', function(req, res) {
  var db = req.neo4j_db,
      name = req.params.word;//.replace(' ','%20')
  
  db.cypherQuery("match (p:Paper) where p.title=~'.*"+name+"*.' return p.title",
    function(err, result){
      console.log(result.data);
      if(err) {
        res.status(500).json({
          errorMessage: err.message
        });
        return;
      };
      
      res.send(result.data);
    });    
});

router.get('/twoauthors/:firstname/:secondname', function(req, res) {
  var db = req.neo4j_db,
      firstname = req.params.firstname,
      secondname = req.params.secondname;//.replace(' ','%20')
  
  db.cypherQuery("match r=((a:Author{name:'"+firstname+"'})-[]-(p:Paper)-[]-(b:Author{name:'"+secondname+"'})) return p.title",
    function(err, result){
      console.log(result.data);
      if(err) {
        res.status(500).json({
          errorMessage: err.message
        });
        return;
      };
      
      res.send(result.data);
    });    
});

module.exports = router;
