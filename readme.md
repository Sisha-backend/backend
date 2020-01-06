routes/api.js

	1. router.post('/registry', (req, res, next)...
		- Регистрация нового пользователя
		req: 
			Имя, email и пароль нового пользователя (пароль хэшируется)
			{
				"name":"your_name"
				"email":"your_email",
				"password":"your_password"
			}
		res: 
			status(400) 'Please enter a valid email' - недопустимая длина email
			status(400) 'Please enter a password with a length between 6 and 20 digits' - недопустимая длина пароля (должна быть от 6 до 20)
			status(400) 'This name already exist. Please, change it' - данное имя пользователя занято
			status(400) 'This email already exist. Please, change it' - данный email занят
			status(200) - пользователь зарегестрирован
			
	2. router.post('/login', function(req, res, next)...
		- Вход в систему
		req:
			email и пароль нового пользователя
			{
				"email":"your_email",
				"password":"your_password"
			}
		res:
			status(400) 'Please enter a valid email' - недопустимая длина email
			status(400) 'Please enter a password with a length between 6 and 20 digits' - недопустимая длина пароля (должна быть от 6 до 20)
			status(400) 'User not found' - пользователь не найден
			status(400) 'Wrong password' - неправильный пароль
			status(200) - осуществляется вход и передается токен
			
	3. router.post('/questions', (req, res, next)...
		- Добавление нового вопроса
		req:
			Текст вопроса и варианты ответов с указанием правильного/неправильного
			{
				"text": "your_question",
				"answers": 
					[ 
						{
							"Text": "answer_text1",
							"IsRight": true/false	
						},
						{
							"Text": "answer_text2",
							"IsRight": true/false
						}
						{...}
					]
			}
		res:
			status(400) 'Please enter a valid question' - недопустимая длина вопроса (должна быть от 1 до 200 символов)
			status(200) - новый вопрос добавлен
			
	4. router.get('/questions', (req, res, next)...
		- Получение всех вопросов
		req:
			------
		res:
			status(400) - вопросы не найдены
			status(200) - возвращается список вопросов ({
    								"QuestionId": {
        										"_id": "QuestionId",
        										"text": "text_question",
       											"answers": [
            												{
               													"_id": "AnswerId1",
                												"Text": "Answer_text1",
                												"IsRight": true/false
            												},
            												{
               													"_id": "AnswerId2",
               													"Text": "Answer_text2",
               													"IsRight": true/false	           															},			
													{...},
        											],
        										"questionId": questionNumber,
        										"__v": 0
    										}
									}, 
									...
								  })
	
	5. router.get('/questions/:id', (req, res, next)...
		- Поиск вопроса по ID
		req:
			Номер вопроса (questionId)
		res:
			status(404) - введенное ":id" не является числом
			status(400) 'Question not found' - вопроса с таким ID не существует
			status(200) - возвращает искомый вопрос ({
    								"QuestionId": {
        									"_id": "QuestionId",
        									"quizId": quizNumber,
        									"text": "text_question",
       										"answers": [
            											{
             												"_id": "AnswerId1",
                											"Text": "Answer_text1",
                											"IsRight": true/false
            											},
            											{
                											"_id": "AnswerId2",
                											"Text": "Answer_text2",
                											"IsRight": true/false
            											},
												{...},
        										],
        									"questionId": questionNumber,
        									"__v": 0
    									}
								})
			
			
			
			
