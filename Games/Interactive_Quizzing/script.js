// Lecture: Clear Results

/*******************************
*********QUIZ CONTROLLER********
*******************************/
// 1
var quizController = (function () {

    // 4
    //*********Question Constructor*********/
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    //34
    var questionLocalStorage = {
        // 35
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        // 36
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        // 37
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection');
        }
    }
    // 90
    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }
    //206
    var quizProgress = {
        questionIndex: 0
    };
    //281
    //***************PERSON CONSTRUCTOR*****************/
    function Person(id, firstname, lastname, score) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }
    // 294
    var currPersonData = {
        fullname: [],
        score: 0
    };
    // 305
    var adminFullName = ['Admin', 'Admin'];
    // 282
    var personLocalStorage = {
        // 283
        setPersonData: function (newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        // 284
        getPersonData: function () {
            return JSON.parse(localStorage.getItem('personData'));
        },
        // 285
        removePersonData: function () {
            localStorage.removeItem('personData');
        }
    };
    // 286
    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }
    // 13
    return {
        // 207
        getQuizProgress: quizProgress,
        // 80
        getQuestionLocalStorage: questionLocalStorage,
        // 14
        addQuestionOnLocalStorage: function (newQuestText, opts) {
            // 18
            // 19           // 25    // 29       // 31    // 43            // 59
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
            // 48
            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }
            //20
            optionsArr = [];
            // 30 -- // 41 - Delete --> questionId = 0;
            // questionId = 0;
            // 21
            for (var i = 0; i < opts.length; i++) {
                // 22
                if (opts[i].value !== '') {
                    // 23
                    optionsArr.push(opts[i].value);
                }
                // 26
                if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    // 27
                    corrAns = opts[i].value;
                    // 60
                    isChecked = true;
                }
            }

            // 38
            // [ {id: 0}, {id: 1} ]

            // 39
            if (questionLocalStorage.getQuestionCollection().length > 0) {
                // 42
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
                // 40    
            } else {
                questionId = 0;
            }
            // 52
            if (newQuestText.value !== "") {
                // 55
                if (optionsArr.length > 1) {
                    // 58
                    if (isChecked) {
                        // 32
                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
                        // 44
                        getStoredQuests = questionLocalStorage.getQuestionCollection();
                        // 45
                        getStoredQuests.push(newQuestion);
                        // 46
                        questionLocalStorage.setQuestionCollection(getStoredQuests);
                        // 24
                        // 28
                        // 33
                        // 48
                        newQuestText.value = "";
                        // 49
                        for (var x = 0; x < opts.length; x++) {
                            // 50
                            opts[x].value = "";
                            // 51
                            opts[x].previousElementSibling.checked = false;
                        }
                        // 47
                        // 96
                        return true;
                        // 61
                    } else {
                        // 62
                        alert('You missed to check correct answer, or you checked answer without value');
                        //97
                        return false;
                    }
                    // 56
                } else {
                    // 57
                    alert('You must insert at least two options');
                    // 98
                    return false;
                }
                // 53
            } else {
                // 54
                alert('Please, Insert Question');
                // 99
                return false;
            }
        },
        // 231
        checkAnswer: function (ans) {
            // 233
            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
                // 335
                currPersonData.score++;
                // 234
                // 237
                return true;
                // 235
            } else {
                // 236
                // 238
                return false;
            }
        },
        // 268
        isFinished: function () {
            // 269
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },
        // 287
        addPerson: function () {
            // 288              // 290
            var newPerson, personId, personData;
            // 291
            if (personLocalStorage.getPersonData().length > 0) {
                // 292
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
                // 293
            } else {
                personId = 0
            }
            // 289                              // 294
            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);
            // 297
            personData = personLocalStorage.getPersonData();
            // 298
            personData.push(newPerson);
            // 299
            personLocalStorage.setPersonData(personData);
            // 295
        },
        // 304
        getCurrPersonData: currPersonData,
        // 306
        getAdminFullName: adminFullName,
        // 341
        getPersonLocalStorage: personLocalStorage
    };

})();

