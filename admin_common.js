const admin = {

}
var timeoutSearch;
function setUserName(item) {
    $('#txtUsername').val(item);
    var array = item.split(",");
    getLogCoin(array[1]);
}


function fetchUser(username) {
    $('#account_search').html(`<img src="/assets/img/loader.gif" style="width: 16px;height: 16px;"/>`);
    clearTimeout(timeoutSearch);
    timeoutSearch = setTimeout(() => {
        var token = getToken()
    
        $.ajax({
            url: config.app.createRoute('search_account'),
            headers: {
                'Authorization': 'Bearer ' + token
            },
            type: "post",
            data:{
                username,
            },
            dateType: "json",
            success: function(response) {
                var html = response.map(function(item) {
                    return `<a  href="javascript:setUserName('${item.username},${item.id}')" style="padding: 5px;" >${item.username}</a>`
                }).join('');

                $('#account_search').html(html)
            }, 
            error: function (t){
                if(t.status == 401 || t.status == 401){
                    $("#txtCaptcha").val("")
                    $(".errors-register-form").css('color','red');
                    $(".errors-register-form").html('Không đủ quyền hạn!');
                    $(".errors-register-form").show();
                }
            }
        })
    }, 250);
}


function getLogCoin(id) {
    if (!checkLogin()) {
        return false;
    } else {

        var token = getToken();
        $.ajax({
            url: config.app.createRoute(`admin/log_card/list?userId=${id}`),
            headers: {
                'Authorization': 'Bearer ' + token
            },
            type: "get",
            dateType: "json",
            success: function success(response) {
                var html = response.map(function(item) {
                var dateFormat= new Date(item.create_at);
                var dateCv = dateFormat.getDate()+
                "/"+(dateFormat.getMonth()+1)+
                "/"+dateFormat.getFullYear()+
                " "+dateFormat.getHours()+
                ":"+dateFormat.getMinutes()+
                ":"+dateFormat.getSeconds();

                    return `<tr>
                    <td>${item.id}</td>
                    <td>${item.username}</td>
                    <td>${item.money}</td>
                    <td>${dateCv}</td>
                 </tr>`
                }).join('');
                $('#body_HisCoin').html(html)
            }
        });
    }
}

$( document ).ready(function() {
    $('#txtUsername').keyup(function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
           
        }
        if(e.target.value.length >= 3) {
            fetchUser(e.target.value);
        } else {
            $('#account_search').html(``);
        }
        
    });

    $("#changeInfodBtn").click(function (){
        var string = $("#txtUsername").val()
        var array = string.split(",");
        var token = getToken()
        var phoneNew = $("#infoPhone").val()
        var passNew = $("#infoNewPassword").val()
        var emailNew = $("#infoEmail").val()
        var data = {
            id: array [1],
            phone_number: phoneNew,
            password: passNew,
            email: emailNew,
        }
        $("#changeInfodBtn").attr('disabled', true)
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Authorization': 'Bearer ' + token
            },
            url: config.app.createRoute('admin/user/update'),
            type: "post",
            // dateType: "json",
            data,
            success: function(t) {
                reloadCaptcha();
                $(".errors-register-form").html(" ");
                $(".errors-register-form").hide();
                $('#usernameError').html(" ");
                $('#usernameError').css("display", "none");
                $(".errors-register-form").css('color','green');
                $(".errors-register-form").html(t);
                $(".errors-register-form").show();
                $('#emailError').css("display", "none");
                $('#createAccountForm').trigger("reset");
                $("#addCoinBtn").attr('disabled', false)
                // $("#create-account-error").html(t), "Đăng ký thành công!" == t && setTimeout(function() {
                //     window.location = "/"
                // }, 1e3), setbackgourndCaptcha("captchaImageReg")
            },
            error: function (t){
                reloadCaptcha();
                $("#addCoinBtn").attr('disabled', false)
                if(t.status == 422){
                    let errorMsg = "Vui lòng điền đúng thông tin!";
                    $("#txtCaptcha").val("")
                    $(".errors-register-form").css('color','red');
                    $(".errors-register-form").html(errorMsg);
                    $(".errors-register-form").show();
                }
                if(t.status == 401 || t.status == 401){
                    $("#txtCaptcha").val("")
                    $(".errors-register-form").css('color','red');
                    $(".errors-register-form").html('Không đủ quyền hạn!');
                    $(".errors-register-form").show();
                }


            }
        })
        // $(".errors-register-form").css('color', 'orange');
        // $(".errors-register-form").html('Đang xử lý, vui lòng đợi trong giây lát...<img src="/assets/img/loader.gif" style="width: 16px;height: 16px;"/>');
        // $(".errors-register-form").show(),
    });
    $("#addCoinBtn").click(function (){
        var token = getToken()
        var string = $("#txtUsername").val()
        var array = string.split(",");
        var data = {
            username: array[0],
            is_log: $('#txtIsLog').is(":checked"),
            coin: $("#txtCoin").val(),
        }
        $('#createAccountForm').trigger("reset");
        $("#addCoinBtn").attr('disabled', true)
        $(".errors-register-form").css('color', 'orange');
        $(".errors-register-form").html('Đang xử lý, vui lòng đợi trong giây lát...<img src="/assets/img/loader.gif" style="width: 16px;height: 16px;"/>');
        $(".errors-register-form").show(),
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                    'Authorization': 'Bearer ' + token
                },
                url: config.app.createRoute('add-coin'),
                type: "post",
                // dateType: "json",
                data,
                success: function(t) {
                    reloadCaptcha();
                    $(".errors-register-form").html(" ");
                    $(".errors-register-form").hide();
                    $('#usernameError').html(" ");
                    $('#usernameError').css("display", "none");
                    $(".errors-register-form").css('color','green');
                    $(".errors-register-form").html(t);
                    $(".errors-register-form").show();
                    $('#emailError').css("display", "none");
                    $('#createAccountForm').trigger("reset");
                    $("#addCoinBtn").attr('disabled', false)
                    // $("#create-account-error").html(t), "Đăng ký thành công!" == t && setTimeout(function() {
                    //     window.location = "/"
                    // }, 1e3), setbackgourndCaptcha("captchaImageReg")
                },
                error: function (t){
                    reloadCaptcha();
                    $("#addCoinBtn").attr('disabled', false)
                    if(t.status == 422){
                        let errorMsg = "Vui lòng điền đúng thông tin!";
                        $("#txtCaptcha").val("")
                        $(".errors-register-form").css('color','red');
                        $(".errors-register-form").html(errorMsg);
                        $(".errors-register-form").show();
                    }
                    if(t.status == 401 || t.status == 401){
                        $("#txtCaptcha").val("")
                        $(".errors-register-form").css('color','red');
                        $(".errors-register-form").html('Không đủ quyền hạn!');
                        $(".errors-register-form").show();
                    }


                }
            })
    });
})