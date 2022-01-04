
var idUpdate;
//$.noConflict();

$(document).ready(function ($) {

    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblEmpData tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $(function () {
      
        $('.datetimepicker1').datetimepicker({
            format: 'MM/DD/YYYY',
            maxDate: $.now()
          
        });
        $('.datetimepicker1').addClass('notranslate');
        $('#tblEmpData').DataTable({ searching: false });
        $(".dataTables_empty").empty();
       
    });   

    LoadData();

    //first name validation
    $("#txtFname").change(function () {
        if ($("#txtFname").val() == '') { $('#lblErrorFname').text("Please enter First Name"); }
        else { $('#lblErrorFname').text("");}
    });
    //Last name validation
    $("#txtLname").change(function () {
        if ($("#txtLname").val() == '') { $('#lblErrorLname').text("Please enter Last Name"); }
        else { $('#lblErrorLname').text(""); }
    });


    //Image Validatiuon
    $('#fuProfileImg').change(
        function (e) {
            var files = e.originalEvent.target.files;
            for (var i = 0, len = files.length; i < len; i++) {
                const file = Math.round((files[i].size / 1024));
               
                if (files[i].type != 'image/jpg' || file>=200) {
                    if (files[i].type != 'image/jpeg' || file >= 200) {
                        if (files[i].type != 'image/png' || file >= 200) {
                            alert('please select only .jpg,.jpeg,.png files and size should be less than 200kb');
                            $('#fuProfileImg').val('');
                            return false;
                        }
                    }

                }
            }
        });
    //pan validation
    $("#txtPanNum").change(function () {
        ValidatePAN();
    });
    //passport validation
    $("#txtPassNum").change(function () {
        ValidatePassport();
    });

    //phone validation 
    $("#txtMobNum").change(function () {
        ValidatePhonenumber();
    });
    $("#txtDOB").on("dp.change", function () {
        ValidateDOB($(this).val());
    });

    //phone validation 
    $("#txtEmail").change(function () {
        ValidateEmail();
    });

    
    //get country
    $.ajax({
        type: "GET", url: "Country_Bind", dataType: "json", contentType: "application/json", success: function (res) {
            
            $('#ddlCountry').append('<option value="0">select</option>');
            $.each(res, function (index, value) {
                // APPEND OR INSERT DATA TO SELECT ELEMENT.
                $('#ddlCountry').append('<option value="' + value.Value + '">' + value.Text + '</option>');
            });
        }

    });
    //get employee
   

    // insert and Update employee
    $("#btnSave").on("click", function () {
        var nm = $("#btnSave").val();

        if (nm == 'Save') {
            var s1 = ValidateForm();
            var f1 = '';
            if (s1 > 0) {

                var fileUploads = $('#fuProfileImg').get(0).files;
                // Create  a FormData object
                var $fileData = new FormData();
                for (var i = 0; i < fileUploads.length; i++) {
                    $fileData.append(fileUploads[i].name, fileUploads[i]);

                }
                $.ajax({

                    url: 'UploadFile',
                    type: 'post',
                    datatype: 'json',
                    contentType: false,
                    processData: false,
                    async: false,
                    data: $fileData,
                    success: function (response) {
                        if (response != '') {
                            f1 = response;
                        }
                        else {
                            f1 = '';

                        }
                    }
                    ,
                    error: function (response) {
                        alert("Error Occurs!");
                    }
                });
                if (f1 != '') {
                    var gender = 0;
                    var active = 0;
                    if ($("#rdoMale").prop("checked")) { gender = 1; }
                    else if ($("#rdoFemale").prop("checked")) { gender = 2; }
                    if ($('#chkActive').prop('checked')) { active = 1; }

                    $.ajax(
                        {
                            type: "POST",
                            url: "AddEmployee",
                            data: { //Passing data  
                                FirstName: $("#txtFname").val(), //Reading text box values using Jquery
                                LastName: $("#txtLname").val(),
                                EmailAddress: $("#txtEmail").val()
                                , MobileNumber: $("#txtMobNum").val()
                                , PanNumber: $("#txtPanNum").val().toUpperCase()
                                , PassportNumber: $("#txtPassNum").val().toUpperCase()
                                , ProfileImage: f1
                                , Gender: gender
                                , IsActive: active
                                , DateOfBirth: $('#txtDOB').val()
                                , DateOfJoinee: $('#txtDOJ').val()
                                , CountryId: $("#ddlCountry option:selected").val()
                                , StateId: $("#ddlState option:selected").val()
                                , CityId: $("#ddlCity option:selected").val()


                            },
                            success: function (res) { $("#openEditor").modal('hide'); }

                        });
                    $("#openEditor").modal('hide');
                    LoadData();
                  
                }
                location.reload();
            }
            
        }
        else {
            var s1 = ValidateFormUpdate();
            if (s1 > 0) {

                    var gender = 0;
                    var active = 0;
                    if ($("#rdoMale").prop("checked")) { gender = 1; }
                    else if ($("#rdoFemale").prop("checked")) { gender = 2; }
                if ($('#chkActive').prop('checked')) { active = 1; } 

                    $.ajax(
                        {
                            type: "POST",
                            url: "UpdateEmployee",
                            data: { //Passing data  
                                Row_Id: idUpdate,
                                FirstName: $("#txtFname").val(), //Reading text box values using Jquery
                                LastName: $("#txtLname").val(),
                                EmailAddress: $("#txtEmail").val()
                                , MobileNumber: $("#txtMobNum").val()
                                , PanNumber: $("#txtPanNum").val()
                                , PassportNumber: $("#txtPassNum").val()                                
                                , Gender: gender
                                , IsActive: active
                                , DateOfBirth: $('#txtDOB').val()
                                , DateOfJoinee: $('#txtDOJ').val()
                                , CountryId: $("#ddlCountry option:selected").val()
                                , StateId: $("#ddlState option:selected").val()
                                , CityId: $("#ddlCity option:selected").val()


                            },
                            success: function (res) { $("#openEditor").modal('hide'); LoadData();}

                        });
                    $("#openEditor").modal('hide');
                LoadData();
         
                
            }
            location.reload();
        }
      


    });
    
    //OPEN MODALs
    $("#btnAdd").on("click", function () {
        ClearData();
        $("#btnSave").val('Save');
        var myModal = $("#openEditor");
        myModal.modal('show');
    });
    //edit data
    $("body").on("click", ".update", function () {
        ClearData();
        var myModal = $("#openEditor");

        // now get the values from the table
        idUpdate = $(this).closest('tr').find('td.Row_Id').html();
        var firstName = $(this).closest('tr').find('td.FirstName').html();
        var lastName = $(this).closest('tr').find('td.LastName').html();     
    
        var EmailAddress = $(this).closest('tr').find('td.EmailAddress').html();
        var MobileNumber = $(this).closest('tr').find('td.MobileNumber').html();
        var Countryid = $(this).closest('tr').find('td.CountryId').html();
        var Stateid = $(this).closest('tr').find('td.StateId').html();
        var Cityid = $(this).closest('tr').find('td.CityId').html();
        var PanNumber = $(this).closest('tr').find('td.PanNumber').html();
        var PassportNumber = $(this).closest('tr').find('td.PassportNumber').html();
        var Gender = $(this).closest('tr').find('td.Gender').html();
        var IsActive = $(this).closest('tr').find('td.IsActive').html();
        var ProfileImage = $(this).closest('tr').find('td.imgName').html();
        var DOB = $(this).closest('tr').find('td.DOB').html();
        var DOJ = $(this).closest('tr').find('td.DOJ').html();

            // and set them in the modal:
        $('#txtFname', myModal).val(firstName);
        $('#txtLname', myModal).val(lastName);
        $('#txtEmail', myModal).val(EmailAddress);
        $('#txtMobNum', myModal).val(MobileNumber);
        $('#txtPanNum', myModal).val(PanNumber);
        $('#txtPassNum', myModal).val(PassportNumber);
        var date2 = new Date(DOB);
        var date1 = new Date(DOJ);
        $('#txtDOB', myModal).val(DOB);
        $('#txtDOJ', myModal).val(DOJ);
        $('#fuProfileImg', myModal).val(ProfileImage);
        $("#ddlCountry").empty();
        $("#ddlState").empty();
        $("#ddlCity").empty();
        $.ajax({
            type: "GET", url: "Country_Bind", dataType: "json", contentType: "application/json", success: function (res) {

                $('#ddlCountry').append('<option value="0">select</option>');
                $.each(res, function (index, value) {
                    // APPEND OR INSERT DATA TO SELECT ELEMENT.
                    if (value.Value == Countryid) { $('#ddlCountry').append('<option value="' + value.Value + '" selected="selected">' + value.Text + '</option>'); }
                    else { $('#ddlCountry').append('<option value="' + value.Value + '">' + value.Text + '</option>'); }
                });
            }

        });
        $.ajax({
            type: "GET", url: "State_Bind", data: { 'country_id': Countryid }, dataType: "json", contentType: "application/json", success: function (res) {

                $('#ddlState').append('<option value="0">select</option>');
                $.each(res, function (index, value) {
                    // APPEND OR INSERT DATA TO SELECT ELEMENT.
                    if (value.Value == Stateid) { $('#ddlState').append('<option value="' + value.Value + '" selected="selected">' + value.Text + '</option>'); }
                    else {
                        $('#ddlState').append('<option value="' + value.Value + '">' + value.Text + '</option>');
                    }
                });
            }

        });
       
       
        $.ajax({
            type: "GET", url: "City_Bind", data: { 'state_id': Stateid }, dataType: "json", contentType: "application/json", success: function (res) {
                $('#ddlCity').append('<option value="0">select</option>');

                $.each(res, function (index, value) {
                    // APPEND OR INSERT DATA TO SELECT ELEMENT.
                    if (value.Value == Cityid) { $('#ddlCity').append('<option value="' + value.Value + '" selected="selected">' + value.Text + '</option>'); }
                    else { $('#ddlCity').append('<option value="' + value.Value + '">' + value.Text + '</option>'); }
                });
            }


        });
        
       
        if (Gender == 1) {
            $("#rdoMale").prop("checked", true);
            $("#rdoFemale").prop("checked", false);}
        else {
            $("#rdoFemale").prop("checked", true);
            $("#rdoMale").prop("checked", false);
        }
        if (IsActive == 'YES') {
            $('#chkActive').prop('checked', true);
        }
        else { $('#chkActive').prop('checked', false); }        
        

        $("#btnSave").val('Update');
        
       
        myModal.modal('show');

return false;
    });
    //delete data
    $("body").on("click", ".delete", function () {
        var myModal = $("#openEditor");

        var id = $(this).closest('tr').find('td.Row_Id').html();
        ConfirmtoDelete(id);
        location.reload();

    });


    //get state
    $("#ddlCountry").change(function () {
        var id = $(this).val();
        $("#ddlState").empty();
        $("#ddlCity").empty();
        $.ajax({
            type: "GET", url: "State_Bind", data: { 'country_id': id }, dataType: "json", contentType: "application/json", success: function (res) {

                $('#ddlState').append('<option value="0">select</option>');
                $.each(res, function (index, value) {
                    // APPEND OR INSERT DATA TO SELECT ELEMENT.
                    $('#ddlState').append('<option value="' + value.Value + '">' + value.Text + '</option>');
                });
            }

        });
    });
    
    $("#ddlState").change(function () {
        var id = $(this).val();
        $("#ddlCity").empty();
        $.ajax({
            type: "GET", url: "City_Bind", data: { 'state_id': id }, dataType: "json", contentType: "application/json", success: function (res) {
                $('#ddlCity').append('<option value="0">select</option>');

                $.each(res, function (index, value) {
                    // APPEND OR INSERT DATA TO SELECT ELEMENT.
                    $('#ddlCity').append('<option value="' + value.Value + '">' + value.Text + '</option>');
                });
            }
            

        });
    });


    
})

