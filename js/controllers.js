
angular.module('your_app_name.controllers', [])

        .controller('AuthCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            if ($rootScope.userLogged == 0)
                $state.go('auth.login');
        })

// APP
        .controller('AppCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            if ($rootScope.userLogged == 0)
                $state.go('auth.login');
        })

//LOGIN
        .controller('LoginCtrl', function ($scope, $state, $templateCache, $q, $rootScope) {
            $scope.doLogIn = function () {
                var data = new FormData(jQuery("#loginuser")[0]);
                $.ajax({
                    type: 'POST',
                    url: domain + "chk-dr-user",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        //console.log(response);
                        if (angular.isObject(response)) {
                            $scope.loginError = '';
                            $scope.loginError.digest;
                            store(response);
                            $rootScope.userLogged = 1;
                            //if ($rootScope.url != '') {
                            if (window.localStorage.getItem('url') != null) {
                                $state.go(window.localStorage.getItem('url'));
                            } else {
                                $state.go('app.doctor-consultations');
                            }
                        } else {
                            $rootScope.userLogged = 0;
                            $scope.loginError = response;
                            $scope.loginError.digest;
                            //alert(response);
                        }
                        $rootScope.$digest;
                    },
                    error: function (e) {
                        console.log(e.responseText);
                    }
                });
            };
            $scope.user = {};
            $scope.user.email = "";
            $scope.user.pin = "";
            // We need this for the form validation
            $scope.selected_tab = "";
            $scope.$on('my-tabs-changed', function (event, data) {
                $scope.selected_tab = data.title;
            });
        })
        .controller('LogoutCtrl', function ($scope, $state, $templateCache, $q, $rootScope) {
            localStorage.clear();
            $rootScope.userLogged = 0;
            $rootScope.$digest;
            $state.go('auth.walkthrough');
            //window.location.href = "#/";
        })
        .controller('SignupCtrl', function ($scope, $state, $http, $rootScope) {
            $scope.user = {};
            $scope.doSignUp = function () {
                var data = new FormData(jQuery("#signup")[0]);
                $.ajax({
                    type: 'POST',
                    url: domain + "/dr-register",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        //console.log(response);
                        if (angular.isObject(response)) {
                            store(response);
                            $rootScope.userLogged = 1;
                            //if ($rootScope.url != '') {
                            if (window.localStorage.getItem('url') != null) {
                                $state.go(window.localStorage.getItem('url'));
                            } else {
                                $state.go('app.category-list');
                            }
                        } else {
                            alert('Please fill all the details for signup');
                        }
                        $rootScope.$digest;
                    },
                    error: function (e) {
                        console.log(e.responseText);
                    }
                });
            };
            //Check if email is already registered
            $scope.checkEmail = function (email) {
                $http({
                    method: 'GET',
                    url: domain + 'check-user-email',
                    params: {userEmail: email}
                }).then(function successCallback(response) {
                    if (response.data > 0) {
                        $scope.user.email = '';
                        $scope.emailError = "This email-id is already registered!";
                        $scope.emailError.digest;
                        //alert("This email-id already registered");
                    } else {
                        $scope.emailError = "";
                        $scope.emailError.digest;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('ForgotPasswordCtrl', function ($scope, $state) {
            $scope.recoverPassword = function () {
                $state.go('app.feeds-categories');
            };

            $scope.user = {};
        })

        .controller('RateApp', function ($scope) {
            $scope.rateApp = function () {
                if (ionic.Platform.isIOS()) {
                    //you need to set your own ios app id
                    AppRate.preferences.storeAppURL.ios = '1234555553>';
                    AppRate.promptForRating(true);
                } else if (ionic.Platform.isAndroid()) {
                    //you need to set your own android app id
                    AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
                    AppRate.promptForRating(true);
                }
            };
        })

        .controller('SendMailCtrl', function ($scope) {
            $scope.sendMail = function () {
                cordova.plugins.email.isAvailable(
                        function (isAvailable) {
                            // alert('Service is not available') unless isAvailable;
                            cordova.plugins.email.open({
                                to: 'envato@startapplabs.com',
                                cc: 'hello@startapplabs.com',
                                // bcc:     ['john@doe.com', 'jane@doe.com'],
                                subject: 'Greetings',
                                body: 'How are you? Nice greetings from IonFullApp'
                            });
                        }
                );
            };
        })

        .controller('MapsCtrl', function ($scope, $ionicLoading) {
            $scope.info_position = {
                lat: 43.07493,
                lng: -89.381388
            };
            $scope.center_position = {
                lat: 43.07493,
                lng: -89.381388
            };
            $scope.my_location = "";
            $scope.$on('mapInitialized', function (event, map) {
                $scope.map = map;
            });
            $scope.centerOnMe = function () {
                $scope.positions = [];
                $ionicLoading.show({
                    template: 'Loading...'
                });
                // with this function you can get the user’s current position
                // we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $scope.current_position = {lat: pos.G, lng: pos.K};
                    $scope.my_location = pos.G + ", " + pos.K;
                    $scope.map.setCenter(pos);
                    $ionicLoading.hide();
                });
            };
        })

        .controller('AdsCtrl', function ($scope, $http, $state, $ionicActionSheet, AdMob, iAd) {
            //$scope.cats = [];
            $scope.manageAdMob = function () {
                $http({
                    method: 'GET',
                    url: domain + 'records/get-record-categories',
                    params: {userId: $scope.userid}
                }).then(function successCallback(response) {
                    $scope.cats = [];
                    console.log(response);
                    //$scope.categories = response.data; 
                    angular.forEach(response.data, function (value, key) {
                        console.log(value.category);
                        $scope.cats.push({text: value.category, id: value.id});
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
                console.log($scope.cats);
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    //Here you can add some more buttons                    
                    buttons:
                            $scope.cats
                    ,
                    //destructiveText: 'Remove Ads',
                    titleText: 'Select the Category',
                    cancelText: 'Cancel',
                    cancel: function () {
                        // add cancel code..
                    },
                    destructiveButtonClicked: function () {
                        console.log("removing ads");
                        AdMob.removeAds();
                        return true;
                    },
                    buttonClicked: function (index, button) {
                        console.log(button.id);
                        AdMob.showBanner(button.id);
                        //window.location.href = "http://192.168.2.169:8100/#/app/add-category/" + button.id;
                        $state.go('app.add-category', {'id': button.id});
                        return true;
                    }
                });
            };
            $scope.manageiAd = function () {
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    //Here you can add some more buttons
                    buttons: [
                        {text: 'Allergies'},
                        {text: 'Bills'},
                        {text: 'Test Results'},
                        {text: 'Medication'},
                        {text: 'Packaging'},
                        {text: 'Test Results'},
                        {text: 'Bills'},
                        {text: 'Medication'},
                        {text: 'Test Results'},
                        {text: 'Packaging'}
                    ],
                    destructiveText: 'Remove Ads',
                    titleText: 'Choose the ad to show - Interstitial only works in iPad',
                    cancelText: 'Cancel',
                    cancel: function () {
                        // add cancel code..
                    },
                    destructiveButtonClicked: function () {
                        console.log("removing ads");
                        iAd.removeAds();
                        return true;
                    },
                    buttonClicked: function (index, button) {
                        if (button.text == 'Show iAd Banner')
                        {
                            console.log("show iAd banner");
                            iAd.showBanner();
                        }
                        if (button.text == 'Show iAd Interstitial')
                        {
                            console.log("show iAd interstitial");
                            iAd.showInterstitial();
                        }
                        return true;
                    }
                });
            };
        })

// FEED
//brings all feed categories
        .controller('FeedsCategoriesCtrl', function ($scope, $http) {
            $scope.feeds_categories = [];

            $http.get('feeds-categories.json').success(function (response) {
                $scope.feeds_categories = response;
            });
        })

//bring specific category providers
        .controller('CategoryFeedsCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];

            $scope.categoryId = $stateParams.categoryId;

            $http.get('feeds-categories.json').success(function (response) {
                var category = _.find(response, {id: $scope.categoryId});
                $scope.categoryTitle = category.title;
                $scope.category_sources = category.feed_sources;
            });
        })


//bring specific category providers
        .controller('CategoryListCtrl', function ($scope, $http, $stateParams, $rootScope) {
            if (get('id') != null)
                ;
            $rootScope.userLogged = 1;
            console.log($rootScope.userLogged);
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('CategoryDetailCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
            //console.log(get('id'));
            $scope.userid = get('id');
            $http({
                method: 'GET',
                url: domain + 'records/view-patient-record-category',
                params: {userId: $scope.userid}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.categories = response.data.categories;
                $scope.userRecords = response.data.recordCount;
            }, function errorCallback(response) {
                console.log(response);
            });
        })

        .controller('AddRecordCtrl', function ($scope, $http, $state, $stateParams, $sce, $compile) {
            $scope.userId = get('id');
            $scope.categoryId = $stateParams.id;
            $scope.fields = [];
            $http({
                method: 'GET',
                url: domain + 'records/add',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.fields = response.data;
                //angular.forEach(response.data, function (value, key) {
                //    $scope.fields.push($sce.trustAsHtml(createElement(value)));
                //});
                $scope.category = $stateParams.id;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.addNewElement = function (ele) {
                console.log('text' + ele);
                addNew(ele);
            };
            $scope.submit = function () {
                var data = new FormData(jQuery("#addrecords")[0]);
                callAjax("POST", domain + "records/save", data, function (response) {
                    console.log(response);
                    if (angular.isObject(response)) {
                        $state.go('app.viewRecords', {'id': $scope.categoryId});
                        //window.location.href = "http://192.168.2.169:8100/#/app/records-view/" + $scope.categoryId;
                    }
                });

            };

        })
        .controller('EditRecordCtrl', function ($scope, $http, $state, $stateParams, $sce) {
            $scope.fields = [];
            $http({
                method: 'GET',
                url: domain + 'records/add',
                params: {id: $stateParams.cat}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.fields.push($sce.trustAsHtml("<input type='hidden' ng-model='record.recordId' value='" + $stateParams.id + "' name='recordId' /><input type='hidden' ng-model='record.recordCat' value='" + $stateParams.cat + "' name='recordCat' />"));
                angular.forEach(response.data, function (value, key) {
                    $scope.fields.push($sce.trustAsHtml(createElement(value)));
                });
                //var modelname = '';
                $http({
                    method: "GET",
                    url: domain + "records/get-record-value",
                    params: {id: $stateParams.id}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    angular.forEach(response.data, function (value, key) {
                        console.log(value.field_id + ' : ' + value.value + '-------' + key);
                        modelname = value.field_id;
                        if (!$scope.$$phase) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    //wrapped this within $apply
                                    $scope.modelname = value.value;
                                    console.log('message:' + $scope.modelname);
                                });
                            }, 0);
                        }
                    });
                }, function errorCallback(e) {
                    console.log(e.responseText);
                });
                //console.log($scope.fields);
            }, function errorCallback(response) {
                console.log(response);
            });
        })


        .controller('RecordsViewCtrl', function ($scope, $http, $stateParams) {
            $scope.record = {recordId: ''};
            $scope.record.ids = [];
            $scope.limit = 4;
            $scope.userId = get('id');
            $http({
                method: 'POST',
                url: domain + 'records/get-records-details',
                params: {id: $stateParams.id, userId: $scope.userId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.records = response.data;
                //$ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });

        })
        .controller('RecordDetailsCtrl', function ($scope, $http, $state, $stateParams) {
            $scope.recordId = $stateParams.id;
            $http({
                method: 'POST',
                url: domain + 'records/get-record-details',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                console.log(response);
                $scope.recordDetails = response.data.recordsDetails;
                $scope.category = response.data.record;
                //$ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            //DELETE Modal
            $scope.delete = function (id) {
                console.log(id);
                //$ionicLoading.show({ template: 'Loading...' });
                $http({
                    method: 'POST',
                    url: domain + 'records/delete',
                    params: {id: id}
                }).then(function successCallback(response) {
                    //$ionicLoading.hide();
                    console.log(response);
                    $state.go('app.category-detail');
                }, function errorCallback(e) {
                    console.log(e);
                });
            };
            //EDIT Modal
            $scope.edit = function (id, cat) {
                $state.go('app.edit-record', {'id': id, 'cat': cat});
                //window.location.href = "http://192.168.2.169:8100/#/app/edit-record/" + id + "/" + cat;
            };
        })
        .controller('ConsultationsListCtrl', function ($scope, $http, $stateParams) {
            $scope.specializations = {};
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'doctors/consultations',
                params: {userId: $scope.userId}
            }).then(function successCallback(response) {
                //$ionicLoading.hide();
                console.log(response.data);
                $scope.specializations = response.data.spec;
                $scope.video_app = response.data.video_app;
                $scope.doctorsData = response.data.doctorsData;
                $scope.products = response.data.products;
                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });
        })
        .controller('ConsultationCardsCtrl', function ($scope, $http, $stateParams) {
            $scope.specId = $stateParams.id;
            $scope.services = $stateParams.id;
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'doctors/list',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                //$ionicLoading.hide();
                console.log(response);
                $scope.doctors = response.data;
                angular.forEach($scope.doctors, function (value, key) {
                    //console.log(value.id);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctor-services',
                        params: {id: value.id}
                    }).then(function successCallback(responseData) {
                        console.log(responseData.data);
                        //$ionicLoading.hide();
                        $scope.services[key] = responseData.data;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                    console.log($scope.services);
                });
                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('ConsultationProfileCtrl', function ($scope, $http, $state, $stateParams, $rootScope) {
            $scope.vSch = [];
            $scope.schV = [];
            $scope.cSch = [];
            $scope.schC = [];
            $scope.hSch = [];
            $scope.schH = [];
            $scope.bookingSlot = '';
            $scope.supId = '';
            $scope.schdate = new Date('YYYY-MM-DD');
            $http({
                method: 'GET',
                url: domain + 'doctors/get-details',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.doctor = response.data.user;
                $scope.videoProd = response.data.video_product;
                $scope.videoInc = response.data.video_inclusions;
                $scope.videoSch = response.data.videoSch;
                $scope.chatProd = response.data.chat_product;
                $scope.chatInc = response.data.chat_inclusions;
                $scope.homeProd = response.data.home_product;
                $scope.homeInc = response.data.home_inclusions;
                $scope.homeSch = response.data.homeSch;
                $scope.clinicProd = response.data.clinic_product;
                $scope.clinicInc = response.data.clinic_inclusions;
                $scope.clinicSch = response.data.clinicSch;
                $scope.packages = response.data.packages;
                $scope.services = response.data.services;
                //$ionicLoading.hide();
                angular.forEach($scope.videoSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    console.log(supsassId);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId}
                    }).then(function successCallback(responseData) {
                        console.log(responseData.data);
                        //$ionicLoading.hide();
                        $scope.vSch[key] = responseData.data.slots;
                        $scope.schV[key] = supsassId;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
                console.log($scope.videoSch);
                angular.forEach($scope.clinicSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    console.log(supsassId);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId}
                    }).then(function successCallback(responseData) {
                        console.log(responseData.data);
                        //$ionicLoading.hide();
                        $scope.cSch[key] = responseData.data.slots;
                        $scope.schC[key] = supsassId;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
                angular.forEach($scope.homeSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    console.log(supsassId);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId}
                    }).then(function successCallback(responseData) {
                        console.log(responseData.data);
                        //$ionicLoading.hide();
                        $scope.hSch[key] = responseData.data.slots;
                        $scope.schH[key] = supsassId;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
                //console.log(response);
            });
            $scope.getNextSlots = function (nextDate, supsassId) {
                console.log(nextDate + '=======' + supsassId);
                //$ionicLoading.show({template: 'Loading...'});
                /*$http({
                 method: 'GET',
                 url: domain + 'doctors/get-doctors-availability',
                 params: {id: supsassId}
                 }).then(function successCallback(response) {
                 console.log(response);
                 //$ionicLoading.hide();
                 
                 }, function errorCallback(response) {
                 console.log(response);
                 });*/
            };
            $scope.bookSlot = function (timeslot, supid) {
                //console.log(timeslot + '===' + supid);
                $scope.bookingSlot = timeslot;
                $scope.supId = supid;
            };
            $scope.bookAppointment = function (prodId) {
//                console.log(prodId + '--' + $scope.bookingSlot + '==' + $scope.supId);
//                var data = [{"supid": $scope.supId, "slot": $scope.bookingSlot, "prodid": prodId}];
//                store(data);
                window.localStorage.setItem('supid', $scope.supId);
                window.localStorage.setItem('slot', $scope.bookingSlot);
                window.localStorage.setItem('prodid', prodId);
                window.localStorage.setItem('url', 'app.payment');
                $rootScope.supid = $scope.supId;
                $rootScope.slot = $scope.bookingSlot;
                $rootScope.prodid = prodId;
                $rootScope.url = 'app.payment';
                $rootScope.$digest;
                if (checkLogin())
                    $state.go('app.payment');
                else
                    $state.go('auth.login');
            };
        })
        .controller('PaymentCtrl', function ($scope, $http, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $cordovaInAppBrowser) {
            $scope.supid = window.localStorage.getItem('supid');
            $scope.slot = window.localStorage.getItem('slot');
            $scope.prodid = window.localStorage.getItem('prodid');
            //console.log(supid + '--' + slot + '---' + prodid);
            $http({
                method: 'GET',
                url: domain + 'doctors/get-order-review',
                params: {id: $scope.supid, prodId: $scope.prodid}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                //$ionicLoading.hide();
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.payNow = function () {
                //console.log($location.absUrl() + '--' + $location.protocol() + '---' + $location.host() + '---' + $location.port());
                $scope.appUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port();
                $scope.userId = get('id');
                console.log($scope.prodid + '--' + $scope.userId);
                $http({
                    method: 'GET',
                    url: domain + 'buy/buy-individual',
                    params: {prodId: $scope.prodid, userId: $scope.userId, appUrl: $scope.appUrl}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    //$ionicLoading.hide();
                    var href = response.data; //'http://infinisystem.com/';
                    var options = {
                        location: 'no',
                        clearcache: 'yes',
                        toolbar: 'no'
                    };
                    var req = $cordovaInAppBrowser.open(href, '_self', options)
                            .then(function (e) {
                                console.log('successfully load');
                                // success
                            })
                            .catch(function (e) {
                                // error
                            });
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        }
        )
        .controller('SuccessCtrl', function ($scope, $http, $stateParams) {
            $scope.slot = window.localStorage.getItem('slot');
            $http({
                method: 'GET',
                url: domain + 'orders/get-order-details',
                params: {id: $stateParams.id, serviceId: $stateParams.serviceId, slot: $scope.slot}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                //$ionicLoading.hide();
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
                $scope.appointment = responseData.data.appointment;
            }, function errorCallback(response) {
                console.log(response);
            });
            window.localStorage.removeItem('supid');
            window.localStorage.removeItem('slot');
            window.localStorage.removeItem('prodid');
        })
        .controller('CurrentTabCtrl', function ($scope, $http, $stateParams) {
            $scope.appId = $stateParams.id;
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'appointment/get-app-details',
                params: {id: $scope.appId, userId: $scope.userId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.app = response.data.app;
                $scope.doctor = response.data.doctorsData;
                $scope.products = response.data.products;

            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('DoctorConsultationsCtrl', function ($scope, $http, $stateParams) {
            $scope.drId = get('id');
            $http({
                method: 'GET',
                url: domain + 'appointment/get-patient-details',
                params: {id: $scope.drId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.appointments = response.data.appointments;
                $scope.usersData = response.data.usersData;
                $scope.products = response.data.products;
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('DoctorCurrentTabCtrl', function ($scope, $http, $stateParams) {
            $scope.appId = $stateParams.id;
            $scope.drId = get('id');
            $http({
                method: 'GET',
                url: domain + 'appointment/get-patient-app-details',
                params: {id: $scope.appId, drId: $scope.drId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.app = response.data.app;
                $scope.user = response.data.userData;
                $scope.products = response.data.products;

            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('FilterCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('DoctorJoinCtrl', function ($scope, $http, $stateParams) {
            $scope.appId = $stateParams.id;
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'appointment/join-patient',
                params: {id: $scope.appId, userId: $scope.userId}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.user = response.data.user;
                $scope.app = response.data.app;
                $scope.oToken = response.data.oToken;
                var apiKey = '45463682';
                var sessionId = $scope.app[0].appointments.opentok_session_id;
                var token = $scope.oToken;
                var session = OT.initSession(apiKey, sessionId);
                session.on({
                    streamCreated: function (event) {
                        session.subscribe(event.stream, 'subscribersDiv', {insertMode: 'append'});
                    }
                });
                session.connect(token, function (error) {
                    if (error) {
                        console.log(error.message);
                    } else {
                        session.publish('myPublisherDiv', {width: 130, height: 110});
                    }
                });
            }, function errorCallback(e) {
                console.log(e);
            });
        })


//this method brings posts for a source provider
        .controller('FeedEntriesCtrl', function ($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService) {
            $scope.feed = [];
            var categoryId = $stateParams.categoryId,
                    sourceId = $stateParams.sourceId;
            $scope.doRefresh = function () {

                $http.get('feeds-categories.json').success(function (response) {

                    $ionicLoading.show({
                        template: 'Loading entries...'
                    });
                    var category = _.find(response, {id: categoryId}),
                            source = _.find(category.feed_sources, {id: sourceId});
                    $scope.sourceTitle = source.title;
                    FeedList.get(source.url)
                            .then(function (result) {
                                $scope.feed = result.feed;
                                $ionicLoading.hide();
                                $scope.$broadcast('scroll.refreshComplete');
                            }, function (reason) {
                                $ionicLoading.hide();
                                $scope.$broadcast('scroll.refreshComplete');
                            });
                });
            };
            $scope.doRefresh();
            $scope.bookmarkPost = function (post) {
                $ionicLoading.show({template: 'Post Saved!', noBackdrop: true, duration: 1000});
                BookMarkService.bookmarkFeedPost(post);
            };
        })

// SETTINGS
        .controller('SettingsCtrl', function ($scope, $ionicActionSheet, $state) {
            $scope.airplaneMode = true;
            $scope.wifi = false;
            $scope.bluetooth = true;
            $scope.personalHotspot = true;
            $scope.checkOpt1 = true;
            $scope.checkOpt2 = true;
            $scope.checkOpt3 = false;
            $scope.radioChoice = 'B';
            // Triggered on a the logOut button click
            $scope.showLogOutMenu = function () {

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    //Here you can add some more buttons
                    // buttons: [
                    // { text: '<b>Share</b> This' },
                    // { text: 'Move' }
                    // ],
                    destructiveText: 'Logout',
                    titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
                    cancelText: 'Cancel',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        //Called when one of the non-destructive buttons is clicked,
                        //with the index of the button that was clicked and the button object.
                        //Return true to close the action sheet, or false to keep it opened.
                        return true;
                    },
                    destructiveButtonClicked: function () {
                        //Called when the destructive button is clicked.
                        //Return true to close the action sheet, or false to keep it opened.
                        $state.go('auth.walkthrough');
                    }
                });
            };
        })

// TINDER CARDS
        .controller('TinderCardsCtrl', function ($scope, $http) {

            $scope.cards = [];
            $scope.addCard = function (img, name) {
                var newCard = {image: img, name: name};
                newCard.id = Math.random();
                $scope.cards.unshift(angular.extend({}, newCard));
            };
            $scope.addCards = function (count) {
                $http.get('http://api.randomuser.me/?results=' + count).then(function (value) {
                    angular.forEach(value.data.results, function (v) {
                        $scope.addCard(v.user.picture.large, v.user.name.first + " " + v.user.name.last);
                    });
                });
            };
            $scope.addFirstCards = function () {
                $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png", "Nope");
                $scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
            };
            $scope.addFirstCards();
            $scope.addCards(5);
            $scope.cardDestroyed = function (index) {
                $scope.cards.splice(index, 1);
                $scope.addCards(1);
            };
            $scope.transitionOut = function (card) {
                console.log('card transition out');
            };
            $scope.transitionRight = function (card) {
                console.log('card removed to the right');
                console.log(card);
            };
            $scope.transitionLeft = function (card) {
                console.log('card removed to the left');
                console.log(card);
            };
        })


// BOOKMARKS
        .controller('BookMarksCtrl', function ($scope, $rootScope, BookMarkService, $state) {

            $scope.bookmarks = BookMarkService.getBookmarks();
            // When a new post is bookmarked, we should update bookmarks list
            $rootScope.$on("new-bookmark", function (event) {
                $scope.bookmarks = BookMarkService.getBookmarks();
            });
            $scope.goToFeedPost = function (link) {
                window.open(link, '_blank', 'location=yes');
            };
            $scope.goToWordpressPost = function (postId) {
                $state.go('app.post', {postId: postId});
            };
        })

// WORDPRESS
        .controller('WordpressCtrl', function ($scope, $http, $ionicLoading, PostService, BookMarkService) {
            $scope.posts = [];
            $scope.page = 1;
            $scope.totalPages = 1;
            $scope.doRefresh = function () {
                $ionicLoading.show({
                    template: 'Loading posts...'
                });
                //Always bring me the latest posts => page=1
                PostService.getRecentPosts(1)
                        .then(function (data) {
                            $scope.totalPages = data.pages;
                            $scope.posts = PostService.shortenPosts(data.posts);
                            $ionicLoading.hide();
                            $scope.$broadcast('scroll.refreshComplete');
                        });
            };
            $scope.loadMoreData = function () {
                $scope.page += 1;
                PostService.getRecentPosts($scope.page)
                        .then(function (data) {
                            //We will update this value in every request because new posts can be created
                            $scope.totalPages = data.pages;
                            var new_posts = PostService.shortenPosts(data.posts);
                            $scope.posts = $scope.posts.concat(new_posts);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
            };
            $scope.moreDataCanBeLoaded = function () {
                return $scope.totalPages > $scope.page;
            };
            $scope.bookmarkPost = function (post) {
                $ionicLoading.show({template: 'Post Saved!', noBackdrop: true, duration: 1000});
                BookMarkService.bookmarkWordpressPost(post);
            };
            $scope.doRefresh();
        })

// WORDPRESS POST
        .controller('WordpressPostCtrl', function ($scope, post_data, $ionicLoading) {

            $scope.post = post_data.post;
            $ionicLoading.hide();
            $scope.sharePost = function (link) {
                window.plugins.socialsharing.share('Check this post here: ', null, null, link);
            };
        })


        .controller('ImagePickerCtrl', function ($scope, $rootScope, $cordovaCamera) {

            $scope.images = [];
            $scope.selImages = function () {

                window.imagePicker.getPictures(
                        function (results) {
                            for (var i = 0; i < results.length; i++) {
                                console.log('Image URI: ' + results[i]);
                                $scope.images.push(results[i]);
                            }
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        }, function (error) {
                    console.log('Error: ' + error);
                }
                );
            };
            $scope.removeImage = function (image) {
                $scope.images = _.without($scope.images, image);
            };
            $scope.shareImage = function (image) {
                window.plugins.socialsharing.share(null, null, image);
            };
            $scope.shareAll = function () {
                window.plugins.socialsharing.share(null, null, $scope.images);
            };
        })

        ;
