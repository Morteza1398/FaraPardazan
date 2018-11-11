const controller = require('app/http/controllers/controller');
const Task = require('app/models/task');
const User = require('app/models/user');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class taskController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let tasks = await Task.paginate({} , { page , sort : { createdAt : 1 } , limit : 15 });
            res.render('admin/tasks/index',  { title : 'فعالیت ها' , tasks });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        
        let users = await User.find({});

        res.render('admin/tasks/create', { users});        
    }

    async store(req , res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) {
                if(req.file) 
                    fs.unlinkSync(req.file.path);
                return this.back(req,res);
            }

            // create course
            let { title , goal , assignto , body } = req.body;
            console.log(assignto);

            let newTask = new Task({
                user : req.user._id,
                title,
                goal,
                assignto,
                body
            });

            await newTask.save();

            return res.redirect('/admin/tasks');  
        } catch(err) {
            next(err);
        }
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let task = await Task.findById(req.params.id);
            if( ! task ) this.error('چنین فعالیتی وجود ندارد' , 404);

            if(! req.userCan('edit-tasts')) {
                this.error('شما اجازه دسترسی به این صفحه را ندارید', 403);
            }

            let users = await User.find({});
            return res.render('admin/tasks/edit' , { task , users });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) {
                if(req.file) 
                    fs.unlinkSync(req.file.path);
                return this.back(req,res);
            }

            let objForUpdate = {};

            // set image thumb
            objForUpdate.thumb = req.body.imagesThumb;

            // check image 
            if(req.file) {
                objForUpdate.images = this.imageResize(req.file);
                objForUpdate.thumb = objForUpdate.images[480];
            }

            delete req.body.images;
            objForUpdate.slug = this.slug(req.body.title);
            
            await Task.findByIdAndUpdate(req.params.id , { $set : { ...req.body , ...objForUpdate }})
            return res.redirect('/admin/tasks');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res  , next) {
        try {
            this.isMongoId(req.params.id);

            let course = await Course.findById(req.params.id).populate('episodes').exec();
            if( ! course ) this.error('چنین دوره ای وجود ندارد' , 404);

            // delete episodes
            course.episodes.forEach(episode => episode.remove());
            
            // delete Images
            Object.values(course.images).forEach(image => fs.unlinkSync(`./public${image}`));

            // delete courses
            course.remove();

            return res.redirect('/admin/courses');
        } catch (err) {
            next(err);
        }
    }

    imageResize(image) {
        const imageInfo = path.parse(image.path);
        
        let addresImages = {};
        addresImages['original'] = this.getUrlImage(`${image.destination}/${image.filename}`);

        const resize = size => {
            let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
            
            addresImages[size] = this.getUrlImage(`${image.destination}/${imageName}`);
            
            sharp(image.path)
                .resize(size , null) 
                .toFile(`${image.destination}/${imageName}`);
        }

        [1080 , 720 , 480].map(resize);

        return addresImages;
    }

    getUrlImage(dir) {
        return dir.substring(8);
    }
}

module.exports = new taskController();