////get all employee data

function LoadData() {
    //get all employee data
    $('#tblEmpData tbody').empty();
    $.ajax({
        type: "GET", url: "Employee_Bind", dataType: "json", contentType: "application/json", success: function (res) {


            var picRoot = "../UploadedFiles/Employee/";
            var rows = "";
            $.each(res, function () {
                var s = picRoot + this.ProfileImage;
                rows += "<tr><td class='Row_Id'>" + this.Row_Id
                    + "</td><td class='FirstName'>" + this.FirstName
                    + "</td><td class='LastName'>" + this.LastName
                    + "</td><td class='EmailAddress'>" + this.EmailAddress
                    + "</td><td class='MobileNumber'>" + this.MobileNumber
                    + "</td><td class='DOB'>" + this.DateOfBirth
                    + "</td><td class='DOJ'>" + this.DateOfJoinee
                    + "</td><td class='CountryName'>" + this.CountryName
                    + "</td><td class='StateName'>" + this.StateName
                    + "</td><td class='CityName'>" + this.CityName
                    + "</td><td class='PanNumber'>" + this.PanNumber
                    + "</td><td class='PassportNumber'>" + this.PassportNumber
                    + "</td><td class='strGender'>" + this.strGender
                    + "</td><td class='IsActive'>" + this.strIsActive
                    + "</td><td class='ProfileImage'><img src='" + picRoot + this.ProfileImage + "' width='50' height='50'>"
                    + "</td>td class='imgName' style ='display:none;'>" + s
                    + "</td><td style ='display:none;' class='CountryId'>" + this.CountryId
                    + "</td><td style ='display:none;' class='StateId'>" + this.StateId
                    + "</td><td style ='display:none;' class='CityId'>" + this.CityId
                    + "</td><td style ='display:none;' class='Gender'>" + this.Gender
                    
                    + "</td><td><button type='button' class='update btn btn-warning btn-sm'><span class='glyphicon glyphicon-pencil'></span></button></td><td> <button type='button' class='delete btn btn-danger btn-sm'><span class='glyphicon glyphicon-trash'></span></button></td></tr>";

                
            });
            $(rows).appendTo("#tblEmpData tbody");
            
           

        }
        
    });
   
    
}

