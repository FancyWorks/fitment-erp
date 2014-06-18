/**
 * Created by Ken on 2014-4-15.
 */

app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            redirectTo:'/mainboard'
        })
        .when('/mainboard', {
            templateUrl: './view/_mainboard.html',
            controller: 'mainboardController'
        })
        .when('/profile', {
            templateUrl: './view/_profile.html',
            controller: 'profileController'
        })
        .when('/work_task', {
            templateUrl: './view/_work_task.html',
            controller: 'workTaskController'
        })
        .otherwise({
            templateUrl: './view/_mainboard.html',
            controller: 'mainboardController'
        });
    //$locationProvider.html5Mode(true);
}]);


//move page-content a little bit down in case of tabs cover part of it
function SetPositionOfPageContent() {
    if('block' == $("#menu-toggler").css("display")) {
        $("#ngViewDiv").css("paddingTop","50px");
    }
    else {
        $("#ngViewDiv").css("paddingTop","0px");
    }
}

window.onresize = function() {
    SetPositionOfPageContent();
};

function OnViewLoad() {
    SetPositionOfPageContent();
    //处理菜单事件
//    ace.handle_side_menu(jQuery);
    preInit();
    //limitation of input
    $('.input-mask-price').keypress(function(event){
        var key = event.keyCode;
        if(key>=48 && key<=57) //0-9
            return true;
        if(key==46) { //[.] for float
            var val = $(this).val();
            if(val.length>0 && val.indexOf('.')==-1)
                return true;
        }
        return false;
    });
    //set related tab to active when refresh page with routing information
//    var routePath = window.location.hash;
//    if(routePath.length>0) {
//        $(".nav-list .active").removeClass('active');
//        $(".nav-list>li>a").each(function(){
//            if(routePath.indexOf($(this).attr("href"))==0) {
//                $(this).parent().addClass('active');
//            }
//        });
//    }

}

function preInit(){
//    $('[data-rel=tooltip]').tooltip({container:'body'});
//    $('[data-rel=popover]').popover({container:'body'});
//    $('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
//        $(this).prev().focus();
//    });
}

function wc(s){
    if(!s) return 0;
    var watchers = (s.$$watchers) ? s.$$watchers.length : 0;
    var child = s.$$childHead;
    while (child) {
        watchers += (child.$$watchers) ? child.$$watchers.length : 0;
//            console.log('next child',watchers);
        watchers += wc(child);
        child = child.$$nextSibling;
    }
//        console.log('watchers',watchers);
    return watchers;
}

app.controller("indexController", ['$rootScope','$scope','$mp_ajax','$cookieStore','$browser','$q',
    function($rootScope,$scope,$mp_ajax,$cookieStore,$browser,$q) {

    function promiseLoadCurUser() {
        var deferred = $q.defer();
        $mp_ajax.get("/user/getCurUser",function(data){
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    function promiseLoadCompany() {
        var deferred = $q.defer();
        $mp_ajax.get("/company/getCompany/"+$rootScope.curUser.cid,function(data){
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    promiseLoadCurUser().then(function(user){
        $rootScope.curUser = user;
        return promiseLoadCompany();
    }).then(function(company){
        $rootScope.curCompany = company;
    });

    var authToken = $cookieStore.get($mp_ajax.AUTH_NAME);
//    if(angular.isUndefined(authToken) || authToken=="") {
//        window.location.href = "login.html";
//    }

    $scope.tabs = [
        {url:"#/mainboard",name:"个人主页",class:"icon-home",active:true,open:false},
        {url:"javascript:;",name:"任务管理",class:"icon-list-alt",active:false,subTabStyle:{display:'none'},open:false,
            subTabs:[
                {url:"#/work_task",name:"任务列表",active:false},
                {url:"#/mainboard",name:"def",active:false}
            ]
        },
        {url:"javascript:;",name:"客户管理",class:"icon-list-alt",active:false,subTabStyle:{display:'none'},open:false,
            subTabs:[
                {url:"#/profile",name:"任务列表",active:false},
                {url:"#/mainboard",name:"def",active:false}
            ]
        },
        {url:"#",name:"资料管理",class:"icon-list-alt",active:false,open:false},
        {url:"#",name:"材料管理",class:"icon-list-alt",active:false,open:false}
    ];

    $scope.curTab = $scope.tabs[0];  //default value is first tab
    $scope.curParentTab = {};

    $scope.onTabClick = function(tab,parentTab) {
        if($scope.curTab==tab)
            return;
        //点击无子菜单的菜单
        if (angular.isUndefined(tab.subTabs)) {
            if (parentTab) {
                if ($scope.curParentTab != parentTab) {
                    $scope.curParentTab.active = false;
                    $scope.curParentTab.open = false;
                }
                parentTab.active = true;
                parentTab.open = true;
                $scope.curParentTab = parentTab;
            }
            else {
                $scope.curParentTab.active = false;
                $scope.curParentTab.open = false;
                $scope.curParentTab = {};
            }

            $scope.curTab.active = false;
            tab.active = true;
            $scope.curTab = tab;
        }
        else {
            tab.subTabStyle.display = tab.subTabStyle.display == 'none' ? 'block' : 'none';
        }
    };

    $scope.onLogout = function() {
        $cookieStore.put($mp_ajax.AUTH_NAME,'');
        window.location.href = "login.html";
    };

    $rootScope.bizId = $cookieStore.get('bizId');

    $scope.doClick = function () {
        var getBiz = $mp_ajax.get("/biz",function(data){
            console.log("ajax success");
            $scope.users = data;
        },function() {
            alert("ajax error");
        });
    };

    setTimeout(function(){
        console.log('watchers count = ',wc($scope));
    },2000);

    SetPositionOfPageContent();
}] );
