for $x in doc("extracted.xml")/dblp/article
where $x/year>30
return $x