function Pagination() {
    $('#tblEmpData').after('<div id="nav"></div>');
    var rowsShown = 5;
    var rowsTotal = $('#tblEmpData tbody tr').length;
    var numPages = rowsTotal / rowsShown;
    for (i = 0; i < numPages; i++) {
        var pageNum = i + 1;
        $('#nav').append('<a href="#" rel="' + i + '">' + pageNum + '</a> ');
    }
    $('#tblEmpData tbody tr').hide();
    $('#tblEmpData tbody tr').slice(0, rowsShown).show();
    $('#nav a:first').addClass('active');
    $('#nav a').bind('click', function () {
        $('#nav a').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $('#tblEmpData tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
            css('display', 'table-row').animate({ opacity: 1 }, 300);
    });
}
//clearing data
function ClearData() {
    $("#txtFname").val('');
    $("#txtLname").val('');
    $("#txtEmail").val('');
    $("#txtMobNum").val('');
    $("#txtPanNum").val('');
    $("#txtPassNum").val('');
    $("#txtDOB").val('');
    $("#txtDOJ").val('');  
    $("#ddlCountry").val('');
    $("#ddlState").val('');
    $("#ddlCity").val(''); 
    
    

}




// VALIDATION FOR PAN number

function ValidatePAN() {
   
    var regex = /([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$/;
    //value is tested using a Regular Expression.
    if (regex.test($("#txtPanNum").val())) {
        
        var PAN = $("#txtPanNum").val();
        $.ajax({
            type: "POST",
            async: false,
            url: 'CheckPANAvailability',
            data: '{PAN: "' + PAN + '" }',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response == '0') {
                    alert('PAN Number "' + PAN + '" is available!');
                    $("#txtPanNum").val('');
                    $("#txtPanNum").focus();
                    return false;
                }
                else {
                    $('#lblErrorPAN').text("");
                    return true;

                }
            }
            ,
            error: function (response) {
                alert("Error Occurs!");
            }
        });
    }
    else {
       
        $('#lblErrorPAN').text("Enter proper PAN number");
        $("#txtPanNum").focus();

        return false;
    }
}

//validate passport
function ValidatePassport() {

    
    //value is tested using a Regular Expression.
    var regex = regsaid = /[a-zA-Z]{2}[0-9]{7}/;;
    //value is tested using a Regular Expression.
    if (regex.test($("#txtPassNum").val())) {

        var Passport = $("#txtPassNum").val();
        $.ajax({
            type: "POST",
            async: false,
            url: 'CheckPassportAvailability',
            data: '{Passport: "' + Passport + '" }',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response == '0') {
                    alert('Passport "' + Passport + '" is available!');
                    $("#txtPassNum").val('');
                    $("#txtPassNum").focus();
                    return false;
                }
                else {
                    $('#lblErrorPass').text("");
                    return true;

                }
            }
            ,
            error: function (response) {
                alert("Error Occurs!");
            }
        });
    }
    else {

        alert('Enter valid passport number');
        //$("#txtPassNum").val('');
        $('#lblErrorPass').text("Enter proper passbook number");
        $("#txtPassNum").focus();

        return false;
    }
}

