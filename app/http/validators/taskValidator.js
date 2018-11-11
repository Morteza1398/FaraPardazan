const validator = require('./validator');
const { check } = require('express-validator/check');
const Task = require('app/models/task');
const path = require('path');

class taskValidator extends validator {
    
    handle() {
        return [
            check('title')
                .isLength({ min : 5 })
                .withMessage('عنوان نمیتواند کمتر از 5 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let task = await Task.findById(req.params.id);
                        if(task.title === value) return;
                    }
                    let task = await Task.findOne({ title : value });
                    if(task) {
                        throw new Error('چنین فعالیتی با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),
                check('goal')
                    .isLength({ min : 10 })
                    .withMessage('متن هدف نمیتواند کمتر از 10 کاراکتر باشد'),
                check('body')
                    .isLength({ min : 20 })
                    .withMessage('متن توضیحات نمیتواند کمتر از 20 کاراکتر باشد')
        ]
    }

    
    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new  taskValidator();