/*******************************
**********UI CONTROLLER*********
*******************************/
// 2
var UIController = (function () {

    // 5
    var domItems = {
        //*******Admin Panel Elements********/
        adminPanelSection: document.querySelector('.admin-panel-container'), // 322
        questInsertBtn: document.getElementById('question-insert-btn'), // 6
        newQuestionText: document.getElementById('new-question-text'), // 15
        adminOptions: document.querySelectorAll('.admin-option'), // 16
        adminOptionsContainer: document.querySelector(".admin-options-container"), // 65
        insertedQuestsWrapper: document.querySelector(".inserted-questions-wrapper"), // 83
        questUpdateBtn: document.getElementById('question-update-btn'), // 133
        questDeleteBtn: document.getElementById('question-delete-btn'), // 134
        questsClearBtn: document.getElementById('questions-clear-btn'), // 138
        resultsListWrapper: document.querySelector('.results-list-wrapper'), // 344
        clearResultsBtn: document.getElementById('results-clear-btn'), // 363
        //*******Quiz Section Elements*********/
        quizSection: document.querySelector('.quiz-container'), // 315
        askedQuestText: document.getElementById('asked-question-text'), // 204
        quizoptionsWrapper: document.querySelector('.quiz-options-wrapper'), // 208
        progressBar: document.querySelector('progress'), // 219
        progressPar: document.getElementById('progress'), // 222
        instAnsContainer: document.querySelector('.instant-answer-container'), // 242
        instAnsText: document.getElementById('instant-answer-text'), // 247
        instAnsDiv: document.getElementById('instant-answer-wrapper'), // 254
        emotionIcon: document.getElementById('emotion'), // 257
        nextQuestbtn: document.getElementById('next-question-btn'), // 262
        //***********Landing Page Elements************/
        landPageSection: document.querySelector('.landing-page-container'), // 314
        startQuizBtn: document.getElementById('start-quiz-btn'), // 300
        firstNameInput: document.getElementById('firstname'), //309
        lastNameInput: document.getElementById('lastname'), // 310
        //*************Final Result Section Elements***********/
        finalResultSection: document.querySelector('.final-result-container'), // 337
        finalScoreText: document.getElementById('final-score-text') // 333
    };

    // 7
    return {
        getDomItems: domItems, // 8
        // 63
        addInputsDynamically: function () {
            // 67
            var addInput = function () {
                // 68
                // 69         // 71
                var inputHTML, z;
                // 72
                z = document.querySelectorAll(".admin-option").length;
                // 70                                                                                 //73    
                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';
                // 74
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
                // 75
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                // 76
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }
            // 66
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        // 79
        createQuestionList: function (getQuestions) {
            // 86          // 91
            var questHTML, numberingArr;
            // 92
            numberingArr = [];
            // 82
            // 84
            domItems.insertedQuestsWrapper.innerHTML = "";
            // 85
            for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                // 93
                numberingArr.push(i + 1);
                // 87                     // 94                    // 88
                questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';
                // 95
                // 89
                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },
        // 104                                           // 130                // 132              // 176
        editQuestList: function (event, storageQuestList, addInpsDynFn, updateQuestListFn) {
            // 109     // 113               // 117     // 119      // 125
            var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;
            // 107
            if ('question-'.indexOf(event.target.id)) {
                // 110  // 112
                getId = parseInt(event.target.id.split('-')[1]);
                // 114
                getStorageQuestList = storageQuestList.getQuestionCollection();
                // 115
                for (var i = 0; i < getStorageQuestList.length; i++) {
                    // 116
                    if (getStorageQuestList[i].id === getId) {
                        // 118
                        foundItem = getStorageQuestList[i];
                        // 120
                        placeInArr = i;
                    }
                }
                // 121
                // 122
                domItems.newQuestionText.value = foundItem.questionText;
                // 123
                domItems.adminOptionsContainer.innerHTML = '';
                // 128
                optionHTML = '';
                // 124
                for (var x = 0; x < foundItem.options.length; x++) {
                    // 126
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>';
                }
                // 129
                domItems.adminOptionsContainer.innerHTML = optionHTML;
                // 135
                domItems.questDeleteBtn.style.visibility = 'visible';
                // 136
                domItems.questUpdateBtn.style.visibility = 'visible';
                // 137
                domItems.questInsertBtn.style.visibility = 'hidden';
                // 139
                domItems.questsClearBtn.style.pointerEvents = 'none';
                // 127
                // 132
                addInpsDynFn();
                // 144
                // 184
                var backDefaultView = function () {
                    // 185
                    var updatedOptions;
                    // CUT from updateQuestions Function
                    // 168
                    domItems.newQuestionText.value = '';
                    // 186
                    updatedOptions = document.querySelectorAll('.admin-option');
                    // 169
                    for (var i = 0; i < updatedOptions.length; i++) {
                        // 170
                        updatedOptions[i].value = '';
                        // 171
                        updatedOptions[i].previousElementSibling.checked = false;
                    }
                    // 172
                    domItems.questDeleteBtn.style.visibility = 'hidden';
                    // 173
                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    // 174
                    domItems.questInsertBtn.style.visibility = 'visible';
                    // 175
                    domItems.questsClearBtn.style.pointerEvents = '';
                    // 178
                    updateQuestListFn(storageQuestList);
                }
                // 141
                var updateQuestion = function () {
                    // 147          // 149
                    var newOptions, optionEls;
                    // 148
                    newOptions = [];
                    // 150
                    optionEls = document.querySelectorAll('.admin-option');
                    // 143
                    foundItem.questionText = domItems.newQuestionText.value;
                    // 146
                    foundItem.correctAnswer = '';
                    // 151
                    for (var i = 0; i < optionEls.length; i++) {
                        // 152
                        if (optionEls[i].value !== '') {
                            // 153
                            newOptions.push(optionEls[i].value);
                            // 154
                            if (optionEls[i].previousElementSibling.checked) {
                                // 155
                                foundItem.correctAnswer = optionEls[i].value;
                            }
                        }
                    }
                    // 156
                    foundItem.options = newOptions;
                    // 159
                    if (foundItem.questionText !== '') {
                        // 162
                        if (foundItem.options.length > 1) {
                            // 165
                            if (foundItem.correctAnswer !== '') {
                                // 157
                                getStorageQuestList.splice(placeInArr, 1, foundItem);
                                // 158
                                storageQuestList.setQuestionCollection(getStorageQuestList);
                                // 187
                                backDefaultView();
                                // 166
                            } else {
                                // 167
                                alert('You missed to check correct answer, or you checked answer without value');
                            }
                            // 163
                        } else
                            // 164
                            alert('You must insert at least two options');
                        // 160
                    } else {
                        // 161
                        alert('Please, insert question');
                    }
                    // 142
                    // 145
                }
                // 140
                domItems.questUpdateBtn.onclick = updateQuestion;
                // 180
                var deleteQuestion = function () {
                    // 181
                    // 182
                    getStorageQuestList.splice(placeInArr, 1);
                    // 183
                    storageQuestList.setQuestionCollection(getStorageQuestList);
                    // 188
                    backDefaultView();
                }
                // 179
                domItems.questDeleteBtn.onclick = deleteQuestion;

            }
            // 106
            // 108
            // 111
        },
        // 190
        clearQuestList: function (storageQuestList) {
            //199
            if (storageQuestList.getQuestionCollection() !== null) {
                // 192
                // 193
                if (storageQuestList.getQuestionCollection().length > 0) {
                    // 194
                    var conf = confirm('Warning! You will lose entire question list');
                    // 195
                    // 196
                    if (conf) {
                        // 197
                        storageQuestList.removeQuestionCollection();
                        // 198
                        domItems.insertedQuestsWrapper.innerHTML = '';
                    }
                }
            }
        },
        // 200
        displayQuestion: function (storageQuestList, progress) {
            // 211                         // 213
            var newOptionHTML, characterArr;
            // 214
            characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];
            // 202
            // 203
            if (storageQuestList.getQuestionCollection().length > 0) {
                // 205
                domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                // 209
                domItems.quizoptionsWrapper.innerHTML = '';
                // 210
                for (var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    // 212
                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] + '</span><p  class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';
                    // 215
                    domItems.quizoptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },
        // 216
        displayProgress: function (storageQuestList, progress) {
            // 218
            // 220
            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            // 221
            domItems.progressBar.value = progress.questionIndex + 1;
            // 223
            domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestList.getQuestionCollection().length;
        },
        // 239
        newDesign: function (ansResult, selectedAnswer) {
            // 244               // 249
            var twoOptions, index;
            // 250
            index = 0;
            // 252 
            if (ansResult) {
                // 253
                index = 1;
            }
            // 245
            twoOptions = {
                // 246
                instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
                // 255
                instAnswerClass: ['red', 'green'],
                // 258
                emotionType: ['images/sad.png', 'images/happy.png'],
                // 261
                optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)']
            };
            // 241
            domItems.quizoptionsWrapper.style.cssText = 'opacity: 0.6; pointer-events: none;';
            // 243
            domItems.instAnsContainer.style.opacity = '1';
            // 248                                                                                               // 251
            domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
            // 256
            domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];
            // 259
            domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);
            // 260
            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];
        },
        // 271
        resetDesign: function () {
            // 272
            domItems.quizoptionsWrapper.style.cssText = '';
            // 273
            domItems.instAnsContainer.style.opacity = '0';
        },
        // 302
        getFullName: function (currPerson, storageQuestList, admin) {
            // 323
            if (domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== '') {
                // 318
                if (!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {
                    // 325
                    if (storageQuestList.getQuestionCollection().length > 0) {
                        // 311
                        currPerson.fullname.push(domItems.firstNameInput.value);
                        // 312
                        currPerson.fullname.push(domItems.lastNameInput.value);
                        // 308
                        // 316
                        domItems.landPageSection.style.display = 'none';
                        // 317
                        domItems.quizSection.style.display = 'block';
                        // 313
                        // 326
                    } else {
                        alert('Quiz is not ready, please contact to administrator');
                    }
                    // 319
                } else {
                    // 320
                    domItems.landPageSection.style.display = 'none';
                    // 321
                    domItems.adminPanelSection.style.display = 'block';
                }
                // 324
            } else {
                alert('Please, enter your first name and last name');
            }
        },
        // 331
        finalResult: function (currPerson) {
            // 334
            domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', ' + 'your final score is ' + currPerson.score;
            // 336
            domItems.quizSection.style.display = 'none';
            // 338
            domItems.finalResultSection.style.display = 'block';
        },
        // 339
        addResultOnPanel: function (userData) {
            // 343
            var resultHTML;
            // 345
            domItems.resultsListWrapper.innerHTML = '';
            // 346
            for (var i = 0; i < userData.getPersonData().length; i++) {
                // 347
                resultHTML = '<p class="person person-' + i + '"><span class="person-' + i + '">' + userData.getPersonData()[i].firstname + ' ' + userData.getPersonData()[i].lastname + ' - ' + userData.getPersonData()[i].score + ' Points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
                // 348
                domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
            }
        },
        // 350
        deleteResult: function (event, userData) {
            // 353       // 356
            var getId, personArr;
            // 357
            personArr = userData.getPersonData();
            // 352
            if ('delete-result-btn_'.indexOf(event.target.id)) {
                // 354
                getId = parseInt(event.target.id.split('_')[1]);
                // 355
                // 358
                for (var i = 0; i < personArr.length; i++) {
                    // 359
                    if (personArr[i].id === getId) {
                        // 360
                        personArr.splice(i, 1);
                        // 361
                        userData.setPersonData(personArr);
                    }
                }
            }
        },
        // 365
        clearResultList: function (userData) {
            // 367
            var conf;
            // 373
            if (userData.getPersonData() !== null) {
                // 372
                if (userData.getPersonData().length > 0) {
                    // 368
                    conf = confirm('Warning! You will lose entire result list');
                    // 369
                    if (conf) {
                        // 370
                        userData.removePersonData();
                        // 371
                        domItems.resultsListWrapper.innerHTML = '';
                    }
                }
            }
        }
    };

})();

