function coauthor(){
    name = document.getElementById('coauthor.name').value;
    console.log(name);
    $.ajax({
        // url: '/authors/',
        url: '/coauthor/'+name,
        type: 'GET',
        data: {
            name: name
        }
    }).done(function(response){
        document.getElementById('coauthor.name').value = name;
        document.getElementById("coauthor.json").innerHTML = JSON.stringify(response, undefined, 2);
    });

}

function detail(){
    title = document.getElementById('detail.title').value;
    console.log(title);
    $.ajax({
        // url: '/authors/',
        url: '/detail/'+title,
        type: 'GET',
        data: {
            title: title
        }
    }).done(function(response){
        document.getElementById('detail.title').value = title;
        document.getElementById("detail.json").innerHTML = JSON.stringify(response, undefined, 2);
    });
}

function paperlist(){
    name = document.getElementById('paperlist.name').value;
    console.log(name);
    $.ajax({
        // url: '/authors/',
        url: '/paperlist/'+name,
        type: 'GET',
        data: {
            name: name
        }
    }).done(function(response){
        document.getElementById('paperlist.name').value = name;
        document.getElementById("paperlist.json").innerHTML = JSON.stringify(response, undefined, 2);
    });
}

function keyword(){
    name = document.getElementById('keyword.name').value;
    console.log(name);
    $.ajax({
        // url: '/authors/',
        url: '/keyword/'+name,
        type: 'GET',
        data: {
            word: name
        }
    }).done(function(response){
        document.getElementById('keyword.name').value = name;
        document.getElementById("keyword.json").innerHTML = JSON.stringify(response, undefined, 2);
    });
}

function twoauthors(){
    name1 = document.getElementById('twoauthors.name1').value;
    name2 = document.getElementById('twoauthors.name2').value;
    console.log(name);
    $.ajax({
        // url: '/authors/',
        url: '/twoauthors/'+name1+'/'+name2,
        type: 'GET',
        data: {
            firstname: name1,
            secondname: name2
        }
    }).done(function(response){
        document.getElementById('twoauthors.name1').value = name1;
        document.getElementById('twoauthors.name2').value = name2;
        document.getElementById("twoauthors.json").innerHTML = JSON.stringify(response, undefined, 2);
    });
}