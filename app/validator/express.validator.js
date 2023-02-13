const { oneOf } = require('express-validator');
const VALIDATE = require('../../constants/validation.constant')

module.exports.validate = function (method) {
  switch (method) {

    case 'register': { return [VALIDATE.NAME, VALIDATE.EMAIL, VALIDATE.PASSWORD] }
    case 'login': { return [VALIDATE.EMAIL, VALIDATE.PASSWORD] }

    case 'client-review/add': { return [VALIDATE.NAME, VALIDATE.RATING, VALIDATE.TEXT] }
    case 'client-review/edit': { return [VALIDATE.REVIEW_ID, VALIDATE.NAME, VALIDATE.RATING, VALIDATE.TEXT] }
    case 'client-review/delete': { return [VALIDATE.REVIEW_ID] }

    case 'client-logos/add': { return [VALIDATE.NAME] }
    case 'client-logos/delete': { return [VALIDATE.LOGO_ID] }

    case 'about-us': { return [VALIDATE.OUR_MISSION, VALIDATE.OUR_VISION] }
    case 'company-settings': { return [VALIDATE.NAME] }

    case 'our-team/add': { return [VALIDATE.NAME, VALIDATE.DESCRIPTION, VALIDATE.POSITION] }
    case 'our-team/edit': { return [VALIDATE.MEMBER_ID, VALIDATE.NAME, VALIDATE.DESCRIPTION, VALIDATE.POSITION] }
    case 'our-team/delete': { return [VALIDATE.MEMBER_ID] }

    case 'faqs/add': { return [VALIDATE.QUESTION, VALIDATE.ANSWER] }
    case 'faqs/edit': { return [VALIDATE.FAQ_ID, VALIDATE.QUESTION, VALIDATE.ANSWER] }
    case 'faqs/delete': { return [VALIDATE.FAQ_ID] }

    case 'banners/add': { return [VALIDATE.TITLE] }
    case 'banners/edit': { return [VALIDATE.BANNER_ID, VALIDATE.TITLE] }
    case 'banners/delete': { return [VALIDATE.BANNER_ID] }

    case 'blogs/add': { return [VALIDATE.AUTH_NAME, VALIDATE.CATEGORY, VALIDATE.TITLE] }
    case 'blogs/edit': { return [VALIDATE.BLOG_ID, VALIDATE.AUTH_NAME, VALIDATE.CATEGORY, VALIDATE.TITLE] }
    case 'blogs/delete': { return [VALIDATE.BLOG_ID] }

  }
}
