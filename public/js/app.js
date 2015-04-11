var io = io.connect();

var magicListApp = angular.module('magicListApp', [
  'ui.router',
  'ui.bootstrap.modal',
  'magicListcontrollers',
  'AppService',
  'ngStorage',
  'ui.bootstrap.contextMenu',
  'ui.bootstrap.dropdown',
  'magicListDirectives',
  'ui.bootstrap.datepicker',
  'angularFileUpload',
  'magicListFilters',
  'pascalprecht.translate'
  ]);

magicListApp.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/home");

  $stateProvider
  .state('home', {
    url: "/home",
    templateUrl: "template/home.html",
    controller: "home"
  })
  .state('signup', {
    url: "/signup",
    templateUrl: "template/signup.html",
    controller: "signup"
  })
  .state('app', {
    url: "/app/:listId",
    templateUrl: "template/app.html",
    controller: "app"
  });

}]);

magicListApp.config(['$translateProvider',
  function ($translateProvider) {
    $translateProvider.translations('en', {
      'home': {
        'authForm': {
          'emailErr': 'Email is required.',
          'password': 'Password',
          'passErr': 'Password is required.',
          'authErr': 'Invalid username or password.',
          'signIn': 'Sign In'
        },
        'mainTop': {
          'title': 'Your life in sync',
          'description': 'MagicList is the easiest way to get stuff done. Whether you’re organizing your work, sharing a shopping list with a loved one or planning an overseas adventure, MagicList is here to help you accomplish more.',
          'signUp': 'Create account  &raquo;'
        },
        'mainBottom': {
          'col_1': {
            'title': 'Share lists and collaborate with family and friends',
            'description': 'Whether you’re sharing a grocery list with a loved one, working on a project, or planning a vacation, MagicList makes it easy to collaborate with everyone in your life.'
          },
          'col_2': {
            'title': 'Real-time Sync',
            'description': "Whether you’re updating your grocery list on the go or collaborating with co-workers in the office, MagicList's Real-time Sync instantly keeps all your lists up-to-date no matter where you are."
          },
          'col_3': {
            'title': 'Plan for anything',
            'description': 'Organize and share your to-do, work, grocery, movies and household lists. No matter what you’re planning, how big or small the task may be, MagicList makes it super easy to get stuff done.'
          }
        },
        'copyright': '&copy; Maxim Tolochko 2015'
      },
      'signup': {
        'title': 'Registration',
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'password': 'Password',
        'passwordAgain': 'Password again',
        'firstNameErr': 'First Name is required.',
        'lastNameErr': 'Last Name is required.',
        'emailIsEmpty': 'Email is required.',
        'emailIsNotValid': 'Enter a valid email.',
        'emailIsAlreadyExist': 'User with this email is already exists.',
        'passwordIsEmpty': 'Password is required.',
        'passwordIsShort': 'Password is too short.',
        'passwordsIsNotComply': 'Passwords is not comply.',
        'registration': 'Submit'
      },
      'app': {
        'modal': {
          'save': 'Save',
          'cancel': 'Cancel',
          'add': 'Add',
          'done': 'Done',
          'listName': 'List name',
          'addList': 'Create a new list',
          'renameList': 'Rename list',
          'removeList': 'will deleted',      //доделать
          'removeListButton': 'Remove list',
          'leaveList': 'Are you seriously wont leave list',     //доделать
          'leaveListButton': 'Leave list',
          'delete': 'Confirm deleting',
          'deleteButton': 'Delete',
          'addListMembers': 'Add members to list',
          'addListMembersPlaceholder': 'Enter a new member email',
          'userIsNotExist': 'User with this email is not exists.',
          'userIsAlreadyInList': 'User already state in the list', //доделать
          'changeListMembers': 'Change members list'
        },
        'sidebar': {
          'accountSync': 'Synchronization',
          'changeBackground': 'Change background',
          'endSession': 'Exit'
        },
        'addTask': 'Add task',
        'showComplitedTasks': 'Show complited tasks',
        'deadline': 'Set due date',
        'addSubtask': 'Add subtask',
        'addFile': 'Add file',
        'updateDescription': 'Add description',
        'dragAndDropErr': 'Your browser is not support Drag&Drop'
      }
    });
 
    $translateProvider.translations('ru', {
      'home': {
        'authForm': {
          'emailErr': 'Введите Email.',
          'password': 'Пароль',
          'passErr': 'Введите пароль.',
          'authErr': 'Неверный Email или пароль.',
          'signIn': 'Войти'
        },
        'mainTop': {
          'title': 'Синхронизируйте свою жизнь',
          'description': 'Нам нравятся списки. Это могут быть мысли, задачи, или места, где стоит побывать. Если вы делитесь списком, то он влияет на мир вокруг вас. Это и есть MagicList.',
          'signUp': 'Зарегистрироваться  &raquo;'
        },
        'mainBottom': {
          'col_1': {
            'title': 'Делитесь своими материалами, достигайте большего в сотрудничестве с другими',
            'description': 'Вы можете делиться списком покупок в магазине с любимым человеком, работать над проектом, планировать отпуск, - MagicList упрощает любое сотрудничество.'
          },
          'col_2': {
            'title': 'Синхронизация в реальном времени',
            'description': 'Вы можете обновлять список покупок в магазине, работать над проектом вместе с коллегами по офису, — система синхронизации MagicList мгновенно обновит все ваши списки независимо от того, где вы находитесь.'
          },
          'col_3': {
            'title': 'Планы любого рода',
            'description': 'Создавайте и делитесь списками своих дел, покупок, фильмов, задач, стоящих перед вами дома и на работе. Неважно, что именно вы планируете, насколько велика ваша задача, – MagicList облегчает выполнение любого дела.'
          }
        },
        'copyright': '&copy; Максим Толочко 2015'
      },
      'signup': {
        'title': 'Регистрация нового пользователя',
        'firstName': 'Имя',
        'lastName': 'Фамилия',
        'password': 'Пароль',
        'passwordAgain': 'Повторите пароль',
        'firstNameErr': 'Имя обязательно для заполнения.',
        'lastNameErr': 'Фамилия обязательна для заполнения.',
        'emailIsEmpty': 'Email обязателен для заполнения.',
        'emailIsNotValid': 'Введите корректный email.',
        'emailIsAlreadyExist': 'Пользователь с таким email уже зарегистрирован.',
        'passwordIsEmpty': 'Пароль обязателен для заполнения.',
        'passwordIsShort': 'Пароль слишком короткий.',
        'passwordsIsNotComply': 'Пароли не совпадают.',
        'registration': 'Зарегистрироваться'
      },
      'app': {
        'modal': {
          'save': 'Сохранить',
          'cancel': 'Отмена',
          'add': 'Добавить',
          'done': 'Готово',
          'listName': 'Название',
          'addList': 'Создать новый список',
          'renameList': 'Переименовать',
          'removeList': 'будет удалён навсегда',
          'removeListButton': 'Удалить список',
          'leaveList': 'Вы действительно хотите покинуть список',
          'leaveListButton': 'Покинуть список',
          'delete': 'Поддтвердите удаление',
          'deleteButton': 'Удалить',
          'addListMembers': 'Добавить участников',
          'addListMembersPlaceholder': 'Введите email нового участника',
          'userIsNotExist': 'Пользователя с данным email не существует.',
          'userIsAlreadyInList': 'Пользователь уже является участником списка.',
          'changeListMembers': 'Изменить участников'
        },
        'sidebar': {
          'accountSync': 'Синхронизировать сейчас',
          'changeBackground': 'Сменить фон',
          'endSession': 'Выйти'
        },
        'addTask': 'Добавьте задачу',
        'showComplitedTasks': 'Показать завершённые задачи',
        'deadline': 'Установить срок',
        'addSubtask': 'Добавить подзадачу',
        'updateDescription': 'Добавить описание',
        'addFile': 'Добавить файл',
        'dragAndDropErr': 'Drag&Drop не поддерживается вашим браузером'
      }
    });
 
    $translateProvider.preferredLanguage('en');
}]);

magicListApp.run(['$rootScope', '$state', '$stateParams', 'SessionService',
  function ($rootScope, $state, $stateParams, SessionService) {
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        SessionService.checkAccess(event, toState, toParams, fromState, fromParams);
      }
    );
  }
]);