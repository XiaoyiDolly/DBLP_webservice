var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'DBLP Web Service', message: 'DBLP Web Service' });
  res.render('search', {  title: 'DBLP Query', message: 'Query in DBLP'});
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


//localhost:3001/ spatialSearch?keywords="services computing" & yearFrom=2010& yearTo=2012 &skip=10 & numReturn =20
router.get('/spatialSearch', function(req, res, next) {
  var db = req.neo4j_db,
      keywords = req.query.keywords,
      skip = req.query.skip,
      numReturn = req.query.numReturn,
      yearTo = req.query.yearTo,
      yearFrom = req.query.yearFrom;

  var lucene_query = convertKeywords(keywords);
  var query = "START paper=node:text(\""+lucene_query+"\")\
    MATCH (paper:Paper)\
    where paper.year>\""+yearFrom+"\" and paper.year<\""+yearTo+"\"\
    RETURN paper\
    skip "+skip+" limit "+ numReturn;
  console.log(query);
  db.cypherQuery(query,
    function(err, result){
      console.log(result.data);
      
      if(err) {
        res.status(500).json({
          errorMessage: err.message
        });
        // return;
      };
      res.send(result.data);
  
    });
  
});

function convertKeywords(keywords){
  var str = keywords.split(" ");
  var query = "";
  for (i = 0;i<str.length;i++){
    if (i==0){
      query += "title:"+str[i];
      console.log(str[i]);
      continue;
    } 
    query+=" OR title:"+str[i];
  }
  console.log(query);
  return query;
}

//localhost:3001/ basicSearch?keywords="services computing" &skip=10& numReturn=20
router.get('/basicSearch', function(req, res, next) {
  var db = req.neo4j_db,
      keywords = req.query.keywords,
      skip = req.query.skip,
      numReturn = req.query.numReturn;
  console.log(skip,numReturn,keywords);
  var lucene_query = convertKeywords(keywords);
  var query = "START paper=node:text(\""+lucene_query+"\")\
    MATCH (paper:Paper)\
    RETURN paper\
    skip "+skip+" limit "+ numReturn;
  console.log(query);
  db.cypherQuery(query,
    function(err, result){
      console.log(result.data);
      
      if(err) {
        res.status(500).json({
          errorMessage: err.message
        });
        // return;
      };
      res.send(result.data);
  // res.render('search', { title: 'DBLP Query', message: 'Query in DBLP',result:result.data })
    });
});

module.exports = router;