/********************************
***********CONTROLLER*********
********************************/
// 3
var controller = (function (quizCtrl, UICtrl) {

    // 11
    var selectedDomItems = UICtrl.getDomItems;
    // 64
    UICtrl.addInputsDynamically();
    // 81
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    // 9 -- //12 (change with var selectedDomItems)
    selectedDomItems.questInsertBtn.addEventListener('click', function () {
        // 77
        var adminOptions = document.querySelectorAll('.admin-option');
        // 10
        // 100             // 17                                                                // 78
        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
        // 101
        if (checkBoolean) {
            // 102
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }

    });

    // 103
    selectedDomItems.insertedQuestsWrapper.addEventListener('click', function (e) {
        // 105                                                    // 131                        // 132                           
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);// 177
    });

    // 189
    selectedDomItems.questsClearBtn.addEventListener('click', function () {
        // 191
        UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
    });
    // 201
    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    // 217
    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    // 224
    selectedDomItems.quizoptionsWrapper.addEventListener('click', function (e) {
        // 225
        // 226
        var updatedOptionsDiv = selectedDomItems.quizoptionsWrapper.querySelectorAll('div');
        // 227
        for (var i = 0; i < updatedOptionsDiv.length; i++) {
            // 228
            if (e.target.className === 'choice-' + i) {
                // 229
                // 230
                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                // 232
                var answerResult = quizCtrl.checkAnswer(answer);
                // 240
                UICtrl.newDesign(answerResult, answer);
                //279
                if (quizCtrl.isFinished()) {
                    // 280
                    selectedDomItems.nextQuestbtn.textContent = 'Finish';
                }
                // 265
                var nextQuestion = function (questData, progress) {
                    // 267
                    if (quizCtrl.isFinished()) {
                        // 296
                        quizCtrl.addPerson();
                        // 332
                        UICtrl.finalResult(quizCtrl.getCurrPersonData);
                        // 278
                        // 270
                    } else {
                        // 274
                        UICtrl.resetDesign();
                        // 275
                        quizCtrl.getQuizProgress.questionIndex++;
                        // 276
                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                        // 277
                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                    }
                }
                // 264
                selectedDomItems.nextQuestbtn.onclick = function () {
                    // 266
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                }
            }
        }
    });
    // 301
    selectedDomItems.startQuizBtn.addEventListener('click', function () {
        // 303                      // 307
        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
    });
    // 327
    selectedDomItems.lastNameInput.addEventListener('focus', function () {
        // 328
        selectedDomItems.lastNameInput.addEventListener('keypress', function (e) {
            // 329
            if (e.keyCode === 13) {
                // 330
                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
            }
        });
    });
    // 340                              // 342
    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    // 349
    selectedDomItems.resultsListWrapper.addEventListener('click', function (e) {
        // 351
        UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
        // 362
        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    });
    // 364
    selectedDomItems.clearResultsBtn.addEventListener('click', function () {
        // 366
        UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
    });

})(quizController, UIController);