//validation for mobile
function ValidatePhonenumber() {

    
    var phoneno = /^\d{10}$/;
        if (phoneno.test($("#txtMobNum").val())) 
        {
            var mobile = $("#txtMobNum").val();
            $.ajax({
                type: "POST",
                async: false,
                url: 'CheckMobileAvailability',
                data: '{mobile: "' + mobile + '" }',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    if (response == '0') {
                        alert('txtMobNum "' + mobile + '" is available!');
                        $("#txtMobNum").val('');
                        $("#txtMobNum").focus();
                        return false;
                    }
                    else {
                        $('#lblErrorMobile').text("");
                        return true;

                    }
                }
                ,
                error: function (response) {
                    alert("Error Occurs!");
                }
            });
    }
    else {
            alert("Enter proper mobile number");
            $('#lblErrorMobile').text("Enter proper mobile number");
            $("#txtMobNum").val('');
            $("#txtMobNum").focus();
        return false;
    }
}

//validation for email
function ValidateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($("#txtEmail").val())) {

            var emailId = $("#txtEmail").val();
            $.ajax({
                type: "POST",
                async: false,
                url: 'CheckEmailAvailability',
                data: '{emailId: "' + emailId + '" }',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (response) {
                    if (response =='0') {
                        alert('EmailID "' + emailId + '" is available!');
                        $("#txtEmail").val('');
                        $("#txtEmail").focus();
                        return false;
                    }
                    else {
                        $('#lblErrorEmail').text("");
                        return true;
                        
                    }
                }
                ,
                error: function (response) {
                    alert("Error Occurs!");
                }
            });
        

        
    }
    else {
        alert("You have entered an invalid email address!")
        $('#lblErrorEmail').text("Please Enter Proper Email");
        $("#txtEmail").val('');
        $("#txtEmail").focus();
        return false;
    }
}
//validation for empty
function ValidateForm() {

    if ($("#txtFname").val() == "") {
        $('#lblErrorFname').text("Please enter First Name");
        Swal.fire({ html: true,title:"Warning", html: "Please enter first name", confirmButtonText: "Close"}); $("#txtFname").focus(); return 0;  }
    else if ($("#txtLname").val() == "") {  $('#lblErrorLname').text("Please enter Last Name"); $("#txtLname").focus(); return 0; }
    else if ($("#txtEmail").val() == "") { $('#lblErrorEmail').text("Please Enter Email"); return 0; }
    else if ($("#txtMobNum").val() == "") {  $('#lblErrorMobile').text("Please Enter Mobile number");return 0; }
    else if ($("#txtPanNum").val() == "") { $('#lblErrorPAN').text('Please enter PAN number'); return 0; }
    else if ($("#txtPassNum").val() == "") { $('#lblErrorPass').text('Please enter Passport Number'); return 0; }
    else if ($("#txtDOB").val() == "") { alert('Please select date of birth'); return 0; }
    else if ($("#lblError").text() != "") { alert('Please select proper date of birth'); return 0; }
    else if ($("#txtDOJ").val() == "") { alert('Please enter date of joining'); return 0; }
    else if ($("#ddlCountry").val() == null) { alert('Please select Country'); return 0; }
    else if ($("#ddlCountry").val() == "0") { alert('Please select Country'); return 0; }
    else if ($("#ddlState").val() == null) { alert('Please select State'); return 0; }
    else if ($("#ddlState").val() == "0") { alert('Please select State'); return 0; }
    else if ($("#ddlCity").val() == null) { alert('Please select City'); return 0; }
    else if ($("#ddlCity").val() == "0") { alert('Please select City'); return 0; }
    else if (!$("#rdoMale").prop("checked") && !$("#rdoFemale").prop("checked")) {
        alert('Please select Gender'); return 0;
    }
    else if ($('#fuProfileImg').val() == "") { alert('Please select Profile image'); return 0; }
    
    else {
        $('#lblErrorFname').text("");
        $('#lblErrorLname').text("");
        $('#lblErrorEmail').text("");
        $('#lblErrorMobile').text("");
        $('#lblErrorPAN').text("");
        $('#lblErrorPass').text("");

        return 1;
    }
}

