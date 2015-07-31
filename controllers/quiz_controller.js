var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(					//yhl.cambiar find por findById para local
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {next(new Error('No existe quizId=' + quizId)); }
		}
	).catch(function(error){next(error);});
};


// GET /quizes
exports.index = function(req,res) {
	models.Quiz.findAll().then(
		function(quizes){
			res.render('quizes/index', { quizes: quizes, errors: []});
	}
   ).catch(function(error) { next(error);})
};


// GET /quizes/:id
exports.show = function(req, res) {
//	models.Quiz.find(req.params.quizId).then(function(quiz) {	//yhl.cambié find por findById una vez// 
//	  res.render('quizes/show', { quiz: quiz});
//	})
	res.render('quizes/show', { quiz: req.quiz, errors: []});	//para autoload
};

// GET /quizes/:id/answer
//exports.answer = function(req, res) {
//	models.Quiz.find(req.params.quizId).then(function(quiz) {	//yhl.cambié find por findById
//		if (req.query.respuesta ===  quiz.respuesta) {
//			res.render('quizes/answer', 
//						{ quiz: quiz, respuesta: 'Correcto'});
//		} else {
//			res.render('quizes/answer', 
//						{ quiz: quiz, respuesta: 'Incorrecto'});
//		}
// })
exports.answer = function(req, res) {
	var resultado = 'Incorrecto'
	if (req.query.respuesta ===  req.quiz.respuesta) {
		resultado = 'Correcto'
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(	//Crea el objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

	quiz
	.validate()
	.then(
		function(err){
			if (err){
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz  //save: guarda en BD los campos preguta y respuesta de quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then( function(){ res.redirect('/quizes')})
			}	//res.redirect: REdirección HTTP (URL Relativo) lista de preguntas
		}
	);	
  
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz;	// autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz 	// save: guarda los campos pregunta y respuesta en BD
				.save( {fields: ["pregunta", "respuesta"]})
				.then( function(){ res.redirect('/quizes');});
			}				// Redirección HTTP a lista de preguntas (URL relativo)
		});
};

// PUT /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};



// GET /author
exports.author = function(req, res) {
	res.render('author', {errors: []});
};
