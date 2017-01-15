angular.module('topper.sesssionBL',[])

.factory('SessionBL', function(
    $state,
    $localStorage,
    $sessionStorage,
    $cordovaNetwork,
    $cordovaToast,
    Http,
    Util
) {

    function checkLoginData(oData) {
        if (!oData.email) {
            Util.message('Invalid email data.');
            return false;
        }

        if (!oData.password) {
            Util.message('Invalid password data.');
            return false;
        }

        return true;
    }

    function successHttpLogin(aSuccess) {
        if (aSuccess['msg'] === 'wrong email') {
            Util.message('Email doesn\'t exist.');
            return false;
        }

        if (aSuccess['msg'] === 'wrong password') {
            Util.message('Password mismatch.');
            return false;
        }

        if (aSuccess['msg'] === 'login success') {
            alert('Log in successfully.');
            
            return true;
        }
    }

    function doLogin(oData) {
        var bRes = checkLoginData(oData);

        if (bRes === true) {
            // if (window.cordova && $cordovaNetwork.isOnline() === true) {
                Http.post('api/user/login', oData).then(successHttpLogin);
            // } else {
            // }
        }
    }

    return {
        login : doLogin
    }
})