function ValidateFormUpdate() {

    if ($("#txtFname").val() == "") {
        $('#lblErrorFname').text("Please enter First Name");
        Swal.fire({ html: true, title: "Warning", html: "Please enter first name", confirmButtonText: "Close" }); $("#txtFname").focus(); return 0;
    }
    else if ($("#txtLname").val() == "") { $('#lblErrorLname').text("Please enter Last Name"); $("#txtLname").focus(); return 0; }
    else if ($("#txtEmail").val() == "") { $('#lblErrorEmail').text("Please Enter Email"); return 0; }
    else if ($("#txtMobNum").val() == "") { $('#lblErrorMobile').text("Please Enter Mobile number"); return 0; }
    else if ($("#txtPanNum").val() == "") { $('#lblErrorPAN').text('Please enter PAN number'); return 0; }
    else if ($("#txtPassNum").val() == "") { $('#lblErrorPass').text('Please enter Passport Number'); return 0; }
    else if ($("#txtDOB").val() == "") { alert('Please select date of birth'); return 0; }
    else if ($("#lblError").text() != "") { alert('Please select proper date of birth'); return 0; }
    else if ($("#txtDOJ").val() == "") { alert('Please enter date of joining'); return 0; }
    else if ($("#ddlCountry").val() == null) { alert('Please select Country'); return 0; }
    else if ($("#ddlCountry").val() == "0") { alert('Please select Country'); return 0; }
    else if ($("#ddlState").val() == null) { alert('Please select State'); return 0; }
    else if ($("#ddlState").val() == "0") { alert('Please select State'); return 0; }
    else if ($("#ddlCity").val() == null) { alert('Please select City'); return 0; }
    else if ($("#ddlCity").val() == "0") { alert('Please select City'); return 0; }
    else if (!$("#rdoMale").prop("checked") && !$("#rdoFemale").prop("checked")) {
        alert('Please select Gender'); return 0;
    }
    //else if ($('#fuProfileImg').val() == "") { alert('Please select Profile image'); return 0; }

    else {
        $('#lblErrorFname').text("");
        $('#lblErrorLname').text("");
        $('#lblErrorEmail').text("");
        $('#lblErrorMobile').text("");
        $('#lblErrorPAN').text("");
        $('#lblErrorPass').text("");

        return 1;
    }
}


