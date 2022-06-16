const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);



module.exports.userSchema = Joi.object({
    user: Joi.object({
        name: Joi.string().required(),
        branch: Joi.string().required().escapeHTML(),
        rollno: Joi.number().integer().required(),
        cgpa: Joi.number().required().min(1).max(10),
        // image:Joi.string().required(),
        description: Joi.string().required().escapeHTML(),
        state: Joi.string().required().escapeHTML(),
        club: Joi.string().required().escapeHTML(),
        semester: Joi.number().required().min(1).max(8).integer(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.facultySchema = Joi.object({
    faculty: Joi.object({
        name: Joi.string().required().escapeHTML(),
        department: Joi.string().required().escapeHTML(),
        designation: Joi.string().required().escapeHTML(),
        experience: Joi.number().min(0).required(),
        qualifications: Joi.string().required().escapeHTML(),
        // image: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.remarkSchema = Joi.object({
    remark: Joi.object({
        body: Joi.string().required().escapeHTML(),
        performance: Joi.number().required().min(1).max(5),
    }).required()
});