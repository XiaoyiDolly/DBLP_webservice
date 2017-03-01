function spatialSearch(){
    var keywords = document.getElementById('keywords2').value;
    var yearFrom = document.getElementById('yearFrom').value;
    var yearTo = document.getElementById('yearTo').value;
    var skip = document.getElementById('skip2').value;
    var numReturn = document.getElementById('return2').value;
    console.log(keywords,skip,numReturn);
    $.ajax({
        url: '/spatialSearch/',
        type: 'GET',
        data: {
            'keywords':keywords,
            'yearFrom':yearFrom,
            'yearTo':yearTo,
            'skip':skip,
            'numReturn':numReturn
        }
    }).done(function(response){
        document.getElementById("spatialSearch.json").innerHTML = JSON.stringify(response, undefined, 2);
    });
}

function basicSearch(){
    var keywords = document.getElementById('keywords1').value;
    var skip = document.getElementById('skip1').value;
    var numReturn = document.getElementById('return1').value;
    console.log(keywords,skip,numReturn);
    $.ajax({
        // url: '/authors/',
        url: '/basicSearch/',
        type: 'GET',
        data: {
            'keywords':keywords,
            'skip':skip,
            'numReturn':numReturn
        }
    }).done(function(response){
        // document.getElementById('coauthor.name').value = name;
        document.getElementById("basicSearch.json").innerHTML = JSON.stringify(response, undefined, 2);
    });

}