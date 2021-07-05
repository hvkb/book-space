

$("#rating-details").submit(function(event){
    alert("Data inserted successfully");
})

$("#update_rating").submit(function(event){
    event.preventDefault();
    var unindexed_array=$(this).serializeArray();

    var data = {}
    $.map(unindexed_array, function (n, i) { 
        data[n['name']] = n['value']
    })
    var arr={}
    
    arr['Book_Rating'] = data.rating;
    arr['User_ID']=data.User_ID;
    var request = {
        "url": `http://localhost:3000/api/update/${data._id}`, 
        "method": "PUT", 
        "data": arr 
    }
    $.ajax(request).done(function (response) { 
        alert("review Updated Successfully!");
    })


})

$("#update_user").submit(function (event) { 
    event.preventDefault(); 

    var unindexed_array = $(this).serializeArray(); 
    var data = {}

    $.map(unindexed_array, function (n, i) { 
        data[n['name']] = n['value']
    })


    var request = {
        "url": `http://localhost:3000/api/users/${data.id}`, 
        "method": "PUT", 
        "data": data 
    }

    $.ajax(request).done(function (response) { 
        alert("Data Updated Successfully!"); 
    })
})




if(window.location.pathname=="/landing"){
    // location.reload();
    
    $ondelete=$(".table tbody td a.delete");
    $ondelete.click(function(){
        var id=$(this).attr("data-id")
        var request = {
            "url": `http://localhost:3000/api/delete/${id}`, 
            "method": "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function (response) { 
                alert("Data Deleted Successfully!");
                location.reload();
        })
    }

    })
}


$('#signupAlert').hide();
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('error');
if(myParam == "User_Exists") {
    $('#signupAlert').show();
}


$('#loginAlert').hide();
if(myParam == "usernotfound") {
    $('#loginAlert').show();
}



$('#isbnalert').hide();
if(myParam == "invalid_isbn") {
    $('#isbnalert').show();
}

$('#alreadyratedalert').hide();
if(myParam == "rating_already_exists") {
    $('#alreadyratedalert').show();
}