function ConfirmtoDelete(ids) {
    if ($('#Deletebtn').is('[disabled]')) {
        alert("Already processing your same request, Please wait..");
        return false;
    }
    else {
        var r = confirm('Are you sure, you want to delete this Employee ?');
        if (r == true) {
            $('#Deletebtn').attr("disabled", "disabled");
            $.ajax(
                {
                    type: "POST",
                    url: "DeleteEmployee",
                    data: { //Passing data  
                        id: ids

                    },
                   
                    success: function (res) {
                        if (res=='1')
                            alert('Deleted successfully');
                        
                    }

                });
            
            return true;
            LoadData();
            
        }
        else {
            return false;
        }
    }
 
}

function ValidateDOB(dateString) {
    var lblError = $("#lblError");
    var parts = dateString.split("/");
    var dtDOB = new Date(parts[0] + "/" + parts[1] + "/" + parts[2]);
    var dtCurrent = new Date();
    lblError.html("Eligibility 18 years ONLY.");
    if (dtCurrent.getFullYear() - dtDOB.getFullYear() < 18) {
        return false;
    }

    if (dtCurrent.getFullYear() - dtDOB.getFullYear() == 18) {

        //CD: 11/06/2018 and DB: 15/07/2000. Will turned 18 on 15/07/2018.
        if (dtCurrent.getMonth() < dtDOB.getMonth()) {
            return false;
        }
        if (dtCurrent.getMonth() == dtDOB.getMonth()) {
            //CD: 11/06/2018 and DB: 15/06/2000. Will turned 18 on 15/06/2018.
            if (dtCurrent.getDate() < dtDOB.getDate()) {
                return false;
            }
        }
    }
    lblError.html("");
    return true;
}





